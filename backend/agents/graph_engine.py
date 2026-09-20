"""
Decision Graph Engine for ContextLock Zero.
Generates React Flow compatible interactive graph nodes and animated edges.
Includes:
- Colored Node Types: Decision, Meeting, Commit, Person, Requirement, Alternative
- Typed Edges: caused, discussed, replaced, approved, depends_on
- Impact Simulator (downstream dependency blast radius calculation)
- Decision Replay chronological timeline milestones
"""
from typing import List, Dict, Any, Set
from db.models import DecisionModel, DependencyModel

def build_graph(decisions: List[Dict[str, Any]], dependencies: List[Dict[str, Any]]) -> Dict[str, Any]:
    nodes = []
    edges = []
    
    # Static component nodes for rich architecture context
    system_components = [
        {"id": "comp_api_gateway", "title": "API Gateway (Envoy)", "type": "Requirement", "category": "Infrastructure", "x": 600, "y": 180, "owner": "David Park"},
        {"id": "comp_mobile_login", "title": "Mobile Client (iOS/Android)", "type": "Requirement", "category": "Mobile", "x": 600, "y": 300, "owner": "Lisa Wong"},
        {"id": "comp_offline_mode", "title": "Offline Cryptographic Verification", "type": "Requirement", "category": "Mobile", "x": 600, "y": 420, "owner": "Sarah Chen"},
    ]
    
    # 1. Generate nodes for Decisions
    base_x = 250
    base_y = 120
    
    for i, d in enumerate(decisions):
        d_id = d.get("id") or f"dec_{i}"
        d_title = d.get("title", "")
        status = d.get("status", "active")
        
        # Determine visual style and node type
        node_type = "Decision"
        if "commit" in d_title.lower() or "implement" in d_title.lower():
            node_type = "Commit"
        elif "meeting" in d_title.lower() or "adopt" in d_title.lower():
            node_type = "Meeting"
            
        nodes.append({
            "id": d_id,
            "type": node_type,
            "data": {
                "label": d_title,
                "title": d_title,
                "owner": d.get("owner", "Unassigned"),
                "date": d.get("date", "2025-09-10"),
                "category": d.get("category", "General"),
                "confidence": d.get("confidence", 0.92),
                "reason": d.get("reason", ""),
                "status": status,
                "alternatives": d.get("alternatives", []),
                "quote": d.get("quote", "")
            },
            "position": {"x": base_x, "y": base_y + (i * 120)}
        })
        
        # Add Owner (Person) Node if assigned
        owner = d.get("owner")
        if owner and owner.lower() not in ["none", "unassigned", "[unassigned]"]:
            person_id = f"person_{owner.split()[0].lower()}"
            if not any(n["id"] == person_id for n in nodes):
                nodes.append({
                    "id": person_id,
                    "type": "Person",
                    "data": {
                        "label": owner,
                        "title": owner,
                        "role": "Owner / DRI",
                        "category": "Team"
                    },
                    "position": {"x": 50, "y": base_y + (len(nodes) * 50)}
                })
            edges.append({
                "id": f"e_person_{person_id}_{d_id}",
                "source": person_id,
                "target": d_id,
                "label": "approved",
                "animated": False,
                "style": {"stroke": "#10B981", "strokeWidth": 1.5}
            })

    # Add system components
    for comp in system_components:
        nodes.append({
            "id": comp["id"],
            "type": "Requirement",
            "data": {
                "label": comp["title"],
                "title": comp["title"],
                "owner": comp["owner"],
                "category": comp["category"]
            },
            "position": {"x": comp["x"], "y": comp["y"]}
        })
        
    # Connect Authentication decisions to downstream system components
    for n in nodes:
        if n["type"] in ["Decision", "Commit", "Meeting"] and "auth" in n["data"].get("category", "").lower() or "jwt" in n["id"].lower() or "oauth" in n["id"].lower() or "firebase" in n["id"].lower():
            # Connect to API Gateway
            edges.append({
                "id": f"e_{n['id']}_gateway",
                "source": n["id"],
                "target": "comp_api_gateway",
                "label": "depends_on",
                "animated": True,
                "style": {"stroke": "#7C3AED", "strokeWidth": 2}
            })
            # Connect to Mobile Login
            edges.append({
                "id": f"e_{n['id']}_mobile",
                "source": n["id"],
                "target": "comp_mobile_login",
                "label": "depends_on",
                "animated": True,
                "style": {"stroke": "#22D3EE", "strokeWidth": 2}
            })
            # Connect to Offline Mode
            edges.append({
                "id": f"e_{n['id']}_offline",
                "source": n["id"],
                "target": "comp_offline_mode",
                "label": "depends_on",
                "animated": True,
                "style": {"stroke": "#EF4444" if "firebase" in n["id"].lower() else "#7C3AED", "strokeWidth": 2}
            })
            
    # Add dependency relations from DB
    for dep in dependencies:
        edges.append({
            "id": dep.get("id", f"dep_{dep.get('parent')}_{dep.get('child')}"),
            "source": dep.get("parent"),
            "target": dep.get("child"),
            "label": dep.get("relation", "depends_on"),
            "animated": True,
            "style": {"stroke": "#22D3EE", "strokeWidth": 2}
        })
        
    return {
        "nodes": nodes,
        "edges": edges,
        "summary": {
            "total_nodes": len(nodes),
            "total_edges": len(edges)
        }
    }

def simulate_impact(node_id: str, graph: Dict[str, Any]) -> Dict[str, Any]:
    """
    Impact Blast Radius Simulator.
    Given a node (e.g. 'dec_jwt' or 'comp_api_gateway'), calculates:
    - Direct dependents
    - Indirect / downstream cascading blast radius
    - Severity rating and affected services list
    """
    nodes_map = {n["id"]: n for n in graph["nodes"]}
    target_node = nodes_map.get(node_id)
    
    if not target_node:
        # Fallback search by keyword
        for nid, n in nodes_map.items():
            if node_id.lower() in nid.lower() or node_id.lower() in n["data"].get("title", "").lower():
                target_node = n
                node_id = nid
                break
                
    if not target_node:
        return {
            "target_node_id": node_id,
            "found": False,
            "impacted_nodes": [],
            "risk_level": "Low",
            "blast_radius_score": 0
        }
        
    impacted_ids: Set[str] = set()
    queue = [node_id]
    
    while queue:
        curr = queue.pop(0)
        for edge in graph["edges"]:
            if edge["source"] == curr and edge["target"] not in impacted_ids:
                impacted_ids.add(edge["target"])
                queue.append(edge["target"])
                
    impacted_details = []
    for iid in impacted_ids:
        n = nodes_map.get(iid)
        if n:
            impacted_details.append({
                "id": iid,
                "title": n["data"].get("title", iid),
                "type": n.get("type", "Requirement"),
                "category": n["data"].get("category", "General"),
                "owner": n["data"].get("owner", "Unassigned")
            })
            
    risk_level = "High" if len(impacted_details) >= 3 else ("Medium" if len(impacted_details) >= 1 else "Low")
    blast_radius_score = min(100, len(impacted_details) * 28 + 15)
    
    return {
        "target_node_id": node_id,
        "target_title": target_node["data"].get("title", node_id),
        "found": True,
        "impacted_count": len(impacted_details),
        "impacted_nodes": impacted_details,
        "risk_level": risk_level,
        "blast_radius_score": blast_radius_score,
        "technical_summary": f"Modifying '{target_node['data'].get('title')}' cascades directly to {len(impacted_details)} downstream architecture systems: {', '.join([d['title'] for d in impacted_details])}."
    }

def get_replay_timeline(decisions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Provides chronological snapshot milestones for the Decision Replay scrubber slider.
    """
    sorted_dec = sorted(decisions, key=lambda x: x.get("date", ""))
    milestones = []
    
    for idx, d in enumerate(sorted_dec):
        milestones.append({
            "step": idx + 1,
            "date": d.get("date", "2025-09-10"),
            "event_title": d.get("title"),
            "category": d.get("category"),
            "owner": d.get("owner", "Unassigned"),
            "rationale": d.get("reason"),
            "quote": d.get("quote"),
            "unlocked_node_id": d.get("id"),
            "active_node_ids": [sorted_dec[j].get("id") for j in range(idx + 1)]
        })
        
    return milestones
