---
trigger: model_decision
description: When implementing user authentication
---

# Authentication

- Clerk  @https://clerk.com/llms.txt for user authentication.
- Make sure src/proxy.ts exists similar to [clerkMiddleware](https://clerk.com/docs/nextjs/getting-started/quickstart#add-clerk-middleware-to-your-app)
- See [TanstackStart-clerk](https://tanstack.com/start/latest/docs/framework/react/examples/start-clerk-basic)
- See [Signin/Signup](https://clerk.com/docs/guides/development/customize-redirect-urls)
- Use Clerk Environment variables to control navigation after signin/signup.
  - modify .env file to reflect usage.
- On successful signup/signin if user DOES NOT EXIST with the same email, 
  - add the user (including the email and Clerk userid).
  - navigate to the /User/[id] route using the Clerk. userid.
- On successful signin if a user DOES EXIST with the same email and Clerk userid, navigate to the previous page.
