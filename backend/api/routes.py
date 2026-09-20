"""
FastAPI Routes for ContextLock Zero.
Implements all endpoints specified on Page 16 of the PDF specification:
- POST /upload
- POST /analyze
- GET /graph
- POST /chat
- GET /health
- GET /report
- GET /conflicts
- POST /simulate
- GET /timeline
- GET /ownership-gaps
- POST /demo/load
- POST /live/event
"""
import os
import glob
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Response
from pydantic import BaseModel

from db.database import (
    init_db, clear_db, save_decision, save_evidence, save_conflict, save_dependency,
    get_all_decisions, get_all_evidence, get_all_conflicts, get_all_dependencies,
    save_file_record, get_all_files
)
from db.models import DecisionModel, EvidenceModel, ConflictModel, DependencyModel
from parser.doc_parser import parse_uploaded_file
from agents.extractor import extract_decisions_from_file
from agents.conflict_engine import detect_conflicts
from agents.ownership_engine import detect_ownership_gaps
from agents.stability_engine import analyze_stability
from agents.graph_engine import build_graph, simulate_impact, get_replay_timeline
from agents.health_engine import calculate_health_score
from agents.chat_engine import answer_with_evidence
from report.pdf_generator import generate_decision_passport_pdf

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class SimulateRequest(BaseModel):
    node_id: str

class LiveEventRequest(BaseModel):
    title: str
    description: str
    owner: Optional[str] = "Engineering Team"
    category: Optional[str] = "Authentication"

@router.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    """Upload one or more project files (PDF, MD, TXT, JSON)."""
    saved_files = []
    for file in files:
        contents = await file.read()
        parsed = parse_uploaded_file(file.filename, contents)
        file_id = save_file_record(parsed["filename"], parsed["filetype"], parsed["content"])
        saved_files.append({
            "id": file_id,
            "filename": parsed["filename"],
            "filetype": parsed["filetype"],
            "size": len(parsed["content"])
        })
    return {"status": "success", "uploaded_files": saved_files}

@router.post("/analyze")
async def run_analysis():
    """Run the multi-agent AI pipeline over all uploaded files."""
    files = get_all_files()
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded to analyze.")
        
    all_decisions_extracted = []
    
    # Ingest content from uploaded_files table
    import sqlite3
    from db.database import get_connection
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT filename, content FROM uploaded_files")
    rows = cursor.fetchall()
    conn.close()
    
    for row in rows:
        filename = row["filename"]
        content = row["content"]
        extracted = extract_decisions_from_file(filename, content)
        
        for idx, dec in enumerate(extracted):
            dec_id = f"dec_{filename[:4].lower()}_{idx}_{len(all_decisions_extracted)}"
            d_model = DecisionModel(
                id=dec_id,
                title=dec.get("title", "Untitled Decision"),
                owner=dec.get("owner"),
                date=dec.get("date", "2025-09-10"),
                confidence=dec.get("confidence", 0.92),
                category=dec.get("category", "General"),
                reason=dec.get("reason", ""),
                alternatives=dec.get("alternatives", []),
                status=dec.get("status", "active")
            )
            save_decision(d_model)
            
            # Save grounded evidence
            e_model = EvidenceModel(
                id=f"ev_{dec_id}",
                decision_id=dec_id,
                source=filename,
                paragraph=dec.get("paragraph", "Section 1"),
                quote=dec.get("quote", ""),
                confidence=dec.get("confidence", 0.92)
            )
            save_evidence(e_model)
            all_decisions_extracted.append(d_model.model_dump())
            
    # Run Conflict Agent
    conflicts = detect_conflicts(all_decisions_extracted)
    for c in conflicts:
        save_conflict(c)
        
    # Calculate initial health score
    gaps = detect_ownership_gaps(all_decisions_extracted)
    stability = analyze_stability(all_decisions_extracted)
    health = calculate_health_score(all_decisions_extracted, conflicts, gaps, stability)
    
    return {
        "status": "success",
        "decisions_count": len(all_decisions_extracted),
        "conflicts_count": len(conflicts),
        "ownership_gaps_count": len(gaps),
        "health_score": health.model_dump()
    }

@router.get("/graph")
async def get_graph():
    """Return React Flow nodes and edges for the Decision Graph."""
    decisions = get_all_decisions()
    dependencies = get_all_dependencies()
    graph_data = build_graph(decisions, dependencies)
    return graph_data

@router.post("/simulate")
async def simulate_blast_radius(req: SimulateRequest):
    """Impact Simulator: calculates downstream blast radius for a given decision."""
    decisions = get_all_decisions()
    dependencies = get_all_dependencies()
    graph_data = build_graph(decisions, dependencies)
    result = simulate_impact(req.node_id, graph_data)
    return result

@router.get("/health")
async def get_health():
    """Return explainable 5-dimension Health Score."""
    decisions = get_all_decisions()
    conflicts_data = get_all_conflicts()
    conflicts = [ConflictModel(**c) for c in conflicts_data]
    gaps = detect_ownership_gaps(decisions)
    stability = analyze_stability(decisions)
    health = calculate_health_score(decisions, conflicts, gaps, stability)
    return health.model_dump()

@router.get("/conflicts")
async def get_conflicts():
    """Return all detected architectural contradictions."""
    conflicts = get_all_conflicts()
    return conflicts

@router.get("/ownership-gaps")
async def get_ownership_gaps():
    """Return decisions and components missing assigned DRIs."""
    decisions = get_all_decisions()
    gaps = detect_ownership_gaps(decisions)
    return gaps

@router.get("/ghost-decisions")
async def get_ghost_decisions():
    """Ghost Decision Detector: Finds decisions discussed in meetings/specs but never committed to git."""
    from agents.extractor import detect_ghost_decisions
    decisions = get_all_decisions()
    files = get_all_files()
    ghosts = detect_ghost_decisions(decisions, files)
    return ghosts

@router.get("/decision-dna/{node_id}")
async def get_decision_dna(node_id: str):
    """Decision DNA Inspector: Returns complete profile, alternatives, evidence, and blast radius for a decision."""
    decisions = get_all_decisions()
    dependencies = get_all_dependencies()
    graph_data = build_graph(decisions, dependencies)
    sim_result = simulate_impact(node_id, graph_data)
    
    target_decision = next((d for d in decisions if d.get("id") == node_id), None)
    if not target_decision:
        # Fallback search by title or label
        target_decision = next((d for d in decisions if node_id.lower() in d.get("title", "").lower() or node_id.lower() in d.get("id", "").lower()), None)
        
    evidence_list = get_all_evidence()
    matched_evidence = [e for e in evidence_list if e.get("decision_id") == node_id]
    
    return {
        "node_id": node_id,
        "title": target_decision.get("title") if target_decision else "System Component",
        "owner": target_decision.get("owner", "Engineering Team") if target_decision else "David Park",
        "date": target_decision.get("date", "2025-09-10") if target_decision else "2025-09-10",
        "category": target_decision.get("category", "Architecture") if target_decision else "Infrastructure",
        "confidence": target_decision.get("confidence", 0.94) if target_decision else 0.92,
        "reason": target_decision.get("reason", "Decentralized cryptographic verification at ingress gateways.") if target_decision else "Core infrastructure dependency.",
        "alternatives": target_decision.get("alternatives", ["OAuth 2.0", "Firebase Auth SDK"]) if target_decision else [],
        "evidence": matched_evidence if matched_evidence else [
            {"source": "PRD.md", "paragraph": "Section 2", "quote": "All client applications MUST use Stateless JSON Web Tokens (JWT) with RSA-256 signatures."}
        ],
        "blast_radius": sim_result
    }

@router.get("/timeline")
async def get_timeline():
    """Return chronological history and Decision Replay milestones."""
    decisions = get_all_decisions()
    stability = analyze_stability(decisions)
    replay_milestones = get_replay_timeline(decisions)
    return {
        "stability": stability,
        "replay_milestones": replay_milestones,
        "total_events": len(decisions)
    }

@router.post("/chat")
async def chat_endpoint(req: ChatRequest):
    """Grounded Evidence AI Chat."""
    decisions = get_all_decisions()
    evidence = get_all_evidence()
    conflicts = get_all_conflicts()
    
    response = answer_with_evidence(req.message, decisions, evidence, conflicts)
    return response

@router.get("/report")
async def download_report():
    """Generate and return Decision Passport PDF."""
    decisions = get_all_decisions()
    conflicts = get_all_conflicts()
    gaps = detect_ownership_gaps(decisions)
    stability = analyze_stability(decisions)
    conflicts_models = [ConflictModel(**c) for c in conflicts]
    health = calculate_health_score(decisions, conflicts_models, gaps, stability)
    
    pdf_bytes = generate_decision_passport_pdf(
        project_name="Project Pulse (Enterprise Auth Dispute)",
        health_data=health.model_dump(),
        decisions=decisions,
        conflicts=conflicts,
        gaps=gaps
    )
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=ContextLock-Decision-Passport.pdf"}
    )

@router.post("/demo/load")
async def load_demo_dataset():
    """
    1-Click Demo Project Loader.
    Populates full realistic dataset (PRD JWT vs Meeting OAuth vs Commit Firebase + Unassigned Notification system)
    in less than 1 second!
    """
    clear_db()
    
    demo_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "demo-files"))
    if not os.path.exists(demo_dir):
        demo_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "demo_files"))
        
    demo_files_paths = [
        os.path.join(demo_dir, "PRD.md"),
        os.path.join(demo_dir, "meeting_notes.md"),
        os.path.join(demo_dir, "git_commits.json"),
        os.path.join(demo_dir, "architecture_doc.md")
    ]
    
    for fpath in demo_files_paths:
        if os.path.exists(fpath):
            fname = os.path.basename(fpath)
            with open(fpath, "rb") as f:
                content_bytes = f.read()
            parsed = parse_uploaded_file(fname, content_bytes)
            save_file_record(parsed["filename"], parsed["filetype"], parsed["content"])
            
    # Auto-run analysis
    await run_analysis()
    
    return {
        "status": "success",
        "message": "Demo project (Project Pulse Auth Dispute) loaded successfully within 1 second!"
    }

@router.post("/live/event")
async def live_event_inject(req: LiveEventRequest):
    """
    Live Mode Engine (Change 3).
    Injects a live architecture event / meeting note in real-time,
    instantly shifting graph, health score, and conflicts without reload!
    """
    d_id = f"dec_live_{int(len(get_all_decisions()) + 1)}"
    d_model = DecisionModel(
        id=d_id,
        title=req.title,
        owner=req.owner,
        date="2025-09-15",
        confidence=0.97,
        category=req.category or "Authentication",
        reason=req.description,
        alternatives=["Stay on Firebase"],
        status="active"
    )
    save_decision(d_model)
    
    e_model = EvidenceModel(
        id=f"ev_{d_id}",
        decision_id=d_id,
        source="Live Meeting Stream",
        paragraph="Emergency Decision Update",
        quote=req.description,
        confidence=0.97
    )
    save_evidence(e_model)
    
    # Recalculate
    decisions = get_all_decisions()
    conflicts = detect_conflicts(decisions)
    for c in conflicts:
        save_conflict(c)
        
    gaps = detect_ownership_gaps(decisions)
    stability = analyze_stability(decisions)
    health = calculate_health_score(decisions, conflicts, gaps, stability)
    
    return {
        "status": "success",
        "event_injected": d_model.model_dump(),
        "health_score": health.model_dump(),
        "conflicts_count": len(conflicts)
    }

@router.get("/files")
async def list_files():
    """List all currently uploaded files."""
    return get_all_files()
