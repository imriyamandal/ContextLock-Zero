# ContextLock Zero Architecture & Technical Specification

## Core System Overview
ContextLock Zero is an AI Decision Immune System designed to detect hidden contradictions and protect project decisions across distributed engineering teams.

```
                    ┌────────────────────────────────────────┐
                    │    Uploaded Artifacts (PDF, MD, Git)   │
                    └───────────────────┬────────────────────┘
                                        │
                            ┌───────────▼───────────┐
                            │    Extractor Agent    │ (Gemini AI + Deterministic AST)
                            └───────────┬───────────┘
                                        │
                            ┌───────────▼───────────┐
                            │ Decision Graph Engine │ (React Flow + Topology Mapper)
                            └───────────┬───────────┘
               ┌────────────────────────┼────────────────────────┐
               │                        │                        │
    ┌──────────▼──────────┐  ┌──────────▼──────────┐  ┌──────────▼──────────┐
    │Conflict Radar Engine│  │Dependency Blaster   │  │Ownership Gap Engine │
    └──────────┬──────────┘  └──────────┬──────────┘  └──────────┬──────────┘
               │                        │                        │
               └────────────────────────┼────────────────────────┘
                                        │
                            ┌───────────▼───────────┐
                            │Stability & Health Core│ (Explainable 5-Metric Engine)
                            └───────────┬───────────┘
                                        │
                   ┌────────────────────┴────────────────────┐
                   │                                         │
        ┌──────────▼──────────┐                   ┌──────────▼──────────┐
        │ Decision Passport   │                   │ Grounded Evidence   │
        │ PDF Engine          │                   │ AI Chat Assistant   │
        └─────────────────────┘                   └─────────────────────┘
```

## Multi-Agent Responsibilities
1. **Extractor Agent (`backend/agents/extractor.py`)**:
   - Parses unstructured documents using Gemini 2.5 Flash with structured JSON output and deterministic heuristic tokenizers.
   - Extracts title, owner, timestamp, confidence, category, reason, alternatives, and exact grounding quotes.
2. **Conflict Radar Engine (`backend/agents/conflict_engine.py`)**:
   - Cross-analyzes extracted decisions across distinct artifact types (PRD, meeting notes, git commits).
   - Flags 3-way disputes (e.g., JWT vs OAuth 2.0 vs Firebase SDK) with severity classifications and action recommendations.
3. **Decision Stability Analyzer (`backend/agents/stability_engine.py`)**:
   - Computes historical decision churn across the project timeline.
   - Flags paradigm reversals and flip-flop sequences.
4. **Ownership Gap Engine (`backend/agents/ownership_engine.py`)**:
   - Identifies orphaned architecture decisions and subsystems missing assigned DRIs.
5. **Explainable Health Scorer (`backend/agents/health_engine.py`)**:
   - Computes weighted overall health score (0-100) across 5 transparent dimensions: Stability, Conflict Level, Ownership, Documentation Sync, and Dependency Risk.
   - Generates transparent "The Why" explanations for every score.
6. **Impact Simulator (`backend/agents/graph_engine.py`)**:
   - Traverses directed dependency trees to calculate downstream blast radius when any decision node is modified.
7. **Decision Replay Scrubber**:
   - Generates chronological milestone snapshots allowing interactive step-by-step playback of project history.
8. **Evidence AI Chat (`backend/agents/chat_engine.py`)**:
   - Strictly grounded conversational assistant citing source files and paragraph locations.
9. **PDF Passport Generator (`backend/report/pdf_generator.py`)**:
   - Renders executive-ready PDF report matching Strategic Initiative Review layout.

## Database Schema (SQLite)
- **`decisions`**: Primary entity storing decisions, categories, confidence, status, and rationales.
- **`evidence`**: Grounded citations linked to decisions with source file, paragraph, and exact quote.
- **`conflicts`**: Discrepancies between decisions with severity, comparison text, and remediation advice.
- **`dependencies`**: Relational edges connecting decisions and system components with typed links.
- **`uploaded_files`**: Raw artifact store supporting multi-format ingestion.
