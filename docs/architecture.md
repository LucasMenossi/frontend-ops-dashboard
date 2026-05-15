# Architecture

This project models frontend synchronization as an operational system rather than a simple CRUD interface.

The architecture separates:

- server synchronization
- normalized client ownership
- synchronization metadata
- projection derivation
- rendering subscriptions
- replay orchestration
- reconciliation logic

---

# Data Flow

```txt
Server API
    ↓
TanStack Query
    ↓
Normalized Entity Store (Zustand)
    ↓
Projection Selectors
    ↓
Granular Row Subscriptions
    ↓
Operational Dashboard UI
```

## Flow Explanation

### TanStack Query

TanStack Query owns:

- remote fetching
- cache invalidation
- background synchronization
- async request lifecycle

It does not directly own operational rendering state.

---

### Normalized Entity Store

The Zustand entity store owns:

- normalized transaction entities
- synchronization metadata
- optimistic state
- replay ownership
- deterministic reconciliation

This separation enables granular subscriptions and predictable synchronization behavior.

---

### Projection Selectors

Projection selectors derive render-oriented views from normalized entities.

Examples:

- filtered transaction views
- activity timelines
- optimistic state indicators
- synchronization diagnostics

This keeps rendering concerns separate from entity ownership.

---

### Granular Row Subscriptions

Rows subscribe directly to transaction IDs instead of entire collections.

Result:

```txt
Single-row updates
without full-table rerenders
```

This improves rendering precision during optimistic updates and replay transitions.

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
Replay Execution
      ↓
Server Response
      ↓
Reconciliation
      ↓
Final Synced State
```

---

# Synchronization Stages

## Optimistic Patch

Mutations apply immediately to the UI before server confirmation.

Entities receive synchronization metadata updates including:

- optimistic versions
- pending mutation IDs
- dirty state markers

---

## Broadcast Synchronization

Tabs communicate through the BroadcastChannel API to coordinate synchronization ownership.

This prevents duplicated replay execution across tabs.

---

## Offline Queue

Offline mutations are persisted locally and replayed once connectivity returns.

The replay system tracks:

- replay ownership
- replay source tab
- mutation lineage
- replay timestamps

---

## Reconciliation

The reconciliation layer resolves:

- stale optimistic overwrites
- replay finalization
- optimistic version conflicts
- synchronization consistency

Synchronization metadata remains intentionally separated from domain state.

---

# Architectural Goals

This project prioritizes:

- deterministic synchronization
- rendering isolation
- operational visibility
- frontend systems architecture
- predictable reconciliation
- domain-oriented ownership
