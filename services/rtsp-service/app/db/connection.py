from pymongo import MongoClient
import os

def get_client():
    client = MongoClient(os.getenv("MONGODB_URI", "mongodb://root:example@localhost/test?authSource=admin"))
    return client
