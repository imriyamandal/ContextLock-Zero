# System Architecture Specification v2.4

## Component Breakdown

### 1. API Gateway
- **Owner**: David Park (DevOps)
- **Role**: Ingress routing, rate limiting, and auth header validation.
- **Dependencies**: Relies on downstream Identity Provider configuration (JWT / OAuth / Firebase).

### 2. Mobile Client (iOS / Android)
- **Owner**: Lisa Wong (Mobile Lead)
- **Role**: Offline client application providing local SQLite persistence and biometric login.
- **Dependencies**: Directly impacted by authentication tokens and offline verification capabilities.

### 3. Database Layer
- **Owner**: Sarah Chen (Backend Lead)
- **Engine**: PostgreSQL 16 on AWS RDS Multi-AZ.

### 4. Cache & Queue Subsystem
- **Owner**: Sarah Chen (Backend Lead)
- **Engine**: Redis Cluster 7.2.

### 5. Notification Architecture
- **Owner**: [UNASSIGNED]
- **Status**: Draft / Unowned
- **Description**: Pub/Sub event router for multi-channel email, Slack, and APNS push alerts. Needs team ownership and SLA definition before production rollout.
