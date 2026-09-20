"""
Database models for ContextLock Zero (SQLite).
Matches exact schema specified on Page 16-17 of project specification:
- Decision
- Evidence
- Conflict
- Dependency
"""
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class DecisionModel(BaseModel):
    id: str
    title: str
    owner: Optional[str] = None
    date: str
    confidence: float = 0.95
    category: str = "Architecture"
    reason: str = ""
    alternatives: List[str] = []
    status: str = "active" # active, conflicted, reverted, proposed
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class EvidenceModel(BaseModel):
    id: str
    decision_id: str
    source: str # e.g. "PRD.md", "meeting_notes.md"
    paragraph: str # e.g. "Section 2, Paragraph 1"
    quote: str
    confidence: float = 0.92
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ConflictModel(BaseModel):
    id: str
    decision_a: str
    decision_b: str
    severity: str # "Critical", "High", "Medium", "Low"
    title: str
    description: str
    source_a: str
    source_b: str
    source_c: Optional[str] = None
    recommendation: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class DependencyModel(BaseModel):
    id: str
    parent: str
    child: str
    relation: str # "caused", "discussed", "replaced", "approved", "depends_on"
    impact_level: str = "High" # "High", "Medium", "Low"

class HealthScoreBreakdown(BaseModel):
    overall_score: int # 0-100
    stability: int # 0-100
    stability_why: str
    conflict_level: int # 0-100 (100 = zero conflicts, lower = more conflicts)
    conflict_why: str
    documentation_sync: int # 0-100
    documentation_why: str
    ownership: int # 0-100
    ownership_why: str
    dependency_risk: int # 0-100
    dependency_why: str
    total_decisions: int
    total_conflicts: int
    unowned_decisions: int
