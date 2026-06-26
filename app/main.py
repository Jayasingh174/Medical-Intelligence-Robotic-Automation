from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.ai_service import generate_health_remark
from app.database import Base, SessionLocal, engine
from app.models import Patient   # FIXED: you were using models.Patient but not importing models
from app.schemas import PatientCreate, PatientResponse, PatientUpdate

# ==========================================================
# Load Environment Variables
# ==========================================================

load_dotenv()

# ==========================================================
# Database Initialization
# ==========================================================

Base.metadata.create_all(bind=engine)
# IMPROVED (IMPORTANT): In production replace with Alembic migrations

# ==========================================================
# FastAPI App
# ==========================================================

app = FastAPI(
    title="MIRA Health Prediction API",
    description="Medical Intelligence Robotic Automation - Health Prediction System",
    version="1.0.0",
)

# ==========================================================
# Database Dependency
# ==========================================================

def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==========================================================
# Health Check
# ==========================================================

@app.get("/api/health", tags=["System"])
def health_check():
    return {"status": "running", "service": "MIRA Health Prediction API"}

# ==========================================================
# Dashboard Statistics
# ==========================================================

@app.get("/api/stats", tags=["Dashboard"])
def get_stats(db: Session = Depends(get_db)):
    return {
        "total_patients": db.query(Patient).count(),
        "high_glucose": db.query(Patient).filter(Patient.glucose >= 126).count(),
        "high_cholesterol": db.query(Patient).filter(Patient.cholesterol >= 240).count(),
        "low_haemoglobin": db.query(Patient).filter(Patient.haemoglobin < 12).count(),
    }

# ==========================================================
# Get All Patients
# ==========================================================

@app.get(
    "/api/patients",
    response_model=list[PatientResponse],
    tags=["Patients"]
)
def get_all_patients(db: Session = Depends(get_db)):
    return db.query(Patient).order_by(Patient.id.desc()).all()


def calculate_risk(glucose, haemoglobin, cholesterol):
    score = 0

    # Glucose
    if glucose >= 126:
        score += 3
    elif glucose >= 100:
        score += 2
    elif glucose < 70:
        score += 2

    # Haemoglobin
    if haemoglobin < 8:
        score += 3
    elif haemoglobin < 12:
        score += 2

    # Cholesterol
    if cholesterol >= 240:
        score += 3
    elif cholesterol >= 200:
        score += 2

    # Final classification
    if score >= 5:
        return "High Risk"
    elif score >= 2:
        return "Moderate Risk"
    else:
        return "Low Risk"

# ==========================================================
# Get Patient By ID
# ==========================================================

@app.get(
    "/api/patients/{patient_id}",
    response_model=PatientResponse,
    tags=["Patients"]
)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    return patient

# ==========================================================
# Create Patient
# ==========================================================

@app.post(
    "/api/patients",
    response_model=PatientResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Patients"]
)
async def create_patient(payload: PatientCreate, db: Session = Depends(get_db)):

    existing = db.query(Patient).filter(Patient.email == payload.email).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Patient with this email already exists.",
        )

    # STEP 1: Calculate risk FIRST
    risk = calculate_risk(
        payload.glucose,
        payload.haemoglobin,
        payload.cholesterol
    )

    # STEP 2: Generate AI remark
    try:
        remark = await generate_health_remark(
            glucose=payload.glucose,
            haemoglobin=payload.haemoglobin,
            cholesterol=payload.cholesterol,
        )
    except Exception:
        remark = "AI analysis temporarily unavailable."

    # STEP 3: Create patient object properly
    patient = Patient(
        full_name=payload.full_name,
        date_of_birth=payload.date_of_birth,
        email=payload.email,
        glucose=payload.glucose,
        haemoglobin=payload.haemoglobin,
        cholesterol=payload.cholesterol,
        risk_level=risk,
        remarks=remark,
    )

    db.add(patient)
    db.commit()
    db.refresh(patient)

    return patient
# ==========================================================
# Update Patient
# ==========================================================

@app.put(
    "/api/patients/{patient_id}",
    response_model=PatientResponse,
    tags=["Patients"]
)
async def update_patient(patient_id: int, payload: PatientUpdate, db: Session = Depends(get_db)):

    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found",
        )

    update_data = payload.model_dump(exclude_unset=True)

    # IMPROVED: only update provided fields
    for key, value in update_data.items():
        setattr(patient, key, value)

    try:
        glucose_value = float(getattr(patient, "glucose"))
        haemoglobin_value = float(getattr(patient, "haemoglobin"))
        cholesterol_value = float(getattr(patient, "cholesterol"))
        remark = await generate_health_remark(
            glucose=glucose_value,
            haemoglobin=haemoglobin_value,
            cholesterol=cholesterol_value,
        )
        setattr(patient, "remarks", remark)
    except Exception:
        pass  # IMPROVED: should be logged in production

    setattr(patient, "risk_level", calculate_risk(patient.glucose, patient.haemoglobin, patient.cholesterol))

    db.commit()
    db.refresh(patient)

    return patient

# ==========================================================
# Delete Patient
# ==========================================================

@app.delete("/api/patients/{patient_id}", tags=["Patients"])
def delete_patient(patient_id: int, db: Session = Depends(get_db)):

    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found",
        )

    db.delete(patient)
    db.commit()

    return {"message": "Patient deleted successfully"}

# ==========================================================
# Frontend
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent

app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "static"),
    name="static",
)

@app.get("/", response_class=FileResponse, include_in_schema=False)
def serve_frontend():
    return FileResponse(BASE_DIR / "static" / "index.html")

