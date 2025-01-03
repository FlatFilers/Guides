# Flatfile Platform Glossary

## Overview
This glossary provides definitions and context for all key terms used in the Flatfile platform. Terms are organized alphabetically with cross-referenced categories and relationship maps.

## Categories
- Architecture: Core system components
- Data: Data structures and types
- Events: System events and triggers
- Security: Authentication and permissions
- UI: User interface elements
- Workflow: Process and operation concepts

## Terms

### Action
Category: Workflow
Definition: A code-based operation that runs where that Action is mounted, triggered by user input
Technical Context: Configured within Blueprint for Workbook & Sheet-mounted actions, or appended to files during upload for File-mounted actions
Usage Context: Used to trigger operations like data submission, validation, or custom processing
Related Terms: Job, Event, Blueprint
Example:
```typescript
{
  operation: 'submitAction',
  mode: 'foreground',
  label: 'Submit data',
  description: 'Submit this data to API'
}
```

### Administrator
Category: Security
Definition: User role with full access to accounts, including ability to invite additional admins and view developer keys
Technical Context: Highest permission level in the platform
Usage Context: Used for team members who need complete platform access
Related Terms: Guest Role, Permissions, Access Control

### API Key
Category: Security
Definition: Authentication credential used to interact with Flatfile API
Technical Context: Two types: Secret keys (server-side) and Publishable keys (client-side)
Usage Context: Used to authenticate API requests and embedded implementations
Related Terms: Authentication, Environment, Security
Variations:
- Secret Key (sk_*)
- Publishable Key (pk_*)

### Blueprint
Category: Data
Definition: A powerful Data Definition Language (DDL) created by Flatfile focusing on validation and data preparation
Technical Context: Collection of sheets describing a complete dataset
Usage Context: Used to define data structure, validation rules, and behavior
Related Terms: Sheet, Field, Constraints
Components:
- Sheets
- Fields
- Constraints
- Actions

### Commit
Category: Data
Definition: A record of changes made to data within a Sheet
Technical Context: Generated when data is modified, triggers commit:created events
Usage Context: Used to track and process data changes
Related Terms: Record, Sheet, Event

### Environment
Category: Architecture
Definition: Isolated entity for creating and testing different configurations
Technical Context: Contains its own API keys, configurations, and settings
Usage Context: Separates development and production implementations
Related Terms: API Key, Space, Configuration
Types:
- Development (non-production)
- Production

### Event
Category: Events
Definition: System occurrence that can trigger actions or workflows
Technical Context: Part of the event-driven architecture, handled by Listeners
Usage Context: Used to respond to user actions and system changes
Related Terms: Listener, Action, Job
Common Types:
- commit:created
- job:ready
- file:created

### Field
Category: Data
Definition: Describes an attribute of an entity within a Sheet
Technical Context: Basic unit of data structure in Blueprint
Usage Context: Defines how individual data points should be handled
Related Terms: Sheet, Blueprint, Constraints
Types:
- string
- number
- boolean
- date
- enum
- reference

### Guest
Category: Security
Definition: Limited access user role for specific Spaces or Workbooks
Technical Context: Authenticated via magic link or shared link
Usage Context: External users accessing specific data workspaces
Related Terms: Administrator, Space, Workbook
Types:
- Single-Space Guest
- Multi-Space Guest
- Single-Workbook Guest
- Multi-Workbook Guest

### Job
Category: Workflow
Definition: Executable code compiled from an Action
Technical Context: Provides asynchronous or immediate execution capability
Usage Context: Handles long-running operations and background tasks
Related Terms: Action, Event, Listener

### Listener
Category: Events
Definition: Code that responds to Events in the system
Technical Context: Core component for handling Events and orchestrating workflows
Usage Context: Used to implement custom logic and automation
Related Terms: Event, Action, Plugin
Example:
```typescript
listener.on("commit:created", async (event) => {
  // Handle event
});
```

### Plugin
Category: Architecture
Definition: Reusable component that adds functionality to the platform
Technical Context: Modular code that extends core capabilities
Usage Context: Used to add features like file extraction or data transformation
Related Terms: Extractor, Transform, Hook
Types:
- Record Hook
- File Extractor
- Data Transform

### Record
Category: Data
Definition: Single row of data within a Sheet
Technical Context: Basic unit of data manipulation
Usage Context: Represents individual data entries
Related Terms: Sheet, Field, Commit

### Sheet
Category: Data
Definition: Collection of fields describing a single entity type
Technical Context: Component of a Workbook, contains Records
Usage Context: Organizes related data fields and records
Related Terms: Workbook, Field, Record

### Space
Category: Architecture
Definition: Container where workflow unfolds
Technical Context: Top-level organizational unit
Usage Context: Encompasses user invitations, data loading, and egress
Related Terms: Workbook, Environment, Guest

### Workbook
Category: Data
Definition: Database-like structure with type-strict schema
Technical Context: Contains one or more Sheets plus associated actions
Usage Context: Primary interface for data validation and transformation
Related Terms: Sheet, Action, Space

## Relationship Maps

### Architectural Hierarchy
```
Environment
└── Space
    └── Workbook
        └── Sheet
            └── Field
            └── Record
    └── File
```

### Event Flow
```
Action
└── Job
    └── Event
        └── Listener
            └── Response
```

### Security Hierarchy
```
Administrator
└── Environment Management
    └── API Key Management
    └── User Management
        └── Guest Access Control
```

### Data Structure
```
Blueprint
└── Workbook
    └── Sheet
        └── Field
            └── Constraints
            └── Validations
```

## Metadata Index

### By Layer
Frontend:
- Space UI
- Workbook Interface
- Sheet Display
- Action Buttons

Backend:
- Listeners
- Jobs
- Events
- API Endpoints

Data:
- Records
- Fields
- Sheets
- Workbooks

### By Access Level
Public:
- Spaces
- Workbooks
- Sheets
- Actions

Internal:
- Jobs
- Events
- Commits
- Configurations

### By Stability
Stable:
- Core Blueprint
- Basic Events
- Standard Actions
- File Operations

Experimental:
- Advanced Plugins
- Custom Extractors
- Complex Transformations

## Usage Guidelines

### Best Practices
1. Use appropriate terminology consistently
2. Follow security best practices with API keys
3. Structure data logically in Workbooks and Sheets
4. Implement proper error handling in Listeners
5. Design Actions for specific use cases

### Anti-patterns
1. Mixing development and production environments
2. Exposing secret keys in client-side code
3. Overcomplicating Blueprint structures
4. Ignoring event error handling
5. Creating overly complex action chains

## Search Tags
#flatfile #data-import #workflow #automation #blueprint #security #events #actions #workbooks #sheets #space #environment #plugin #listener #record #field #commit #job #guest #administrator #api #transformation #validation #configuration

