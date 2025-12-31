---
trigger: model_decision
description: When implementing client components for DB tables
---

# Database (DB) components

See @client-component.md
For each Table T in the DB build 3 routes with components (covering the 4 CRUD operations).
These components display the "DATA" fields of the schema (name, email, phone ...) not the "FUNCTIONAL" fields (id, date_added, keys for other fields).

- For each database type T create these routes
src/
├── routes <-- This is where you define routes
│   ├── __root.tsx <-- The application shell
│   ├── index.tsx <-- Home page
│   ├── <T>/
│   │   ├── index.tsx <-- Table of <T> (Infinite scrolling Tanstack Table)
│   │   ├── create.tsx <-- (The CREATE route)
│   │   └── $id.tsx <-- (The UPDATE, DELETE routes)

- route src/routes/<T>/create.tsx   (The CREATE route)
  - Displays all DATA fields 
  - The submit button is labeled "Add".  
  - On successful submission go to most recently visited page.
- route src/routes/<T>/$id   (the UPDATE/DELETE route)
  - Populate with current DB values corresponing to entry $id.
  - Allow the user to update fields
  - Add a DELETE button to trigger a database DELETE action.
    - If any fields have been changed, the DELETE button should warn about changes and ask the user to confirm.
    - On successful DELETE go to the most recently visited page.
  - Add a SAVE  button to trigger a database UPDATE action.
    - The SAVE button is inactive if no fields have been modified.
    - If any fields have been changed, the SAVE button becomes activated.
- route src/routes/<T>/index.tsx   (the READ route) see @CRUD-components-table.md
 
  - 


