# Architecture

This project models frontend synchronization as an operational system rather than a traditional CRUD interface.

The architecture separates:

- server synchronization
- normalized entity ownership
- synchronization metadata
- offline replay behavior
- reconciliation logic
- rendering subscriptions
- synchronization visibility

---

# Data Flow

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

# Architectural Responsibilities

## TanStack Query

TanStack Query owns:

- remote fetching
- background synchronization
- cache invalidation
- async request lifecycle

It does not directly own operational rendering state.

---

## Zustand Entity Store

The Zustand store owns:

- normalized transaction entities
- synchronization metadata
- optimistic state
- replay coordination
- reconciliation ownership

This separation enables predictable synchronization behavior and granular rendering updates.

---

## Synchronization Metadata

Synchronization state is intentionally separated from domain state.

Each entity tracks synchronization data independently:

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

This improves:

- reconciliation clarity
- replay visibility
- synchronization debugging
- optimistic state tracking

---

## Granular Row Subscriptions

Rows subscribe directly to transaction entities instead of entire collections.

Result:

```txt
Single-row updates
without full-table rerenders
```

This improves rendering isolation during:

- optimistic transitions
- replay execution
- synchronization updates
- realtime mutations

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

# Synchronization Stages

## Optimistic Updates

Mutations apply immediately before server confirmation.

Entities receive synchronization metadata updates including:

- optimistic versions
- pending mutations
- dirty state markers

---

## Broadcast Synchronization

Tabs communicate through the BroadcastChannel API to coordinate synchronization behavior.

This prevents duplicated replay execution across tabs.

---

## Offline Replay

Offline mutations are persisted locally and replayed once connectivity returns.

The replay system tracks:

- replay ownership
- replay source tab
- replay timestamps
- mutation lineage

---

## Reconciliation

The reconciliation layer resolves:

- stale optimistic overwrites
- replay finalization
- optimistic version conflicts
- synchronization consistency

Synchronization metadata remains intentionally separated from domain state.

---

# Domain Structure

```txt
modules/
  activity/
  transactions/
```

Each module owns its own:

- hooks
- services
- synchronization logic
- rendering logic
- domain state
- utilities

This structure prioritizes:

- domain isolation
- ownership clarity
- scalability
- maintainability

---

# Architectural Goals

This project prioritizes:

- deterministic synchronization
- rendering isolation
- operational visibility
- predictable reconciliation
- modular frontend ownership
- synchronization traceability
