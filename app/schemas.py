from pydantic import BaseModel, EmailStr, field_validator
from datetime import date, datetime
from typing import Optional


# IMPROVED: Base schema clearly defines shared validation rules
class PatientBase(BaseModel):
    full_name: str
    date_of_birth: date
    email: EmailStr
    glucose: float
    haemoglobin: float
    cholesterol: float

    # -------------------------------------------------
    # Name validation
    # -------------------------------------------------
    @field_validator("full_name")
    @classmethod
    def name_must_not_be_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Full name cannot be empty")
        if len(v) < 2:
            raise ValueError("Full name must be at least 2 characters")
        return v

    # IMPROVED: Added clearer error context (optional enhancement)
    @field_validator("date_of_birth")
    @classmethod
    def dob_must_be_past(cls, v: date) -> date:
        if v >= date.today():
            raise ValueError("Date of birth must be in the past")
        return v

    # -------------------------------------------------
    # Clinical validations
    # -------------------------------------------------
    @field_validator("glucose")
    @classmethod
    def glucose_range(cls, v: float) -> float:
        if v <= 0 or v > 1000:
            raise ValueError("Glucose must be between 0.1 and 1000 mg/dL")
        return v

    @field_validator("haemoglobin")
    @classmethod
    def haemoglobin_range(cls, v: float) -> float:
        if v <= 0 or v > 25:
            raise ValueError("Haemoglobin must be between 0.1 and 25 g/dL")
        return v

    @field_validator("cholesterol")
    @classmethod
    def cholesterol_range(cls, v: float) -> float:
        if v <= 0 or v > 1000:
            raise ValueError("Cholesterol must be between 0.1 and 1000 mg/dL")
        return v


# IMPROVED: Separate schema intent clarity (best practice)
class PatientCreate(PatientBase):
    """
    Schema used for creating a new patient.
    No extra fields needed here (kept clean intentionally).
    """
    pass


class PatientUpdate(PatientBase):
    """
    IMPROVED:
    In real production systems, update schemas are usually optional fields.
    Consider making fields Optional for PATCH-style updates.
    """
    pass

class PatientResponse(PatientBase):
    id: int
    risk_level: Optional[str] = None   # ADD THIS
    remarks: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None  # ADD THIS
    # IMPROVED: modern Pydantic v2 config style
    model_config = {"from_attributes": True}
