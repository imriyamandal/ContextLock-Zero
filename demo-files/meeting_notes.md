# Architecture Sync & Security Review Meeting Notes

**Date**: 2025-09-12  
**Attendees**: Alex Rivera (Engineering Manager), Mike Ross (Security Architect), Sarah Chen (Backend Lead)  
**Status**: Approved

## Agenda
1. Enterprise Security Compliance (SOC2 / HIPAA)
2. Identity Management & SSO Integration
3. Mobile Offline Sync Strategy

## Discussion Points & Decisions
- **Decision: Switch Identity Provider to OAuth 2.0 with Auth0**
  - **Proposed by**: Mike Ross
  - **Decision**: The team agreed to pivot away from standalone JWT to centralized OAuth 2.0 with Auth0 enterprise federation.
  - **Reason**: Enterprise enterprise customers mandate SAML / Okta / Google Workspace SSO integration which OAuth 2.0 handles natively out-of-the-box.
  - **Impact**: Mobile login flow must use PKCE authorization code grant. Offline support will require caching authorization grants locally.
  - **Approved by**: Alex Rivera (EM)

- **Database Selection**:
  - **Decision**: Adopt PostgreSQL 16 with TimescaleDB extension for audit logs.
  - **Owner**: Sarah Chen
  - **Reason**: High performance for relational models and time-series audit events.

- **Caching Layer**:
  - **Decision**: Redis Cluster deployed on AWS ElastiCache for session caches and rate limiting.
  - **Owner**: Sarah Chen
