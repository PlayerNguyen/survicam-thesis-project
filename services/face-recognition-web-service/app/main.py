from fastapi import FastAPI, Request
from routers.embeddings import router as EmbeddingRouter
from routers.members import router as MembersRouter
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

load_dotenv()

app = FastAPI(root_path="/faces", redirect_slashes=False)

origins = [
    "*",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def main(request: Request):
    return {"status": "ok", "root_path": request.scope.get("root_path")}


app.include_router(router=EmbeddingRouter, prefix="/embeddings", tags=["embeddings"])
app.include_router(router=MembersRouter, prefix="/members", tags=["members"])

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=os.getenv("APP_HOST"),
        port=int(os.getenv("APP_PORT")),
        reload=True,
        root_path="/faces",
    )
