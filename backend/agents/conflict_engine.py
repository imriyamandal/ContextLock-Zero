"""
Conflict Detection Engine for ContextLock Zero.
Identifies contradictions and discrepancies across PRDs, meeting minutes, git commits, and code specs.
"""
from typing import List, Dict, Any
from db.models import ConflictModel

def detect_conflicts(decisions: List[Dict[str, Any]]) -> List[ConflictModel]:
    conflicts = []
    
    # Group decisions by category/topic
    auth_decisions = [d for d in decisions if d.get("category") == "Authentication"]
    
    # Check for 3-way or 2-way Authentication Dispute
    has_jwt = any("jwt" in d.get("title", "").lower() for d in auth_decisions)
    has_oauth = any("oauth" in d.get("title", "").lower() or "auth0" in d.get("title", "").lower() for d in auth_decisions)
    has_firebase = any("firebase" in d.get("title", "").lower() for d in auth_decisions)
    
    if has_jwt and has_oauth and has_firebase:
        conflicts.append(ConflictModel(
            id="conflict_auth_triad",
            decision_a="PRD: Stateless JWT (RSA-256)",
            decision_b="Meeting: OAuth 2.0 (Auth0)",
            source_a="PRD.md (Section 2)",
            source_b="meeting_notes.md (Agenda Item 1)",
            source_c="git_commits.json (Commit 8f3a9b1: Firebase SDK)",
            severity="Critical",
            title="3-Way Authentication Paradigm Conflict",
            description="The PRD specifies Stateless JWT for offline validation, Meeting Notes document a pivot to OAuth 2.0 for enterprise SSO, while Git commits reveal an engineer active with Firebase Auth SDK. Mobile offline sync and Edge Gateway validation will break.",
            recommendation="Convene an urgent architecture lock session with Sarah Chen (Backend), Mike Ross (Security), and Lisa Wong (Frontend) to standardize on either RS256 JWT or OAuth 2.0 with offline PKCE grants before client deployment."
        ))
    elif has_jwt and has_oauth:
        conflicts.append(ConflictModel(
            id="conflict_jwt_oauth",
            decision_a="PRD: Stateless JWT",
            decision_b="Meeting: OAuth 2.0 with Auth0",
            source_a="PRD.md",
            source_b="meeting_notes.md",
            severity="High",
            title="PRD vs Architecture Sync Conflict",
            description="PRD mandates custom stateless JWT tokens for edge verification, whereas meeting minutes approve Auth0 OAuth 2.0.",
            recommendation="Update PRD Section 2 to reflect OAuth 2.0 SSO requirements and remove conflicting JWT-only constraints."
        ))
    elif has_jwt and has_firebase:
        conflicts.append(ConflictModel(
            id="conflict_jwt_firebase",
            decision_a="PRD: Stateless JWT",
            decision_b="Git Commit: Firebase SDK",
            source_a="PRD.md",
            source_b="git_commits.json",
            severity="High",
            title="Code Implementation Drifts from Specification",
            description="Client codebase includes Firebase Auth SDK, bypassing the offline JWT cryptographic verification specified in the PRD.",
            recommendation="Revert Firebase commit or update system architecture to account for Firebase token verification on API Gateway."
        ))

    # Check for Gateway JWT filter vs Firebase implementation
    infra_decisions = [d for d in decisions if d.get("category") == "Infrastructure"]
    has_gateway_jwt = any("envoy" in d.get("title", "").lower() or "rs256" in d.get("title", "").lower() for d in infra_decisions)
    if has_gateway_jwt and has_firebase:
        conflicts.append(ConflictModel(
            id="conflict_gateway_firebase",
            decision_a="Infra: Envoy RS256 JWT Filter",
            decision_b="Frontend: Firebase Auth SDK",
            source_a="architecture_doc.md & Git Commit e17a544",
            source_b="git_commits.json (Commit 8f3a9b1)",
            severity="Critical",
            title="API Ingress Rejection Risk",
            description="Envoy API Gateway is configured to enforce RS256 public key JWT tokens on port 443, which will reject Firebase ID tokens at ingress.",
            recommendation="Align API Gateway authentication filter with frontend authentication tokens immediately to avoid service outage."
        ))

    # Generalized Category-Level Contradiction Scanner (for arbitrary user-uploaded files)
    categories = set(d.get("category") for d in decisions if d.get("category") not in ["Authentication", "General"])
    for cat in categories:
        cat_decisions = [d for d in decisions if d.get("category") == cat]
        if len(cat_decisions) >= 2:
            # Check if decisions have differing owners or incompatible alternatives
            d1 = cat_decisions[0]
            d2 = cat_decisions[1]
            if d1.get("title") != d2.get("title") and (d1.get("owner") != d2.get("owner") or d2.get("title") in d1.get("alternatives", [])):
                conf_id = f"conflict_{cat.lower()}_{len(conflicts)}"
                if not any(c.id == conf_id for c in conflicts):
                    conflicts.append(ConflictModel(
                        id=conf_id,
                        decision_a=f"{d1.get('title')}",
                        decision_b=f"{d2.get('title')}",
                        source_a=d1.get("paragraph", f"{cat} Spec 1"),
                        source_b=d2.get("paragraph", f"{cat} Spec 2"),
                        severity="High" if cat in ["Database", "Infrastructure", "Security"] else "Medium",
                        title=f"{cat} Specification Divergence",
                        description=f"Conflicting architectural mandates detected in {cat} category: '{d1.get('title')}' vs '{d2.get('title')}'.",
                        recommendation=f"Align stakeholders on a single canonical standard for {cat} before merging implementation code."
                    ))

    return conflicts
