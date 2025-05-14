import os
from pymongo import MongoClient
from pymilvus import connections, utility


def truncate_mongodb():
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    client = MongoClient(mongo_uri)
    db = client["members"]

    for collection_name in db.list_collection_names():
        db[collection_name].delete_many({})  # Truncate collection
        print(f"Truncated collection: {collection_name}")
        
    db1 = client["logging"]
    
    for collection_name in db1.list_collection_names():
        db[collection_name].delete_many({})  # Truncate collection
        print(f"Truncated collection: {collection_name}")
        
    

    print("All collections in 'members' database have been truncated.")


def truncate_milvus():
    milvus_uri = os.getenv("MILVUS_CONNECTION_URI", "http://localhost:19530")
    connections.connect("default", uri=milvus_uri)

    for collection_name in utility.list_collections():
        utility.drop_collection(collection_name)  # Drop collection
        print(f"Dropped Milvus collection: {collection_name}")

    print("All collections in Milvus have been dropped.")


if __name__ == "__main__":
    truncate_mongodb()
    truncate_milvus()
