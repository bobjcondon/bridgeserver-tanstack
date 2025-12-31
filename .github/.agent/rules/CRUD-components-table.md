---
trigger: model_decision
description: When implementing client for the route to show entries from database table <T> (The "READ" route)
---

# Database (DB) Tables

See @client-component.md
- For each Table T in the DB build a route src/routes/<T>/index.tsx to show a table of T
- Table T has "DATA" fields (name, email, phone ...) and "FUNCTIONAL" fields (id, date_added, keys for other fields).
- Include either a simple or complex search entry which allows selection of a subset of the rows in <T>.
  - a "simple" search entry has a single form field which it matches against multiple <T> columns 
    - for example: 'if firstName like SearchField or lastName like SearchField or email like SearchField'.
  - a "complex" search entry has entries for each "DATA" field in T.  
    - for example "InvoiceData > Jan 1, 2025, Balance > $200",
- Rows from <T> matching the search criteria are displayed in an infinitely scrolling table.  
  - See [Tanstack infinite scrolling](https://tanstack.com/table/latest/docs/framework/react/examples/virtualized-infinite-scrolling)
  - The header for every column C will have an Up/Down sort button (to sort the table by column C)
  - The header for Column C will have a hide button (to hide that column in the table)
  - The table scrolls while the search field remains fixed at the top of the page.
  - The scrolling table negotiates with the server to determine when to request more data.
  - if a row is selected, the app routes to the edit route

- The component has a "New" button which routes to the "create" route -- src/routes/<T>/create.tsx
