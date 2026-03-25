"""Convert ecliptic longitude to Human Design gate and line."""

from app.core.constants import GATE_SEQUENCE, WHEEL_START_DEGREE, GATE_SPAN, LINE_SPAN


def longitude_to_gate_line(longitude: float) -> tuple[int, int]:
    """
    Convert an ecliptic longitude (0-360°) to a Human Design gate and line.
    Returns (gate_number, line_number) where line is 1-6.
    """
    offset = (longitude - WHEEL_START_DEGREE) % 360
    gate_index = int(offset / GATE_SPAN)
    gate_index = min(gate_index, 63)  # Safety clamp
    gate = GATE_SEQUENCE[gate_index]
    line = int((offset % GATE_SPAN) / LINE_SPAN) + 1
    line = min(line, 6)  # Safety clamp
    return gate, line
