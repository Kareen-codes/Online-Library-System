FROM python:3.12-slim AS base

# Ensure Python doesn't buffer output
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1


WORKDIR /app


# Install system dependencies

RUN apt-get update && apt-get install -y \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install -r requirements.txt


COPY . .


EXPOSE 8000


CMD ["uvicorn", "CRUD:app", "--host", "0.0.0.0", "--port", "8000"]