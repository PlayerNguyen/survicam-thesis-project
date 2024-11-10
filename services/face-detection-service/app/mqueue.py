import os
import pika


connection = pika.BlockingConnection(
    parameters=pika.URLParameters(os.getenv("RABBIT_MQ_URI"))
)
channel = connection.channel()


