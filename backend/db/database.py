"""
SQLite Database manager for ContextLock Zero.
Provides robust persistence and atomic operations for:
- Decision
- Evidence
- Conflict
- Dependency
"""
import sqlite3
import json
import os
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from .models import DecisionModel, EvidenceModel, ConflictModel, DependencyModel

DB_PATH = os.environ.get("DATABASE_PATH", os.path.join(os.path.dirname(__file__), "contextlock.db"))

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS decisions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        owner TEXT,
        date TEXT,
        confidence REAL,
        category TEXT,
        reason TEXT,
        alternatives TEXT,
        status TEXT,
        created_at TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS evidence (
        id TEXT PRIMARY KEY,
        decision_id TEXT,
        source TEXT,
        paragraph TEXT,
        quote TEXT,
        confidence REAL,
        created_at TEXT,
        FOREIGN KEY(decision_id) REFERENCES decisions(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS conflicts (
        id TEXT PRIMARY KEY,
        decision_a TEXT,
        decision_b TEXT,
        severity TEXT,
        title TEXT,
        description TEXT,
        source_a TEXT,
        source_b TEXT,
        source_c TEXT,
        recommendation TEXT,
        created_at TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS dependencies (
        id TEXT PRIMARY KEY,
        parent TEXT,
        child TEXT,
        relation TEXT,
        impact_level TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS uploaded_files (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        filetype TEXT,
        content TEXT,
        uploaded_at TEXT
    )
    """)

    conn.commit()
    conn.close()

def clear_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM decisions")
    cursor.execute("DELETE FROM evidence")
    cursor.execute("DELETE FROM conflicts")
    cursor.execute("DELETE FROM dependencies")
    cursor.execute("DELETE FROM uploaded_files")
    conn.commit()
    conn.close()

def save_decision(decision: DecisionModel):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO decisions 
    (id, title, owner, date, confidence, category, reason, alternatives, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        decision.id,
        decision.title,
        decision.owner,
        decision.date,
        decision.confidence,
        decision.category,
        decision.reason,
        json.dumps(decision.alternatives),
        decision.status,
        decision.created_at
    ))
    conn.commit()
    conn.close()

def save_evidence(evidence: EvidenceModel):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO evidence
    (id, decision_id, source, paragraph, quote, confidence, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        evidence.id,
        evidence.decision_id,
        evidence.source,
        evidence.paragraph,
        evidence.quote,
        evidence.confidence,
        evidence.created_at
    ))
    conn.commit()
    conn.close()

def save_conflict(conflict: ConflictModel):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO conflicts
    (id, decision_a, decision_b, severity, title, description, source_a, source_b, source_c, recommendation, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        conflict.id,
        conflict.decision_a,
        conflict.decision_b,
        conflict.severity,
        conflict.title,
        conflict.description,
        conflict.source_a,
        conflict.source_b,
        conflict.source_c,
        conflict.recommendation,
        conflict.created_at
    ))
    conn.commit()
    conn.close()

def save_dependency(dep: DependencyModel):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO dependencies
    (id, parent, child, relation, impact_level)
    VALUES (?, ?, ?, ?, ?)
    """, (
        dep.id,
        dep.parent,
        dep.child,
        dep.relation,
        dep.impact_level
    ))
    conn.commit()
    conn.close()

def get_all_decisions() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM decisions ORDER BY date ASC")
    rows = cursor.fetchall()
    results = []
    for r in rows:
        d = dict(r)
        d["alternatives"] = json.loads(d["alternatives"]) if d.get("alternatives") else []
        results.append(d)
    conn.close()
    return results

def get_all_evidence() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM evidence")
    rows = cursor.fetchall()
    results = [dict(r) for r in rows]
    conn.close()
    return results

def get_all_conflicts() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM conflicts ORDER BY created_at DESC")
    rows = cursor.fetchall()
    results = [dict(r) for r in rows]
    conn.close()
    return results

def get_all_dependencies() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM dependencies")
    rows = cursor.fetchall()
    results = [dict(r) for r in rows]
    conn.close()
    return results

import uuid

def save_file_record(filename: str, filetype: str, content: str):
    conn = get_connection()
    cursor = conn.cursor()
    file_id = f"file_{uuid.uuid4().hex[:12]}"
    cursor.execute("""
    INSERT OR REPLACE INTO uploaded_files (id, filename, filetype, content, uploaded_at)
    VALUES (?, ?, ?, ?, ?)
    """, (file_id, filename, filetype, content, datetime.now(timezone.utc).isoformat()))
    conn.commit()
    conn.close()
    return file_id

def get_all_files() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, filename, filetype, uploaded_at, length(content) as size FROM uploaded_files")
    rows = cursor.fetchall()
    results = [dict(r) for r in rows]
    conn.close()
    return results
