RECOGNITION_EXCHANGE_KEY = "detect.recognition.direct"
import json

from mqueue import channel


class Sender:
    def __init__(self):
        pass

        # Generate a pipe from detect to recognition

        channel.exchange_declare(RECOGNITION_EXCHANGE_KEY, exchange_type="direct")

        recognition_queue = channel.queue_declare(
            queue="face_recognition", arguments={"x-max-length": 100}
        )
        self.recognition_queue_name = recognition_queue.method.queue
        channel.queue_bind(
            exchange=RECOGNITION_EXCHANGE_KEY, queue=self.recognition_queue_name
        )

    def post(self, body):
        body = json.dumps(body, default=str, separators=(",", ":"))
        channel.basic_publish(
            exchange=RECOGNITION_EXCHANGE_KEY, body=body, routing_key="face_recognition"
        )
