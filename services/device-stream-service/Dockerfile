# FROM python:3.12-slim AS builder

# Set working directory
# WORKDIR /build


# Install dependencies
# RUN pip install pyinstaller && pip install -r ./rtsp2mq-adapter/requirements.txt
# Install requirement deps
# RUN apt-get update && apt-get install -y binutils

# Run PyInstaller directly
# RUN pyinstaller --onefile --hidden-import=pika --hidden-import=cv2 --name observer --distpath /build/dist ./rtsp2mq-adapter/main.py

# Check if the file exists
# RUN ls -la /build/dist

# Final stage for the Bun application
FROM python:3.12-slim AS runtime

# Install necessary dependencies (including curl)
RUN apt-get update && apt-get install -y curl unzip

# Install bun runtime
RUN curl -fsSL https://bun.sh/install | bash && \
    mv /root/.bun/bin/bun /usr/local/bin/

# Verify installation
RUN /usr/local/bin/bun --version


WORKDIR /app

# Copy application source
COPY ./micro-app/rtsp2mq-adapter ./micro-app/rtsp2mq-adapter

RUN pip install -r ./micro-app/rtsp2mq-adapter/requirements.txt


# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Copy Bun application files
COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY src src
COPY shared shared
COPY tsconfig.json .

# Set environment variables
ENV NODE_ENV production

# Expose the application port
EXPOSE 3004

# Run both applications (Python binary and Bun app)
CMD ["bash", "-c",  "bun src/index.ts"]
