FROM python:3.11-slim

WORKDIR /app

# Install build deps for pyswisseph (C extension needs math.h etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# leads.csv lives in /data volume in production
ENV LEADS_FILE=/data/leads.csv

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
