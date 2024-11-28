from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from bson import json_util
import json
from .util import create_generator, streamer, try_to_open
import logging


from db.devices import (
    insert_device_metadata,
    get_all_devices,
    find_device,
    delete_device,
    update_device,
)

from .observe import Observer


class Device(BaseModel):
    name: str
    url: str
    scale: float | None = None
    lastOpened: bool = False


router = APIRouter()

activated_devices = dict()

for item in list(get_all_devices()):
    if item["last_opened"] is True:
        print(item)
        _id = str(item["_id"])
        url = item["url"]
        print(f"Start observing the device {_id} with url {url}")

        # Call threading to start
        observer = Observer(uri=url, device=item)
        observer.start()

        activated_devices[_id] = observer

print(f"Current observing device: {activated_devices}")


@router.post("/")
async def create_device(device: Device):
    print(device)
    inserted = insert_device_metadata(device_metadata=device)
    print(f"\tSuccessfully insert device with id {inserted.inserted_id}")
    return {"success": True, "data": str(inserted.inserted_id)}


@router.get("/")
async def get_devices(
    opened: bool | None = None, limit: int | None = None, page: int | None = None
):
    print(f"opened={opened}; limit={limit}; page={page}")
    cursor = get_all_devices(opened=opened)
    limit = limit if limit is not None else 12
    page = page if page is not None else 1

    cursor = cursor.limit(limit=limit).skip(limit * (page - 1))

    items = list(cursor)
    resp = json.loads(json_util.dumps(items))
    return {"success": True, "data": resp}


@router.get("/stream/{id}")
async def get_stream(id):
    device = find_device(id)
    if device is None:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "message": "Cannot found the device with current id.",
            },
        )
    # Parse to json
    resp = json.loads(json_util.dumps(device))
    print(
        f"\tStarting a stream from: {resp["name"]} with scale {device["resize_factor"]}"
    )

    try:
        # Try to open the connection before start
        cap = try_to_open(resp["url"])
        return StreamingResponse(
            streamer(create_generator(cap, device["resize_factor"])),
            media_type="multipart/x-mixed-replace; boundary=frame",
        )
    except Exception as e:
        logging.error("Error at %s", "division", exc_info=e)
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Device is unavailable or something is wrong.",
            },
        )


@router.delete("/{id}")
async def do_delete_device(id):
    await delete_device(id)

    return {"success": True}


@router.post("/activate/{id}")
async def do_activate_device(id):
    print(f"\tStart activate the device with id {id}")

    # Check existent of the device
    device = find_device(id)
    if device is None:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "error": "NotFound",
                "message": "Cannot found the device with specific id.",
            },
        )

    # Check if the device is activated
    if id in activated_devices:
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": "SignalError",
                "message": "The device is already activated.",
            },
        )

    # Call threading to start
    observer = Observer(uri=device["url"], device=device)
    observer.start()

    # Add new device into a list
    activated_devices[id] = observer
    print(f"Current observing device: {activated_devices}")
    # Update the device on database
    # updated_device = device
    # updated_device["last_opened"] = True

    update_device(id, {"$set": {"last_opened": True}})

    return {"success": True}
    # try:

    # except:
    #     raise HTTPException(
    #         status_code=500,
    #         detail={"success": False, "message": "Unable to start an observer."},
    #     )


@router.post("/deactivate/{id}")
async def do_activate_device(id):
    print(f"Deactivate the device with id {id}")

    device = find_device(id)
    if device is None:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "error": "NotFound",
                "message": "Cannot found the device with specific id.",
            },
        )

    # If not started
    if not id in activated_devices:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "message": "Device is not found or not started yet.",
            },
        )

    # Get the thread and cancel it, then remove out of dict
    cur_device = activated_devices[id]
    if not isinstance(cur_device, Observer):
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Object is not an observer.",
            },
        )

    cur_device.cancel()
    cur_device.join(0.03)

    # Set last opened device to False
    # updated_device = device
    # updated_device["last_opened"] = False
    update_device(id, {"$set": {"last_opened": False}})

    del activated_devices[id]
    print(f"Current observing device: {activated_devices}")
    return {"success": True, "detail": {}}


# todo: add detector services
