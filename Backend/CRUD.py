from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import  Base

from routers.limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from routers.categories import router as categories_router
from routers.authors import router as authors_router
from routers.books import router as books_router




Base.metadata.create_all(bind=engine)
app = FastAPI(title = "Online Library Application")



app.add_middleware(CORSMiddleware, allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
], allow_methods=["*"],  allow_credentials=True, allow_headers=["*"])


app.include_router(authors_router)
app.include_router(categories_router)
app.include_router(books_router)

app.state.limiter = limiter

app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/healthz")
def read_root():
    return Response("Server is running")

@app.get("/")
def read_root():
    return Response("Return response successful")