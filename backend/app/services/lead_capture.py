"""Lead capture: append user data to CSV file."""

import csv
import os
from datetime import datetime, timezone
from pathlib import Path

import httpx

from app.models.schemas import ChartRequest

_default = Path(__file__).parent.parent.parent / "leads.csv"
LEADS_FILE = Path(os.getenv("LEADS_FILE", str(_default)))
HEADERS = ["name", "email", "dob", "time", "city", "goal", "experience", "timestamp"]
WEBHOOK_URL = "https://n8n.simpliflow.me/webhook/hd-form"  # noqa: E501


async def _send_to_webhook(payload: dict) -> None:
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            await client.post(WEBHOOK_URL, json=payload)
    except Exception:
        pass  # never block main flow


async def capture_lead(request: ChartRequest) -> None:
    """Append lead data to CSV file and send to n8n webhook."""
    timestamp = datetime.now(timezone.utc).isoformat()

    try:
        LEADS_FILE.parent.mkdir(parents=True, exist_ok=True)
        file_exists = LEADS_FILE.exists()

        with open(LEADS_FILE, "a", newline="") as f:
            writer = csv.writer(f)
            if not file_exists:
                writer.writerow(HEADERS)
            writer.writerow([
                request.name,
                request.email,
                request.dob,
                request.time,
                request.city,
                request.goal or "",
                request.experience or "",
                timestamp,
            ])
    except OSError:
        pass  # read-only filesystem (Vercel serverless) -- skip

    await _send_to_webhook({
        "name": request.name,
        "email": request.email,
        "dob": request.dob,
        "time": request.time,
        "city": request.city,
        "goal": request.goal or "",
        "experience": request.experience or "",
        "timestamp": timestamp,
    })
