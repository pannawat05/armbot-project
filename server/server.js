require('dotenv').config();
const WebSocket = require('ws');

const PORT = Number(process.env.PORT || 8080);
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-live-translate-preview';
const TARGET_LANGUAGES = {
  Thai: 'th',
  English: 'en',
  Japanese: 'ja',
  Chinese: 'zh',
  Korean: 'ko'
};

if (!API_KEY) {
  console.error('GEMINI_API_KEY is required to start the dubbing server.');
  process.exit(1);
}

const geminiUrl = new URL(
  'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent'
);
geminiUrl.searchParams.set('key', API_KEY);

const wss = new WebSocket.Server({ port: PORT });
console.log(`Gemini Dubbing Server running on port ${PORT}`);

wss.on('connection', (clientWs, request) => {
  const requestUrl = new URL(request.url || '/', 'http://localhost');
  const language = requestUrl.searchParams.get('lang');
  const targetLanguageCode = TARGET_LANGUAGES[language];

  if (!Object.hasOwn(TARGET_LANGUAGES, language)) {
    clientWs.send(JSON.stringify({
      type: 'error',
      message: 'ภาษาที่เลือกไม่รองรับ'
    }));
    clientWs.close(1008, 'Unsupported target language');
    return;
  }

  const geminiWs = new WebSocket(geminiUrl);
  let setupComplete = false;
  let failed = false;

  function sendClientMessage(message) {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify(message));
    }
  }

  function failSession(message) {
    if (failed) return;
    failed = true;
    sendClientMessage({ type: 'error', message });
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.close(1011, 'Translation session failed');
    }
    if (
      geminiWs.readyState === WebSocket.OPEN ||
      geminiWs.readyState === WebSocket.CONNECTING
    ) {
      geminiWs.close();
    }
  }

  geminiWs.on('open', () => {
    geminiWs.send(JSON.stringify({
      setup: {
        model: `models/${MODEL}`,
        inputAudioTranscription: {},
        outputAudioTranscription: {},
        generationConfig: {
          responseModalities: ['AUDIO'],
          translationConfig: {
            targetLanguageCode,
            echoTargetLanguage: true
          }
        }
      }
    }));
  });

  clientWs.on('message', (message) => {
    if (!setupComplete || geminiWs.readyState !== WebSocket.OPEN) return;

    let data;
    try {
      data = JSON.parse(message.toString());
    } catch (error) {
      console.error('Invalid message received from dubbing client:', error);
      failSession('ได้รับข้อมูลเสียงไม่ถูกต้อง');
      return;
    }

    if (data.type === 'audio_chunk' && data.audio) {
      geminiWs.send(JSON.stringify({
        realtimeInput: {
          audio: {
            data: data.audio,
            mimeType: 'audio/pcm;rate=16000'
          }
        }
      }));
    }
  });

  geminiWs.on('message', (rawData) => {
    let response;
    try {
      response = JSON.parse(rawData.toString());
    } catch (error) {
      console.error('Invalid message received from Gemini:', error);
      failSession('ได้รับคำตอบจากบริการแปลไม่ถูกต้อง');
      return;
    }

    if (response.error) {
      console.error('Gemini API returned an error:', response.error.message || response.error);
      failSession('Gemini ปฏิเสธคำขอ ตรวจสอบ API key และสิทธิ์ใช้งานโมเดล');
      return;
    }

    if (response.setupComplete) {
      setupComplete = true;
      sendClientMessage({ type: 'ready' });
    }

    const parts = response.serverContent?.modelTurn?.parts;
    if (!Array.isArray(parts)) return;

    for (const part of parts) {
      if (part.inlineData?.mimeType?.startsWith('audio/pcm') && part.inlineData.data) {
        sendClientMessage({
          type: 'dubbed_audio',
          audio: part.inlineData.data
        });
      }
    }
  });

  geminiWs.on('error', (error) => {
    console.error('Gemini WebSocket error:', error.message);
    failSession('เชื่อมต่อ Gemini ไม่สำเร็จ ตรวจสอบ API key และการเชื่อมต่อเครือข่าย');
  });

  geminiWs.on('close', () => {
    if (!failed && clientWs.readyState === WebSocket.OPEN) {
      failSession('การเชื่อมต่อ Gemini ถูกปิด');
    }
  });

  clientWs.on('close', () => {
    if (
      geminiWs.readyState === WebSocket.OPEN ||
      geminiWs.readyState === WebSocket.CONNECTING
    ) {
      geminiWs.close();
    }
  });
});
