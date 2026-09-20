# Emergency Incident Sync & Auth Reversion

**Date**: 2025-09-15 11:00 AM  
**Author**: Alex Rivera (Engineering Manager)  
**Topic**: Critical Production Auth Conflict & Reversion

## Emergency Decision
- **Decision**: Immediate reversion back to custom **JWT Authentication** due to Firebase rate-limiting and enterprise SSO blockers.
- **Reason**: Firebase broke offline-first cryptographic signature verification on mobile devices, and OAuth 2.0 Auth0 contract is delayed by 3 weeks.
- **Impact**: All edge gateways revert to RS256 token verification.
- **Owner**: Sarah Chen
- **Status**: Hotfix in progress
