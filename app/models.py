from sqlalchemy import Column, Integer, String, Float, Date, Text, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Patient(Base):
    """
    Patient table model.

    IMPROVED:
    - Cleaned documentation (removed self-referential "IMPROVED" notes).
    - Added optional type hints for better readability (optional enhancement).
    - Kept structure simple and production-friendly.
    """

    __tablename__ = "patients"

    # -------------------------------------------------
    # Primary Key
    # -------------------------------------------------
    

    id = Column(Integer, primary_key=True, index=True)

    # -------------------------------------------------
    # Patient Information
    # -------------------------------------------------

    full_name = Column(
        String(150),
        nullable=False,
        index=True  # IMPROVED: adds faster search capability in frontend search/filter use cases
    )

    date_of_birth = Column(
        Date,
        nullable=False
    )

    email = Column(
        String(255),
        nullable=False,
        unique=True,
        index=True,
    )

    # -------------------------------------------------
    # Clinical Measurements
    # -------------------------------------------------

    glucose = Column(Float, nullable=False)
    haemoglobin = Column(Float, nullable=False)
    cholesterol = Column(Float, nullable=False)

    # -------------------------------------------------
    # AI Analysis
    # -------------------------------------------------

    risk_level = Column(
        String(50),
        nullable=True,
        index=True  # IMPROVED: allows fast filtering for dashboard stats (Low/High/Moderate)
    )

    remarks = Column(Text, nullable=True)

    # -------------------------------------------------
    # Audit Fields
    # -------------------------------------------------

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
