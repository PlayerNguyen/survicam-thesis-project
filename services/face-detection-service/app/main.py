from dotenv import load_dotenv

load_dotenv()

# print(os.getenv("RABBIT_MQ_URI"))
# conn = pika.BlockingConnection(
#     parameters=pika.URLParameters(os.getenv("RABBIT_MQ_URI"))
# )

# channel = conn.channel()
# queue_name = channel.queue_declare(
#     queue="device.face_detection_queue",
#     arguments={"x-max-length": 100, "x-message-ttl": 10000},
# ).method.queue
# channel.basic_qos(prefetch_count=1)

# # Generate a pipe from detect to recognition
# RECOGNITION_EXCHANGE_KEY = "detect.recognition.direct"
# channel.exchange_declare(RECOGNITION_EXCHANGE_KEY, exchange_type="direct")

# recognition_queue = channel.queue_declare(
#     queue="face_recognition", arguments={"x-max-length": 100}
# )
# recognition_queue_name = recognition_queue.method.queue
# channel.queue_bind(exchange=RECOGNITION_EXCHANGE_KEY, queue=recognition_queue_name)


# def submit_face_recognition(body):
#     print(body)
#     v = json.dumps(body)
#     channel.basic_publish(
#         exchange=RECOGNITION_EXCHANGE_KEY, body=v, routing_key="face_recognition"
#     )


from detection_request import handle_request_from_devices


if __name__ == "__main__":
    print("Starting an agent")
    handle_request_from_devices()
