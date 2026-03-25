"""Lead capture: append user data to CSV file."""

import csv
import os
from datetime import datetime, timezone
from pathlib import Path

from app.models.schemas import ChartRequest

_default = Path(__file__).parent.parent.parent / "leads.csv"
LEADS_FILE = Path(os.getenv("LEADS_FILE", str(_default)))
HEADERS = ["name", "email", "dob", "time", "city", "goal", "experience", "timestamp"]


async def capture_lead(request: ChartRequest) -> None:
    """Append lead data to CSV file."""
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
                datetime.now(timezone.utc).isoformat(),
            ])
    except OSError:
        pass  # read-only filesystem (Vercel serverless) -- skip
