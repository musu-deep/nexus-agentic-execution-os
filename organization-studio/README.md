# NEXUS Organization Studio

**NEXUS Organization Studio** is an English-only, organization-neutral operating interface designed to sit beside the NEXUS Agentic Execution OS.

It is a generalized successor to a CEO-office application pattern, rebuilt so it can serve commercial companies, nonprofit organizations, foundations, associations, social enterprises, multi-entity groups, program offices, and executive offices.

No organization-specific identity, legacy brand names, Arabic labels, country-specific business units, or legacy logos are embedded in this version.

## What is included

- Organization Command Center
- NEXUS Missions
- Projects and Portfolios
- Tasks and Commitments
- Decision Center
- Calendar and Meetings
- Document Center
- Governance and Compliance
- Legal and Obligations
- Reports and Insights
- Stakeholder Management
- Organization Settings
- Commercial / Nonprofit organization mode
- Responsive light and dark UI
- Direct integration with the existing NEXUS mission API

## NEXUS integration

The studio talks to these NEXUS endpoints:

```text
GET  /health
GET  /api/missions
POST /api/missions
GET  /api/missions/{mission_id}
```

Set the API base URL when NEXUS and the Studio are on different origins:

```env
VITE_NEXUS_API_URL=https://YOUR-NEXUS-SERVICE.run.app
```

When both are served behind the same domain, leave the value empty.

## Run locally

```bash
npm install
npm run dev
```

By default Vite proxies `/api` and `/health` to `http://127.0.0.1:8000`.

To point the development proxy elsewhere:

```bash
NEXUS_PROXY_TARGET=https://YOUR-NEXUS-SERVICE.run.app npm run dev
```

## Architecture

```text
                         NEXUS ORGANIZATION STUDIO
                                      |
      +-------------------------------+-------------------------------+
      |                               |                               |
 Organization Operations       Governance Layer                Intelligence Layer
      |                               |                               |
 Projects / Tasks             Governance / Legal           Reports / Stakeholders
 Decisions / Meetings          Documents / Controls         Executive Command Center
      |                               |                               |
      +-------------------------------+-------------------------------+
                                      |
                               NEXUS Missions
                                      |
                        NEXUS Agentic Execution API
                                      |
                Strategy / Data / Risk / Executive / Comms
                                      |
                     Cloud Run / Vertex AI / Firestore / PubSub
```

## Design principle

The studio is intentionally organization-neutral. Organization identity and type are configuration, not hard-coded application logic.
