import cv2
import pika
from threading import Thread
import time
import base64
import pika
import os
import json
import datetime

import pika.exceptions


class Observer(Thread):
    def __init__(self, uri: str | int, device):
        super(Observer, self).__init__()
        self.uri = uri
        self.device = device
        self.cancelled = False

    def send_to_message_queue(self, body):
        _ = json.dumps(
            {
                "camera_id": str(self.device["_id"]),
                "timestamp": datetime.datetime.now(),
                "frame_data": body.decode("utf8"),
            },
            default=str,
        )

        self.channel.basic_publish(
            exchange="device.detect.direct", routing_key="face_detect", body=_
        )

    def run(self):
        cap = cv2.VideoCapture(self.uri)
        self.connection = pika.BlockingConnection(
            parameters=pika.URLParameters(
                os.getenv("RABBIT_MQ_URI", "amqp://user:password@localhost:5672/%2F")
            )
        )
        self.channel = self.connection.channel()

        # Creates channel with a broadcast
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

        while cap.isOpened() and not self.cancelled:
            ret, frame = cap.read()
            if ret is False:
                break

            # convert to jpeg
            _, buff = cv2.imencode(".jpg", frame)
            b64 = base64.b64encode(buff)
            # Send the message queue
            self.send_to_message_queue(b64)

            # Delay 20 ms
            time.sleep(0.02)

        cap.release()
        print("\t Closing connection to the message queue")
        self.channel.queue_purge(queue="device.face_detection_queue")
        self.channel.close()
        self.connection.close()

    def cancel(self):
        self.cancelled = True
        # self.channel.close()
        # self.connection.close()
