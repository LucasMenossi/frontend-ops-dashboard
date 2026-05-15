# Frontend Operations Dashboard

A frontend-focused operational dashboard built to simulate realistic distributed frontend engineering problems:

- optimistic updates
- offline replay systems
- reconciliation flows
- multi-tab synchronization
- normalized entity ownership
- granular rendering subscriptions
- metadata-aware synchronization

The goal of this project is not CRUD complexity — it is frontend systems engineering.

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

---

# Project Goals

This project was designed to explore:

- distributed frontend state reasoning
- optimistic reconciliation
- replay orchestration
- synchronization metadata ownership
- rendering precision
- multi-tab coordination
- operational dashboard patterns
- realistic async frontend behavior

---

# Architecture Overview

```txt
TanStack Query
        ↓
Normalized Zustand Entity Store
        ↓
Projection Selectors
        ↓
Granular Row Subscriptions
        ↓
Operational Dashboard UI
```

---

# Synchronization Flow

```txt
User Mutation
      ↓
Optimistic Patch
      ↓
Metadata Transition
      ↓
Broadcast Synchronization
      ↓
Offline Queue (if offline)
      ↓
Replay
      ↓
Reconciliation
      ↓
Final Synced State
```

---

# Key Features

## Normalized Entity Architecture

Transactions are stored in a normalized entity store instead of nested component state.

Benefits:

- granular subscriptions
- predictable ownership
- rendering precision
- easier reconciliation

---

## Optimistic Updates

Transaction updates apply immediately in the UI before the server resolves.

The system tracks:

- optimistic state
- mutation lineage
- synchronization metadata
- replay provenance

---

## Offline Replay Queue

Mutations performed while offline are persisted locally and replayed when connectivity returns.

Features:

- persistent queue
- replay leadership
- replay metadata
- conflict-safe synchronization

---

## Multi-Tab Synchronization

Tabs coordinate through BroadcastChannel to avoid duplicated replay execution.

Features:

- synchronization broadcasts
- replay leadership election
- cross-tab entity updates

---

## Metadata-Aware Reconciliation

Synchronization metadata is intentionally separated from domain state.

Each entity tracks:

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

---

## Rendering Optimization

Rows subscribe directly to transaction IDs instead of entire collections.

Result:

```txt
single-row updates
without full table rerenders
```

---

# Reconciliation Rules

The reconciliation layer handles:

- stale optimistic overwrite protection
- optimistic version tracking
- replay finalization
- conflict detection
- deterministic synchronization resolution

---

# Operational Diagnostics

The dashboard includes internal diagnostics for:

- optimistic state count
- replay state count
- dirty entity count
- synchronization operations
- replay visibility

---

# Why This Project Exists

Most frontend portfolio projects focus on UI complexity.

This project focuses on:

```txt
frontend operational architecture
```

The interesting problems are:

- synchronization ownership
- distributed state reasoning
- async orchestration
- replay coordination
- reconciliation correctness
- rendering isolation

---

# Local Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Run production build:

```bash
npm run build
```

---

# Future Improvements

Potential future explorations:

- websocket ordering guarantees
- reconciliation timelines
- synchronization tracing
- replay batching
- conflict resolution strategies
- distributed debugging tooling
- server-driven invalidation
- event sourcing simulations

---

# Notes

This project intentionally simulates production-oriented frontend synchronization problems that commonly appear in:

- operational dashboards
- f
