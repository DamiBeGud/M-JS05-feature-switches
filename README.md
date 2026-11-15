# feature-switches

TypeScript-compiled Express with ordinary JavaScript domain modules application. Native setup `npm ci`; tests `npm test`.
Build `npm run build`; Start `npm start`; PORT defaults to3205, all-interface listener.
Liveness `/health/live`; declared health/readiness `/health/live`.
POST /flags/:name {enabled:Boolean}; PATCH /flags/:name {enabled,expectedVersion}; GET /flags/:name is public. Mutations need Bearer API_TOKEN; stale versions409.

Data is in memory or immutable source and does not survive process replacement.
Requires API_TOKEN from an approved private reference. Send Authorization: Bearer … for protected business routes.
Tests use in-process domain fixtures and ephemeral loopback HTTP. 
AI-assisted researcher-authored application; shared scaffolding is disclosed outside this app. No deployment configuration is supplied.
