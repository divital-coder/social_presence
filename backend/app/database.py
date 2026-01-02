import oracledb
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import get_settings

settings = get_settings()


class Base(DeclarativeBase):
    pass


def get_oracle_connection():
    """Create Oracle connection using oracledb in Thin mode."""
    connection_params = {
        "user": settings.oracle_user,
        "password": settings.oracle_password,
        "dsn": settings.oracle_dsn,
    }

    # Add wallet configuration if provided
    if settings.oracle_wallet_dir:
        connection_params["config_dir"] = settings.oracle_wallet_dir
        connection_params["wallet_location"] = settings.oracle_wallet_dir
        connection_params["wallet_password"] = settings.oracle_password

    return oracledb.connect(**connection_params)


def create_oracle_engine():
    """Create SQLAlchemy engine for Oracle."""
    # Use oracledb in Thin mode (no Oracle Client needed)
    oracledb.init_oracle_client()  # Initialize Thin mode

    # Build connection URL for SQLAlchemy
    # Format: oracle+oracledb://user:password@host:port/service_name
    engine = create_engine(
        "oracle+oracledb://",
        creator=get_oracle_connection,
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,
    )
    return engine


# Create engine and session
engine = create_oracle_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Dependency for getting database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)
