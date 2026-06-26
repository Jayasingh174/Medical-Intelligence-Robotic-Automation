import os
import asyncio  # IMPROVED: Added timeout support for API requests.
import logging
from groq import AsyncGroq
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# IMPROVED: Model name is configurable via environment variable.
MODEL_NAME = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    logger.warning("GROQ_API_KEY is not set — AI remarks will be unavailable")

# Async Groq client
client = AsyncGroq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# IMPROVED: System prompt extracted into a constant for easier maintenance.
SYSTEM_PROMPT = (
    "You are a clinical decision support assistant. "
    "Be concise, factual, and never diagnose diseases. "
    "Recommend consulting a healthcare professional when appropriate."
)


async def generate_health_remark(
    glucose: float,
    haemoglobin: float,
    cholesterol: float,
) -> str:
    """Generate AI-powered health remarks using Groq."""

    if not client:
        return "AI service unavailable: GROQ_API_KEY not configured."

    prompt = f"""Analyze the following blood test results:

- Glucose: {glucose} mg/dL (Normal: 70–99 | Prediabetes: 100–125 | Diabetes Risk: ≥126)
- Haemoglobin: {haemoglobin} g/dL (Normal: ≥13.5 | Mildly Low: 8–13.4 | Critical: <8)
- Cholesterol: {cholesterol} mg/dL (Normal: <200 | Borderline: 200–239 | High: ≥240)

Provide:
1. A short health assessment.
2. Key risks if values are abnormal.
3. One actionable recommendation.

Keep the response under 80 words.
Do not claim a diagnosis.
Always recommend professional medical consultation.
"""

    try:
        # IMPROVED: Prevents hanging requests by enforcing a timeout.
        response = await asyncio.wait_for(
            client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {
                        "role": "system",
                        "content": SYSTEM_PROMPT,
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                temperature=0.3,
                max_tokens=150,
            ),
            timeout=15,
        )

        # IMPROVED: Safer response parsing.
        if (
            not response.choices
            or response.choices[0].message is None
            or not response.choices[0].message.content
        ):
            return "No AI health assessment available."

        return response.choices[0].message.content.strip()

    except asyncio.TimeoutError:
        # IMPROVED: Handles slow API responses gracefully.
        logger.warning("Groq API request timed out.")
        return "AI service timed out. Please try again."

    except Exception:
        # IMPROVED: Logs the complete traceback instead of only the exception text.
        logger.exception("Groq API call failed")
        return "Unable to generate AI health assessment at this time."
