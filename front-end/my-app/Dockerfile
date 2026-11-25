FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
ARG DOCKER_BUILD=true
ARG PUBLIC_DUBBING_API_URL=
ENV DOCKER_BUILD=${DOCKER_BUILD} \
	PUBLIC_DUBBING_API_URL=${PUBLIC_DUBBING_API_URL}
RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production \
	HOST=0.0.0.0 \
	PORT=3000

COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000
CMD ["node", "build"]
