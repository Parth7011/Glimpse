import logging
from pathlib import Path
from contextlib import contextmanager
from typing import Generator
import psycopg
from psycopg.rows import dict_row
from pgvector.psycopg import register_vector
from mlpipeline.config import settings

logger = logging.getLogger(__name__)

@contextmanager
def get_db_connection(database_url: str | None = None) -> Generator[psycopg.Connection, None, None]:
    """
    Context manager providing a psycopg connection with pgvector registered.
    """
    url = database_url or settings.DATABASE_URL
    conn = psycopg.connect(url, row_factory=dict_row)
    try:
        # Register pgvector extension types on the connection
        register_vector(conn)
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error(f"Database error during transaction: {e}")
        raise
    finally:
        conn.close()


def init_database(database_url: str | None = None) -> bool:
    """
    Initializes database schema from schema.sql.
    """
    schema_path = Path(__file__).resolve().parent / "schema.sql"
    if not schema_path.exists():
        logger.error(f"Schema file not found at {schema_path}")
        return False

    with open(schema_path, "r", encoding="utf-8") as f:
        schema_sql = f.read()

    try:
        url = database_url or settings.DATABASE_URL
        with psycopg.connect(url) as conn:
            with conn.cursor() as cur:
                cur.execute(schema_sql)
            conn.commit()
            logger.info("Database schema initialized successfully with pgvector support.")
            return True
    except Exception as e:
        logger.error(f"Failed to initialize database schema: {e}")
        return False
