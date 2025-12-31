---
trigger: model_decision
description: When implementing client components 
---

# Client Components

## Code Style

**Framework:**: [Tanstack Start](https://tanstack.com/start/latest/docs/framework/react/quick-start)
**Styling**:  @tailwind.md
**Coding**
*     **Client components** should be marked with "use client".
*     ** Client Forms** Implement with Tanstack Form, Shadcn Fields,  and valimod schema validation.
*     - See [Tanstack Shadcn](https://ui.shadcn.com/docs/forms/tanstack-form)
*     - See [Tanstack valimod] (https://tanstack.com/form/v1/docs/framework/react/guides/validation#validation-through-schema-libraries)
* **Linting:** Adhere to the standard project ESLint rules.
* **Comments:** Use clear, concise comments, especially for complex logic.

## Project Structure

* **Component Location:**  Store common UI components in the `./src/components` directory. Store components used in only one App route at the top of the directory for that route. 
*
*
* **Asset Management:** Use the `./public/assets` folder for all static images and files.
