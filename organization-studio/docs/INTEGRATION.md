# Integration Plan: Organization Studio + NEXUS

## Recommended deployment model

### Phase 1 - Development
Run the Studio through Vite and proxy `/api` and `/health` to the current NEXUS Cloud Run or local FastAPI service.

### Phase 2 - Single domain
Place both services behind one domain:

```text
/                     Organization Studio
/api/missions         NEXUS mission API
/api/agents           NEXUS agent registry
/health               NEXUS health
```

This is the recommended production pattern because it keeps the browser integration simple and avoids cross-origin configuration.

### Phase 3 - Persistent enterprise runtime
Enable:

- Firestore for durable mission and organization state
- Pub/Sub for asynchronous execution
- Identity Platform or enterprise SSO
- Cloud Storage or a document-system adapter for controlled documents
- calendar and email adapters for executive coordination
- BigQuery for analytics and enterprise reporting
- Vertex AI for NEXUS agent reasoning

## Operating model

NEXUS should not replace normal organizational systems. It should become the execution and intelligence layer above them.

```text
ERP / Finance       CRM / Donor Management       HR / People
       \                    |                     /
        \                   |                    /
         +---------- Integration Layer ---------+
                         |
                 Organization Studio
                         |
                  NEXUS Orchestrator
                         |
      +----------+-------+-------+----------+
      |          |               |          |
  Strategy     Data            Risk     Executive
     Agent     Agent           Agent       Agent
                         |
                 Communication Agent
```

## Organization types

Commercial organizations can emphasize revenue, margin, customer pipeline, operating productivity, and capital allocation.

Nonprofit organizations can emphasize beneficiary outcomes, program delivery, grant restrictions, donor commitments, volunteer capacity, and impact measurement.

The shell remains the same; only configuration and KPIs change.
