"""API routes for chart generation."""

from fastapi import APIRouter

from app.core.chart import calculate_chart
from app.core.geocoding import geocode_city
from app.models.schemas import ChartRequest, ChartResponse
from app.services.lead_capture import capture_lead

router = APIRouter()


@router.post("/api/v1/generate-chart", response_model=ChartResponse)
async def generate_chart(request: ChartRequest):
    """Generate a Human Design chart from birth details."""
    lat, lng = await geocode_city(request.city)
    await capture_lead(request)
    chart = calculate_chart(request.dob, request.time, lat, lng)
    chart["name"] = request.name
    return chart
