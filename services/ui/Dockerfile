FROM oven/bun:1.1.9-alpine as base
WORKDIR /usr/src/app


# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . . 

ENV VITE_API_GATEWAY_BASE_URL="http://localhost/api"
ENV VITE_API_GATEWAY_AUTH="http://localhost:3192/auth/"
ENV VITE_API_FACE_RECOGNITION_URL="http://localhost:8555/v2"
ENV VITE_API_DEVICE_URL="http://localhost:3015"
ENV VITE_API_DEVICE_STREAM_URL="http://localhost:3072/"
ENV VITE_API_LOGGING_URL="http://localhost:3234"

ENV NODE_ENV=production
RUN bun run build

# copy production dependencies and source code into final image
FROM nginx:1.27.2-alpine AS release
COPY --from=prerelease /usr/src/app/dist /usr/share/nginx/html
COPY ./.config/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx-debug", "-g", "daemon off;"]
