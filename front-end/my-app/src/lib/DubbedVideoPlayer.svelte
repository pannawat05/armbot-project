<script>
  import { onDestroy, onMount } from 'svelte';
  import { PUBLIC_DUBBING_API_URL } from '$env/static/public';

  // รับค่า URL วิดีโอผ่าน Props
  let { src } = $props();

  const LANGUAGES = [
    { code: 'Thai', label: '🇹🇭 ภาษาไทย' },
    { code: 'English', label: '🇺🇸 อังกฤษ (English)' },
    { code: 'Japanese', label: '🇯🇵 ญี่ปุ่น (Japanese)' },
    { code: 'Chinese', label: '🇨🇳 จีน (Mandarin)' },
    { code: 'Korean', label: '🇰🇷 เกาหลี (Korean)' },
  ];

  // State ของ Component
  let playerWrapper = $state(/** @type {HTMLDivElement | null} */ (null));
  let videoEl = $state(/** @type {HTMLVideoElement | null} */ (null));
  let isPlaying = $state(false);
  let isDubbing = $state(false);
  let isConnecting = $state(false);
  let isFullscreen = $state(false);
  let targetLang = $state('Thai');
  let progress = $state(0);
  let status = $state('เสียงต้นฉบับ');

  // ตัวแปรจัดการ Audio และ WebSocket
  /** @type {WebSocket | null} */
  let ws = null;
  /** @type {AudioContext | null} */
  let audioCtx = null;
  /** @type {GainNode | null} */
  let originalAudioGain = null;
  let nextPlayTime = 0;

  onMount(() => {
    const updateFullscreenState = () => {
      isFullscreen = document.fullscreenElement === playerWrapper;
    };

    document.addEventListener('fullscreenchange', updateFullscreenState);
    return () => document.removeEventListener('fullscreenchange', updateFullscreenState);
  });

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement === playerWrapper) {
        await document.exitFullscreen();
      } else if (playerWrapper) {
        await playerWrapper.requestFullscreen();
      }
    } catch (error) {
      console.error('Unable to toggle player fullscreen:', error);
      status = 'ผิดพลาด: ไม่สามารถเปิดเต็มจอได้';
    }
  }

  function setupAudioPipeline() {
    if (!videoEl || audioCtx) return;

    const context = new AudioContext();
    audioCtx = context;

    const source = context.createMediaElementSource(videoEl);
    const processor = context.createScriptProcessor(4096, 1, 1);
    originalAudioGain = context.createGain();
    const silentOutput = context.createGain();
    silentOutput.gain.value = 0;

    source.connect(originalAudioGain);
    originalAudioGain.connect(context.destination);
    source.connect(processor);
    processor.connect(silentOutput);
    silentOutput.connect(context.destination);

    processor.onaudioprocess = (e) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) return;

      const inputData = e.inputBuffer.getChannelData(0);
      const downsampled = downsampleBuffer(inputData, context.sampleRate, 16000);
      const pcm16 = floatTo16BitPCM(downsampled);
      const base64Audio = arrayBufferToBase64(pcm16);

      ws.send(JSON.stringify({
        type: 'audio_chunk',
        audio: base64Audio
      }));
    };
  }

  /** @param {string} langCode */
  function startDubbingSession(langCode) {
    setupAudioPipeline();
    if (audioCtx?.state === 'suspended') {
      audioCtx.resume().catch((error) => {
        console.error('Unable to resume audio context:', error);
        status = 'ผิดพลาด: ไม่สามารถเริ่มระบบเสียงได้';
      });
    }

    if (ws) ws.close();

    const langObj = LANGUAGES.find((l) => l.code === langCode);
    status = `กำลังเชื่อมต่อ (${langObj?.label || langCode})...`;
    isConnecting = true;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const endpoint = new URL(
      PUBLIC_DUBBING_API_URL || `${protocol}//${window.location.hostname}:8080`
    );
    endpoint.searchParams.set('lang', langCode);
    const currentWs = new WebSocket(endpoint);
    ws = currentWs;

    currentWs.onopen = () => {
      status = `กำลังเตรียมพากย์: ${langObj?.label || langCode}`;
    };

    currentWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'ready') {
          isConnecting = false;
          isDubbing = true;
          status = `กำลังพากย์: ${langObj?.label || langCode}`;
          setOriginalAudioMuted(true);
        } else if (data.type === 'error') {
          isConnecting = false;
          isDubbing = false;
          status = `ผิดพลาด: ${data.message}`;
          setOriginalAudioMuted(false);
        } else if (data.type === 'dubbed_audio') {
          playDubbedChunk(data.audio);
        }
      } catch (error) {
        console.error('Unable to read dubbing server message:', error);
        status = 'ผิดพลาด: ได้รับข้อมูลจากเซิร์ฟเวอร์ไม่ถูกต้อง';
        isConnecting = false;
        isDubbing = false;
        setOriginalAudioMuted(false);
      }
    };

    currentWs.onerror = () => {
      if (ws === currentWs) {
        isConnecting = false;
        isDubbing = false;
        status = 'ผิดพลาด: เชื่อมต่อเซิร์ฟเวอร์พากย์ไม่ได้';
        setOriginalAudioMuted(false);
        currentWs.close();
      }
    };

    currentWs.onclose = () => {
      if (ws === currentWs) {
        isDubbing = false;
        if (!status.startsWith('ผิดพลาด:')) status = 'เสียงต้นฉบับ';
        setOriginalAudioMuted(false);
      }
    };
  }

  /** @param {boolean} muted */
  function setOriginalAudioMuted(muted) {
    if (!audioCtx || !originalAudioGain) return;
    originalAudioGain.gain.setTargetAtTime(
      muted ? 0 : 1,
      audioCtx.currentTime,
      0.02
    );
  }

  function toggleDubbing() {
    if (!isDubbing && !isConnecting) {
      startDubbingSession(targetLang);
    } else {
      ws?.close();
      ws = null;
      isConnecting = false;
      isDubbing = false;
      status = 'เสียงต้นฉบับ';
      setOriginalAudioMuted(false);
    }
  }

  function handleLanguageChange() {
    if (isDubbing || isConnecting) {
      nextPlayTime = 0;
      startDubbingSession(targetLang);
    }
  }

  /** @param {string} base64Audio */
  function playDubbedChunk(base64Audio) {
    if (!audioCtx) return;

    const arrayBuffer = base64ToArrayBuffer(base64Audio);
    const int16Array = new Int16Array(arrayBuffer);
    const float32Array = new Float32Array(int16Array.length);

    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }

    const audioBuffer = audioCtx.createBuffer(1, float32Array.length, 24000);
    audioBuffer.getChannelData(0).set(float32Array);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);

    const currentTime = audioCtx.currentTime;
    if (nextPlayTime < currentTime) {
      nextPlayTime = currentTime;
    }
    source.start(nextPlayTime);
    nextPlayTime += audioBuffer.duration;
  }

  function togglePlay() {
    if (!videoEl) return;
    if (videoEl.paused) {
      videoEl.play();
      isPlaying = true;
    } else {
      videoEl.pause();
      isPlaying = false;
    }
  }

  function handleTimeUpdate() {
    if (!videoEl || !videoEl.duration) return;
    progress = (videoEl.currentTime / videoEl.duration) * 100;
  }

  /** @param {Event} e */
  function handleSeek(e) {
    if (!videoEl || !videoEl.duration) return;
    const target = /** @type {HTMLInputElement} */ (e.currentTarget);
    videoEl.currentTime = (Number(target.value) / 100) * videoEl.duration;
  }

  onDestroy(() => {
    ws?.close();
    audioCtx?.close();
  });

  // --- Helper Functions ---
  /**
   * @param {Float32Array} buffer
   * @param {number} sampleRate
   * @param {number} outSampleRate
   */
  function downsampleBuffer(buffer, sampleRate, outSampleRate) {
    if (outSampleRate === sampleRate) return buffer;
    const ratio = sampleRate / outSampleRate;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < result.length) {
      const nextOffset = Math.round((offsetResult + 1) * ratio);
      let accum = 0, count = 0;
      for (let i = offsetBuffer; i < nextOffset && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = accum / count;
      offsetResult++;
      offsetBuffer = nextOffset;
    }
    return result;
  }

  /** @param {Float32Array} input */
  function floatTo16BitPCM(input) {
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
  }

  /** @param {ArrayBuffer} buffer */
  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  /** @param {string} base64 */
  function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
</script>

<div class="player-wrapper" bind:this={playerWrapper}>
  <div class="badge" class:active={isDubbing}>
    {status}
  </div>

  <!-- svelte-ignore a11y_media_has_caption -->
  <video
    bind:this={videoEl}
    {src}
    crossorigin="anonymous"
    class="video-element"
    ontimeupdate={handleTimeUpdate}
    onclick={togglePlay}
  ></video>

  <div class="controls-bar">
    <button onclick={togglePlay} class="control-btn">
      {isPlaying ? '⏸ หยุด' : '▶ เล่น'}
    </button>

    <input
      type="range"
      min="0"
      max="100"
      value={progress}
      oninput={handleSeek}
      class="progress-bar"
    />

    <button
      onclick={toggleFullscreen}
      class="control-btn fullscreen-btn"
      aria-label={isFullscreen ? 'ออกจากเต็มจอ' : 'เปิดเต็มจอ'}
      aria-pressed={isFullscreen}
    >
      {isFullscreen ? 'ย่อจอ' : 'เต็มจอ'}
    </button>

    <div class="dub-controls-group">
      <select
        bind:value={targetLang}
        onchange={handleLanguageChange}
        class="lang-select"
        aria-label="เลือกภาษาพากย์"
      >
        {#each LANGUAGES as lang}
          <option value={lang.code}>{lang.label}</option>
        {/each}
      </select>

      <button
        onclick={toggleDubbing}
        class="dub-btn"
        class:active={isDubbing || isConnecting}
      >
        {isDubbing || isConnecting ? '⏹ ปิดพากย์' : '✨ พากย์ AI'}
      </button>
    </div>
  </div>
</div>

<style>
  .player-wrapper {
    position: relative;
    width: 100%;
    max-width: 850px;
    margin: 2rem auto;
    border-radius: 16px;
    overflow: hidden;
    background-color: #10120f;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
    font-family: system-ui, -apple-system, sans-serif;
  }

  .video-element {
    width: 100%;
    display: block;
    cursor: pointer;
  }

  .badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(16, 18, 15, 0.78);
    backdrop-filter: blur(8px);
    color: #e2e8f0;
    padding: 6px 14px;
    border-radius: 9999px;
    font-size: 0.85rem;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 10;
  }

  .badge.active {
    background: rgba(211, 243, 107, 0.92);
    color: #10120f;
    border-color: #d3f36b;
    animation: pulse 2s infinite;
  }

  .controls-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  }

  .control-btn {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
  }

  .control-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .fullscreen-btn {
    white-space: nowrap;
  }

  .player-wrapper:fullscreen {
    width: 100vw;
    height: 100vh;
    max-width: none;
    margin: 0;
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .player-wrapper:fullscreen::backdrop {
    background: #0f172a;
  }

  .player-wrapper:fullscreen .video-element {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .progress-bar {
    flex: 1;
    accent-color: #d3f36b;
    height: 6px;
    border-radius: 4px;
    cursor: pointer;
  }

  .dub-controls-group {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(16, 18, 15, 0.88);
    padding: 4px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.15);
  }

  .lang-select {
    background-color: transparent;
    color: #f8fafc;
    border: none;
    padding: 6px 10px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    outline: none;
    border-radius: 6px;
  }

  .lang-select:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .lang-select option {
    background-color: #1a1d17;
    color: #f8fafc;
  }

  .dub-btn {
    background: #25291f;
    color: #f8fafc;
    border: 1px solid #43483a;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .dub-btn:hover {
    background: #34392c;
  }

  .dub-btn.active {
    background: #d3f36b;
    border-color: #d3f36b;
    color: #10120f;
    box-shadow: 0 0 15px rgba(211, 243, 107, 0.28);
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
</style>
