from codeguru_profiler_agent import Profiler
from typing import Union
from fastapi import FastAPI
import asyncio
import socket


def get_hostname():
    return socket.gethostname()


# Profiler(profiling_group_name='Test', region_name='us-east-1').start()
app = FastAPI()


@app.get("/")
async def read_root():
    return {'Hello': f'World - {get_hostname()}'}


@app.get("/items/{item_id}")
async def read_item(item_id: int, q: Union[str, None] = None):

    await asyncio.sleep(2)
    if item_id == 0:
        # This is to prove that an exception will not crash the server
        raise Exception('Exception on purpse if item_id is 0')

    return {"item_id": item_id, "q": q}
