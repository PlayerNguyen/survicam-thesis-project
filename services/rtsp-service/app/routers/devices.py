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
)

from .observe import Observer


class Device(BaseModel):
    name: str
    url: str
    scale: float | None = None


router = APIRouter()

activated_devices = dict()


@router.post("/")
async def create_device(device: Device):
    inserted = insert_device_metadata(device_metadata=device)
    print(f"\tSuccessfully insert device with id {inserted.inserted_id}")
    return {"success": True, "data": str(inserted.inserted_id)}


@router.get("/")
async def get_devices():
    items = list(get_all_devices())
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

    del activated_devices[id]

    return {"success": True, "detail": {}}


# todo: add detector services
