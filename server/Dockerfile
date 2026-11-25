FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production \
	PORT=8080

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./

EXPOSE 8080
CMD ["node", "server.js"]
