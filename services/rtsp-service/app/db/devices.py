from .connection import get_client
from bson.objectid import ObjectId


class DeviceMetadata:
    name: str
    url: str
    scale: float | None = None


devices_db = get_client()["devices"]


def insert_device_metadata(device_metadata: DeviceMetadata):
    metadata_obj = {
        "name": device_metadata.name,
        "url": device_metadata.url,
        "resize_factor": device_metadata.scale,
    }
    metadata = devices_db["metadata"].insert_one(metadata_obj)

    return metadata


def get_all_devices():
    return devices_db["metadata"].find()


def find_device(id):
    return devices_db["metadata"].find_one({"_id": ObjectId(id)})


async def delete_device(id):
    return devices_db["metadata"].delete_many({"_id": ObjectId(id)})
