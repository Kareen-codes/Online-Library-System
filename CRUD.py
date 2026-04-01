from fastapi import FastAPI, Response
from database import engine
from models import  Base

from routers.limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from routers.categories import router as categories_router
from routers.authors import router as authors_router
from routers.books import router as books_router





app = FastAPI(title = "Online Library Application")

Base.metadata.create_all(bind=engine)


app.include_router(authors_router)
app.include_router(categories_router)
app.include_router(books_router)

app.state.limiter = limiter

app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/healthz")
def read_root():
    return Response("Server is running")

