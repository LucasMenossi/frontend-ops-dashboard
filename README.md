# Frontend Operations Dashboard

A frontend architecture project focused on synchronization systems, optimistic workflows, and operational state management.

Unlike traditional dashboard projects centered around CRUD interfaces, this project explores frontend infrastructure patterns commonly found in production-grade applications:

- optimistic updates
- offline replay systems
- cross-tab synchronization
- normalized entity ownership
- synchronization metadata
- granular rendering isolation
- deterministic reconciliation

The goal of the project is to simulate realistic frontend synchronization behavior rather than UI complexity.

---

# Preview

```txt
Optimistic Updates
Offline Replay
Cross-Tab Sync
Metadata-Aware State
Granular Rendering
Deterministic Reconciliation
```

---

# Tech Stack

- Next.js
- React
- TypeScript
- TanStack Query
- Zustand
- Tailwind CSS v4
- Nuqs
- BroadcastChannel API
- Vitest

---

# Core Concepts

This project explores frontend patterns commonly required in operational and realtime systems:

- optimistic synchronization
- normalized entity management
- metadata-aware reconciliation
- offline mutation replay
- cross-tab coordination
- rendering isolation
- deterministic state transitions
- modular frontend ownership

---

# Architecture Overview

```txt
Server API
    ↓
TanStack Query
    ↓
Normalized Zustand Store
    ↓
Synchronization Metadata
    ↓
Granular Entity Subscriptions
    ↓
Operational Dashboard UI
```

---

# Synchronization Lifecycle

```txt
User Mutation
      ↓
Optimistic Patch
      ↓
Metadata Transition
      ↓
Broadcast Synchronization
      ↓
Offline Queue
      ↓
Replay Execution
      ↓
Server Response
      ↓
Reconciliation
      ↓
Final Synced State
```

---

# Key Features

## Normalized Entity Store

Transactions are stored in a normalized Zustand store instead of nested component state.

Benefits include:

- granular subscriptions
- predictable ownership
- isolated rerenders
- deterministic reconciliation
- synchronization traceability

---

## Optimistic Updates

Transaction mutations are applied immediately before server confirmation.

The synchronization layer tracks:

- optimistic versions
- pending mutations
- synchronization state
- replay ownership
- mutation lineage

This enables deterministic reconciliation once the server responds.

---

## Offline Replay Queue

Offline mutations are persisted locally and replayed automatically when connectivity returns.

Features include:

- persistent mutation queue
- replay coordination
- replay ownership
- conflict-safe synchronization
- deterministic replay ordering

---

## Cross-Tab Synchronization

Tabs communicate using the BroadcastChannel API to coordinate synchronization behavior.

Features include:

- mutation broadcasts
- replay leadership
- shared synchronization state
- duplicate replay prevention

---

## Metadata-Aware Reconciliation

Synchronization metadata is intentionally separated from domain state.

Each entity tracks operational synchronization data independently:

```txt
syncState
isDirty
pendingMutationId
lastMutationId
optimisticVersion
replayedAt
replaySourceTabId
lastSyncedAt
```

This separation simplifies synchronization reasoning and reconciliation behavior.

---

## Granular Rendering Optimization

Rows subscribe directly to transaction entities instead of entire collections.

Result:

```txt
Single-row updates
without full-table rerenders
```

This improves rendering precision during optimistic updates and replay transitions.

---

# Operational Diagnostics

The dashboard exposes synchronization diagnostics for visibility and debugging.

Available diagnostics include:

- optimistic entity count
- replay queue state
- dirty entity count
- synchronization operations
- replay visibility

---

# Testing

The project includes reconciliation-focused unit tests using Vitest.

The tests validate:

- optimistic reconciliation behavior
- synchronization metadata transitions
- replay consistency
- entity state correctness

---

# Project Structure

```txt
src/
├── app/
├── components/
├── lib/
└── modules/
    ├── activity/
    │   ├── components/
    │   ├── hooks/
    │   ├── services/
    │   └── types.ts
    │
    └── transactions/
        ├── components/
        ├── diagnostics/
        ├── hooks/
        ├── mocks/
        ├── persistence/
        ├── projections/
        ├── reconciliation/
        ├── services/
        ├── store/
        ├── sync/
        ├── types/
        └── utils/
```

---

# Architectural Notes

## Domain-Oriented Modules

Frontend systems are organized by domain ownership instead of technical layers.

Each module owns its own:

- state management
- synchronization logic
- reconciliation behavior
- services
- rendering logic
- domain utilities

This improves:

- modularity
- scalability
- synchronization isolation
- maintainability

---

## Store Ownership

TanStack Query owns:

- remote fetching
- async request lifecycle
- cache invalidation

Zustand owns:

- normalized entities
- synchronization metadata
- optimistic state
- replay coordination

This separation enables predictable synchronization behavior and granular rendering control.

---

# Production-Oriented Inspiration

This project intentionally simulates frontend synchronization problems commonly found in:

- operational dashboards
- realtime systems
- collaborative applications
- fintech platforms
- offline-first applications
- distributed frontend systems

---

# Design Philosophy

```txt
State consistency over convenience.
Deterministic synchronization over implicit behavior.
Operational visibility over hidden orchestration.
```

---

# Local Development

## Install dependencies

```bash
npm install
```

## Start development server

```bash
npm run dev
```

## Run tests

```bash
npm run test
```

## Create production build

```bash
npm run build
```

---

# License

MIT
