"""
Decision Stability Analyzer for ContextLock Zero.
Analyzes historical evidence and decision churn / reversals across project timelines.
Defensible historical metric computation.
"""
from typing import List, Dict, Any

def analyze_stability(decisions: List[Dict[str, Any]]) -> Dict[str, Any]:
    # Group decisions by category and sort by date
    category_map: Dict[str, List[Dict[str, Any]]] = {}
    for d in decisions:
        cat = d.get("category", "General")
        if cat not in category_map:
            category_map[cat] = []
        category_map[cat].append(d)
        
    for cat in category_map:
        category_map[cat].sort(key=lambda x: x.get("date", ""))
        
    instability_events = []
    auth_history = []
    
    if "Authentication" in category_map:
        auth_seq = category_map["Authentication"]
        for item in auth_seq:
            title = item.get("title", "")
            kw = "JWT" if "jwt" in title.lower() else ("OAuth 2.0" if "oauth" in title.lower() or "auth0" in title.lower() else ("Firebase" if "firebase" in title.lower() else title))
            auth_history.append({
                "date": item.get("date"),
                "technology": kw,
                "title": title,
                "owner": item.get("owner", "Unassigned")
            })
            
        if len(auth_history) >= 3:
            instability_events.append({
                "category": "Authentication",
                "level": "High Instability",
                "flip_count": len(auth_history),
                "sequence": " → ".join([h["technology"] for h in auth_history]),
                "explanation": f"Authentication architecture has changed {len(auth_history)} times across recent documents (PRD, meeting sync, commits). Frequent paradigm switching threatens mobile offline capabilities and gateway filters."
            })
            
    # Calculate churn score (100 = perfectly stable, 0 = highly volatile)
    total_flips = sum(e["flip_count"] for e in instability_events)
    stability_score = max(35, 100 - (total_flips * 15)) if instability_events else 94
    
    return {
        "stability_score": stability_score,
        "instability_events": instability_events,
        "category_histories": category_map,
        "auth_history": auth_history
    }
