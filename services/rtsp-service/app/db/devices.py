from .connection import get_client
from bson.objectid import ObjectId


class DeviceMetadata:
    name: str
    url: str
    scale: float | None = None
    lastOpened: bool


devices_db = get_client()["devices"]


def insert_device_metadata(device_metadata: DeviceMetadata):
    metadata_obj = {
        "name": device_metadata.name,
        "url": device_metadata.url,
        "resize_factor": device_metadata.scale,
        "last_opened": (
            False if device_metadata.lastOpened is None else device_metadata.lastOpened
        ),
    }
    metadata = devices_db["metadata"].insert_one(metadata_obj)

    return metadata


def get_all_devices(opened: bool | None = None):
    query_body = {}
    if opened is not None:
        query_body["last_opened"] = opened

    return devices_db["metadata"].find(query_body)


def find_device(id):
    return devices_db["metadata"].find_one({"_id": ObjectId(id)})


async def delete_device(id):
    return devices_db["metadata"].delete_many({"_id": ObjectId(id)})


def update_device(id: str, device: DeviceMetadata):
    return devices_db["metadata"].update_one({"_id": ObjectId(id)}, device)
