Data Flow

TanStack Query
↓
Normalized Entity Store
↓
Projection Selectors
↓
Granular Row Subscriptions

Synchronization Flow

Mutation
↓
Optimistic Patch
↓
Metadata Transition
↓
Broadcast
↓
Queue (offline)
↓
Server Response
↓
Reconciliation
