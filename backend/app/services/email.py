"""Send chart summary emails via Resend."""
# flake8: noqa: E501  (long lines are unavoidable in HTML email templates)

import base64
import os

import resend

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
EMAIL_FROM = os.getenv("EMAIL_FROM", "Human Design <noreply@resend.dev>")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

TYPE_HE = {
    "Generator": "גנרטור",
    "Manifesting Generator": "גנרטור מניפסטציה",
    "Projector": "פרוג'קטור",
    "Manifestor": "מניפסטור",
    "Reflector": "רפלקטור",
}

STRATEGY_HE = {
    "Generator": "המתן להיענות",
    "Manifesting Generator": "הגיב, ואז ידע",
    "Projector": "המתן להזמנה",
    "Manifestor": "ידע, ואז יזום",
    "Reflector": "המתן מחזור ירח",
}

PLANET_NAMES = {
    "Sun": "Sun", "Earth": "Earth", "North Node": "North Node",
    "South Node": "South Node", "Moon": "Moon", "Mercury": "Mercury",
    "Venus": "Venus", "Mars": "Mars", "Jupiter": "Jupiter",
    "Saturn": "Saturn", "Uranus": "Uranus", "Neptune": "Neptune",
    "Pluto": "Pluto",
}


def _build_prompt(name: str, chart: dict) -> str:
    hd_type = chart.get("type", "")
    profile = chart.get("profile", "")
    authority = chart.get("authority", "")
    strategy = chart.get("strategy", "")
    defined = ", ".join(chart.get("defined_centers", [])) or "None"
    undefined = ", ".join(chart.get("undefined_centers", [])) or "None"
    active_gates = ", ".join(str(g) for g in chart.get("active_gates", []))

    channels = chart.get("active_channels", [])
    channels_str = " | ".join(f"{g1}-{g2}" for g1, g2 in channels) or "None"

    def format_planets(planets: list) -> str:
        lines = []
        for p in planets:
            planet = p.get("planet", "")
            gate = p.get("gate", "")
            line = p.get("line", "")
            lines.append(f"  {planet}: Gate {gate}, Line {line}")
        return "\n".join(lines) if lines else "  (no data)"

    personality_str = format_planets(chart.get("personality_planets", []))
    design_str = format_planets(chart.get("design_planets", []))

    return f"""You are a Human Design expert. Please provide a full, detailed reading in Hebrew for the following person.

Name: {name}

=== CHART DATA ===
Type: {hd_type}
Profile: {profile}
Strategy: {strategy}
Authority: {authority}

Defined Centers: {defined}
Undefined Centers: {undefined}

Active Channels: {channels_str}
Active Gates: {active_gates}

Personality (Conscious) Planets:
{personality_str}

Design (Unconscious) Planets:
{design_str}

=== INSTRUCTIONS ===
Please provide a comprehensive Human Design reading covering:
1. Life purpose and general overview based on Type and Profile
2. Decision-making guidance (Strategy and Authority in daily life)
3. Strengths and gifts (defined centers and active channels)
4. Areas of wisdom through openness (undefined centers)
5. Life theme and what the Profile numbers mean for this person
6. Practical advice for living in alignment with this design

Respond entirely in Hebrew. Use professional Human Design terminology.
Keep the reading warm, personal, and actionable."""


def _build_html(name: str, chart: dict, prompt_url: str) -> str:
    hd_type = chart.get("type", "")
    type_he = TYPE_HE.get(hd_type, hd_type)
    profile = chart.get("profile", "")
    authority = chart.get("authority", "")
    strategy = STRATEGY_HE.get(hd_type, chart.get("strategy", ""))
    defined = ", ".join(chart.get("defined_centers", []))
    undefined = ", ".join(chart.get("undefined_centers", []))
    channels = chart.get("active_channels", [])
    channels_str = " | ".join(f"{g1}–{g2}" for g1, g2 in channels[:6])
    if len(channels) > 6:
        channels_str += f" +{len(channels) - 6} נוספים"

    return f"""
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>העיצוב האנושי של {name}</title>
</head>
<body style="margin:0;padding:0;background:#0D0B1A;font-family:'Helvetica Neue',Arial,sans-serif;direction:rtl;color:#F8F7FF;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0B1A;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <div style="color:rgba(139,92,246,0.8);font-size:13px;font-weight:600;letter-spacing:4px;text-transform:uppercase;margin-bottom:16px;">
                ✦ עיצוב אנושי
              </div>
              <h1 style="margin:0;font-size:32px;font-weight:800;background:linear-gradient(135deg,#8B5CF6,#EC4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
                העיצוב האנושי של {name}
              </h1>
              <p style="color:#9CA3AF;margin:8px 0 0;font-size:15px;">הנה סיכום הקריאה שלך</p>
            </td>
          </tr>

          <!-- Type Hero -->
          <tr>
            <td style="background:rgba(26,23,48,0.9);border:1px solid rgba(139,92,246,0.25);border-radius:16px;padding:32px;text-align:center;margin-bottom:16px;">
              <div style="font-size:48px;font-weight:800;color:#8B5CF6;margin-bottom:8px;">{type_he}</div>
              <div style="font-size:18px;color:rgba(248,247,255,0.6);margin-bottom:16px;">פרופיל {profile}</div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding:8px;">
                    <div style="background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.2);border-radius:10px;padding:14px;">
                      <div style="color:#9CA3AF;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px;">אסטרטגיה</div>
                      <div style="color:#F8F7FF;font-size:14px;font-weight:600;">🧭 {strategy}</div>
                    </div>
                  </td>
                  <td width="50%" style="padding:8px;">
                    <div style="background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.2);border-radius:10px;padding:14px;">
                      <div style="color:#9CA3AF;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px;">סמכות</div>
                      <div style="color:#F8F7FF;font-size:14px;font-weight:600;">⚡ {authority}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td style="height:12px;"></td></tr>

          <!-- Centers -->
          <tr>
            <td style="background:rgba(26,23,48,0.9);border:1px solid rgba(139,92,246,0.25);border-radius:16px;padding:24px;">
              <div style="color:#9CA3AF;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;">מרכזים מוגדרים</div>
              <div style="color:#c4b5fd;font-size:14px;font-weight:600;margin-bottom:20px;">{defined or "אין"}</div>
              <div style="color:#9CA3AF;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;">מרכזים פתוחים</div>
              <div style="color:#9CA3AF;font-size:14px;margin-bottom:20px;">{undefined or "אין"}</div>
              {"<div style='color:#9CA3AF;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;'>ערוצים פעילים</div><div style='color:#c4b5fd;font-size:13px;font-family:monospace;'>" + channels_str + "</div>" if channels else ""}
            </td>
          </tr>

          <tr><td style="height:12px;"></td></tr>

          <!-- CTA -->
          <tr>
            <td style="background:linear-gradient(135deg,rgba(139,92,246,0.15),rgba(236,72,153,0.1));border:1px solid rgba(139,92,246,0.3);border-radius:16px;padding:32px;text-align:center;">
              <div style="color:rgba(139,92,246,0.8);font-size:12px;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;">✦ קריאה מלאה עם AI</div>
              <h2 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#F8F7FF;">קבל פרשנות מעמיקה ב-ChatGPT</h2>
              <p style="color:#9CA3AF;font-size:14px;margin:0 0 24px;line-height:1.6;">
                הכנו לך פרומפט מותאם אישית עם כל נתוני המפה שלך.<br>
                פשוט לחץ, העתק והדבק ב-ChatGPT לקריאה מלאה בעברית.
              </p>
              <a href="{prompt_url}"
                 style="display:inline-block;background:linear-gradient(135deg,#8B5CF6,#EC4899);color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:15px;font-weight:700;">
                לחץ כאן להעתיק פרומפט ✦
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:32px;">
              <p style="color:rgba(156,163,175,0.5);font-size:12px;margin:0;">
                קיבלת מייל זה כי ביקשת קריאת עיצוב אנושי · 100% פרטי
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


async def send_chart_email(to_email: str, name: str, chart: dict) -> None:
    """Send chart summary email to the user via Resend."""
    if not RESEND_API_KEY:
        raise ValueError("RESEND_API_KEY is not set")

    resend.api_key = RESEND_API_KEY

    prompt = _build_prompt(name, chart)
    encoded = base64.urlsafe_b64encode(prompt.encode("utf-8")).decode("ascii")
    prompt_url = f"{FRONTEND_URL}/?prompt={encoded}"

    resend.Emails.send({
        "from": EMAIL_FROM,
        "to": [to_email],
        "subject": f"העיצוב האנושי של {name} - הקריאה שלך מוכנה",
        "html": _build_html(name, chart, prompt_url),
    })
