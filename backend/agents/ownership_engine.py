"""
Ownership Gap Engine for ContextLock Zero.
Detects architectural decisions and subsystems lacking assigned owners/DRIs.
"""
from typing import List, Dict, Any

def detect_ownership_gaps(decisions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    gaps = []
    
    for d in decisions:
        owner = d.get("owner")
        if not owner or owner.lower() in ["none", "unassigned", "[unassigned]", "tbd", "unknown"]:
            gaps.append({
                "decision_id": d.get("id"),
                "title": d.get("title"),
                "category": d.get("category", "General"),
                "date": d.get("date"),
                "risk_level": "High",
                "message": f"{d.get('title')} has no assigned owner or DRI.",
                "action_required": "Assign an engineering lead before implementation kickoff."
            })
            
    return gaps
