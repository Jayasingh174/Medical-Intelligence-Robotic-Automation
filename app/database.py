from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base  # IMPROVED: modern import style
import os

# IMPROVED: Centralized configuration using env variable with fallback
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./mira_health.db")

# IMPROVED: Added engine configuration notes for production readiness
engine = create_engine(
    DATABASE_URL,
    connect_args=(
        {"check_same_thread": False}  # Required only for SQLite (FastAPI + threads)
        if DATABASE_URL.startswith("sqlite")
        else {}
    ),
    pool_pre_ping=True,  # IMPROVED: prevents stale DB connections in production
)

# IMPROVED: Session factory clearly separated for dependency injection usage in FastAPI
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# IMPROVED: Using modern declarative_base import style (SQLAlchemy 2.0 compatible)
Base = declarative_base()
