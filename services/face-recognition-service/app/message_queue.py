import os
import pika
from callback import Callback

connection = pika.BlockingConnection(pika.URLParameters(os.getenv("RABBIT_MQ_URI")))

callback_registry = Callback()


def consume_from_message_queue():
    # Start a new channel
    channel = connection.channel()
    # Start a protocol
    channel.exchange_declare(
        os.getenv("RABBIT_MQ_FACE_RECOGNITION_EXCHANGE_NAME"),
        exchange_type="direct",
    )
    channel.queue_declare(
        os.getenv("RABBIT_MQ_FACE_RECOGNITION_QUEUE_NAME"),
        arguments={"x-max-length": 100},
    )
    channel.queue_bind(
        queue=os.getenv("RABBIT_MQ_FACE_RECOGNITION_QUEUE_NAME"),
        exchange=os.getenv("RABBIT_MQ_FACE_RECOGNITION_EXCHANGE_NAME"),
    )

    # Register the consume
    channel.basic_consume(
        queue=os.getenv("RABBIT_MQ_FACE_RECOGNITION_QUEUE_NAME"),
        on_message_callback=callback_registry.on_receive,
    )

    try:
        print(" [*] Start consuming from message queue:")
        channel.start_consuming()
    except KeyboardInterrupt:
        channel.stop_consuming()
        channel.close()
