import cv2
import pika
from threading import Thread
import time
import base64
import json
import datetime
import logging
import pika.exceptions
import os
os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp"

class Observer(Thread):
    def __init__(self, device_id: str, rtsp_uri: str, message_queue_uri: str):
        super(Observer, self).__init__()
        self.device_id = device_id
        self.rtsp_uri = rtsp_uri
        self.message_queue_uri = message_queue_uri
        self.cancelled = False
        self.connection = None
        self.channel = None
        self.logger = logging.getLogger("uvicorn.error")
        logging.basicConfig(
            level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
        )

        # self.logger.info(cv2.getBuildInformation())

    def send_to_message_queue(self, body):
        try:
            if self.channel:
                message = json.dumps(
                    {
                        "camera_id": self.device_id,
                        "timestamp": datetime.datetime.now(),
                        "frame_data": body.decode("utf8"),
                    },
                    default=str,
                )
                self.channel.basic_publish(
                    exchange="device.detect.direct",
                    routing_key="face_detect",
                    body=message,
                )
                self.logger.info(
                    f"[Observer#{self.device_id}] Sent {len(body)} bytes to message queue"
                )
            else:
                self.logger.info(
                    f"[Observer#{self.device_id}] Cannot send message, channel is None"
                )
        except Exception as e:
            self.logger.info(
                f"[Observer#{self.device_id}] Error sending to message queue: {e}"
            )

    def run(self):
        try:
            self.logger.info(
                f"[Observer#{self.device_id}] Starting observer for RTSP stream: {self.rtsp_uri}"
            )
            uri = (
                int(self.rtsp_uri) if self.rtsp_uri.isnumeric() else str(self.rtsp_uri)
            )
            cap = cv2.VideoCapture(uri)
            if not cap.isOpened():
                self.logger.error(
                    f"[Observer#{self.device_id}] Failed to open RTSP stream: {uri}"
                )
                return

            self.logger.info(
                f"[Observer#{self.device_id}] Successfully opened RTSP stream"
            )

            self.logger.info(
                f"[Observer#{self.device_id}] Connecting to RabbitMQ: {self.message_queue_uri}"
            )
            self.connection = pika.BlockingConnection(
                parameters=pika.URLParameters(self.message_queue_uri)
            )
            self.channel = self.connection.channel()

            self.channel.exchange_declare(
                exchange="device.detect.direct", exchange_type="direct"
            )

            self.channel.queue_declare(
                queue="device.face_detection_queue",
                arguments={"x-max-length": 100, "x-message-ttl": 10000},
            )
            self.channel.queue_bind(
                exchange="device.detect.direct",
                queue="device.face_detection_queue",
                routing_key="face_detect",
            )

            self.logger.info(
                f"[Observer#{self.device_id}] Streaming and sending frames..."
            )

            while cap.isOpened() and not self.cancelled:
                ret, frame = cap.read()
                if not ret:
                    self.logger.error(
                        f"[Observer#{self.device_id}] Failed to read frame from stream"
                    )
                    break

                _, buff = cv2.imencode(".jpg", frame)
                b64 = base64.b64encode(buff)
                self.logger.info(f"Base64 encoded {len(b64)} bytes")
                self.send_to_message_queue(b64)

                time.sleep(0.02)

        except pika.exceptions.AMQPConnectionError as e:
            self.logger.error(
                f"[Observer#{self.device_id}] RabbitMQ connection error: {e}"
            )
        except Exception as e:
            self.logger.error(f"[Observer#{self.device_id}] Unexpected error: {e}")
        finally:
            cap.release()
            self.logger.info(
                f"[Observer#{self.device_id}] Closing connection to the message queue"
            )
            try:
                if self.channel:
                    self.channel.queue_purge(queue="device.face_detection_queue")
                    self.channel.close()
                if self.connection:
                    self.connection.close()
                self.logger.info(
                    f"[Observer#{self.device_id}] Successfully closed RabbitMQ connection"
                )
            except Exception as e:
                self.logger.error(
                    f"[Observer#{self.device_id}] Error while closing resources: {e}"
                )

    def cancel(self):
        self.logger.info(f"[Observer#{self.device_id}] Cancelling observer thread")
        self.cancelled = True
