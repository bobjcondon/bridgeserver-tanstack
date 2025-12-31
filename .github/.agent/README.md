# AI Agent Configuration

This directory contains configuration files for AI coding assistants like Claude Code and Cursor.

## Directory Structure

```
.github/.agent/
├── README.md              # This file
├── rules/                 # Conditional rules (triggered by context)
│   ├── database.md       # Drizzle ORM and database patterns
│   ├── nextjs.md         # Next.js App Router best practices
│   ├── client-component.md # React client components
│   ├── tailwind.md       # Tailwind CSS v4 styling
│   ├── forms.md          # Tanstack Form + Valibot patterns
│   ├── server-actions.md # Next.js Server Actions
│   ├── validation.md     # Valibot schema validation
│   └── testing.md        # Bun test runner patterns
└── workflows/             # Common task guides
    ├── development.md    # Development server, testing, linting
    └── commit.md         # Commit message conventions
```

## How It Works

### Entry Point

The root [CLAUDE.md](../../CLAUDE.md) file references [AGENTS.md](../../Agents.md), which provides:
- High-level project overview
- Technology stack
- Project structure
- Key conventions
- Development workflow

### Rules Directory

Files in `rules/` are **conditionally triggered** based on context. Each rule file has YAML frontmatter:

```yaml
---
trigger: model_decision
description: When implementing forms with Tanstack Form
---
```

The AI agent will automatically use these rules when working on related tasks.

### Workflows Directory

Files in `workflows/` provide **actionable guides** for common development tasks:
- Starting the dev server
- Running tests
- Creating commits
- etc.

## File Format

All files use Markdown with optional YAML frontmatter:

```markdown
---
trigger: model_decision
description: Brief description of when to apply this rule
---

# Rule Title

Content here...
```

This format is compatible with:
- ✅ Claude Code (reads markdown, ignores frontmatter)
- ✅ Cursor (supports `.mdc` format with frontmatter)
- ✅ GitHub (renders as normal markdown)

## Best Practices

1. **Keep rules focused** - Each rule file should cover one specific domain
2. **Be concise** - AI agents work best with clear, specific instructions
3. **Include examples** - Show don't tell with code examples
4. **Reference official docs** - Link to authoritative sources
5. **Update regularly** - Keep rules in sync with project evolution

## References

- Root configuration: [AGENTS.md](../../Agents.md)
- Project docs: [docs/](../../docs/)
- Claude Code docs: https://code.claude.com/docs
