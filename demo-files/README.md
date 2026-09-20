# Demo Project Dataset: Project Pulse Auth Dispute

This folder contains a ready-to-test authentic project dataset showcasing why **ContextLock Zero** is necessary for high-velocity teams:

1. **`PRD.md`**: Sarah Chen mandates **Stateless JWT** for offline cryptographic validation.
2. **`meeting_notes.md`**: Security team meeting pivots to **OAuth 2.0 with Auth0** for enterprise SSO.
3. **`git_commits.json`**: Developer commits **Firebase Authentication SDK** directly into repository.
4. **`architecture_doc.md`**: Highlights critical system dependencies (API Gateway, Mobile Login, Offline Mode) and identifies **Notification Architecture as an unowned risk**.
5. **`live_event_update.md`**: Emergency meeting reverting back to JWT, causing high churn/instability.

### The Problem ContextLock Zero Solves Here:
Without ContextLock Zero, three engineers build on three conflicting authentication paradigms at the same time. ContextLock Zero extracts these decisions, flags the 3-way contradiction, simulates downstream blast radius, identifies missing owners, and alerts the team before production deployment!
