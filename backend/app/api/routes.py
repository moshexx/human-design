"""API routes for chart generation."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from app.core.chart import calculate_chart
from app.core.geocoding import geocode_city
from app.models.schemas import ChartRequest, ChartResponse
from app.services.lead_capture import capture_lead
from app.services.email import send_chart_email

router = APIRouter()


@router.post("/api/v1/generate-chart", response_model=ChartResponse)
async def generate_chart(request: ChartRequest):
    """Generate a Human Design chart from birth details."""
    lat, lng = await geocode_city(request.city)
    await capture_lead(request)
    chart = calculate_chart(request.dob, request.time, lat, lng)
    chart["name"] = request.name
    return chart


class SendEmailRequest(BaseModel):
    email: EmailStr
    name: str
    chart: dict


@router.post("/api/v1/send-chart-email", status_code=204)
async def send_email(request: SendEmailRequest):
    """Send chart summary email to the user."""
    try:
        await send_chart_email(request.email, request.name, request.chart)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to send email: {e}"
        )
