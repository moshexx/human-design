"""
Human Design system constants: gate wheel sequence, channels, centers, and mappings.
"""

# The 64 gates in order around the Rave Mandala wheel, starting from Gate 41 at 302° absolute.
GATE_SEQUENCE = [
    41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
    27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
    31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
    28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60,
]

WHEEL_START_DEGREE = 302.0  # Gate 41 starts at 2°00' Aquarius = 302° absolute
GATE_SPAN = 5.625           # 360 / 64 degrees per gate
LINE_SPAN = 0.9375          # 5.625 / 6 degrees per line

# The 36 channels as (gate_a, gate_b) tuples
CHANNELS = [
    (1, 8), (2, 14), (3, 60), (4, 63), (5, 15), (6, 59), (7, 31), (9, 52),
    (10, 20), (10, 34), (10, 57), (11, 56), (12, 22), (13, 33), (16, 48),
    (17, 62), (18, 58), (19, 49), (20, 34), (20, 57), (21, 45), (23, 43),
    (24, 61), (25, 51), (26, 44), (27, 50), (28, 38), (29, 46), (30, 41),
    (32, 54), (34, 57), (35, 36), (37, 40), (39, 55), (42, 53), (47, 64),
]

# Each center and the gates it contains
CENTER_GATES: dict[str, set[int]] = {
    "Head":          {64, 61, 63},
    "Ajna":          {47, 24, 4, 17, 43, 11},
    "Throat":        {62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16},
    "G Center":      {7, 1, 13, 25, 46, 2, 15, 10},
    "Heart":         {21, 40, 26, 51},
    "Sacral":        {5, 14, 29, 59, 9, 3, 42, 27, 34},
    "Solar Plexus":  {36, 22, 37, 6, 49, 55, 30},
    "Spleen":        {48, 57, 44, 50, 32, 28, 18},
    "Root":          {58, 38, 54, 53, 60, 52, 19, 39, 41},
}

# Reverse lookup: gate → center name
GATE_TO_CENTER: dict[int, str] = {}
for center, gates in CENTER_GATES.items():
    for gate in gates:
        GATE_TO_CENTER[gate] = center

# Each channel mapped to the two centers it connects
CHANNEL_CENTERS: dict[tuple[int, int], tuple[str, str]] = {}
for g1, g2 in CHANNELS:
    CHANNEL_CENTERS[(g1, g2)] = (GATE_TO_CENTER[g1], GATE_TO_CENTER[g2])

# Motor centers (can power manifestation if connected to Throat)
MOTOR_CENTERS = {"Sacral", "Solar Plexus", "Heart", "Root"}

ALL_CENTERS = list(CENTER_GATES.keys())

# Strategy by Type
STRATEGY = {
    "Manifestor": "To Inform",
    "Generator": "To Respond",
    "Manifesting Generator": "To Respond",
    "Projector": "Wait for the Invitation",
    "Reflector": "Wait a Lunar Cycle",
}

# Authority determination priority (first match wins)
AUTHORITY_PRIORITY = [
    ("Solar Plexus", "Emotional Authority"),
    ("Sacral", "Sacral Authority"),
    ("Spleen", "Splenic Authority"),
    ("Heart", "Ego Authority"),
    ("G Center", "Self-Projected Authority"),
]

# Planet names used in Human Design (13 activations per imprint)
PLANET_NAMES = [
    "Sun", "Earth", "North Node", "South Node", "Moon",
    "Mercury", "Venus", "Mars", "Jupiter", "Saturn",
    "Uranus", "Neptune", "Pluto",
]
