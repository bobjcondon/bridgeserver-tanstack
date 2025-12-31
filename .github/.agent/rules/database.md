---
trigger: model_decision
description: When interacting with database
---

# Database

- **ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **Production**: Postgres
- **Development**: [Pglite](https://pglite.dev) (Embedded Postgres)
- Use `drizzle-kit push` to apply schema changes in development.
- Use `bun run seed` to populate the database with test data.
- Prefer snake_case rules for SQL column names.
- database schema in ./src/models/schema.ts