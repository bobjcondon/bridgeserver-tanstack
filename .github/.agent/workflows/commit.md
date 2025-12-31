---
description: Create well-formatted commits with conventional commit messages
---

# Commit Workflow

Create well-formatted commits following the Conventional Commits specification.

## Pre-Commit Checklist

Before committing, ensure:

1. ✅ **Tests pass**: `bun test`
2. ✅ **Linting passes**: `bun run lint`
3. ✅ **Code is formatted**: Check Prettier/ESLint formatting
4. ✅ **No console.logs**: Remove debugging statements
5. ✅ **Changes are staged**: `git status` shows intended files

## Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- **feat**: New feature for the user
- **fix**: Bug fix for the user
- **docs**: Documentation changes
- **style**: Code formatting, missing semicolons (not CSS)
- **refactor**: Code restructuring without changing functionality
- **perf**: Performance improvements
- **test**: Adding or correcting tests
- **chore**: Tooling, configuration, dependencies, maintenance
- **ci**: CI/CD configuration changes
- **build**: Build system or external dependencies

### Scope (Optional)

The scope specifies what part of the codebase is affected:

- `auth`: Authentication-related changes
- `db`: Database changes
- `ui`: UI component changes
- `api`: API endpoint changes
- `forms`: Form-related changes

Examples:
- `feat(auth): add login with Google`
- `fix(db): correct user schema migration`
- `refactor(ui): simplify button component`

### Description

- Use imperative mood: "add feature" not "added feature"
- No period at the end
- Keep under 72 characters
- Be specific and descriptive

Good examples:
- `feat: add user registration form`
- `fix: resolve null pointer in tournament list`
- `refactor: extract validation logic to separate module`

Bad examples:
- `fix: bug` (too vague)
- `feat: Added new feature.` (wrong tense, has period)
- `update code` (missing type)

### Body (Optional)

Explain **why** the change was made, not what was changed (the diff shows that).

```
feat(tournaments): add filtering by date range

Users requested the ability to filter tournaments by custom date ranges
rather than just preset options. This improves UX for finding specific
historical tournaments.
```

### Footer (Optional)

Reference issues and breaking changes:

```
fix(api): correct tournament endpoint response format

BREAKING CHANGE: Tournament API now returns ISO date strings instead of Unix timestamps

Closes #123
```

## Common Patterns

### Single Feature

```
feat(registration): add tournament registration form
```

### Bug Fix with Issue Reference

```
fix(auth): prevent duplicate user creation

Closes #456
```

### Multiple Related Changes

If changes span multiple concerns, **split into separate commits**:

```bash
git add src/models/user.ts
git commit -m "feat(db): add user role field to schema"

git add src/components/UserBadge.tsx
git commit -m "feat(ui): add role badge to user profile"
```

### Breaking Change

```
feat(api): update tournament response format

BREAKING CHANGE: Tournament dates now returned as ISO strings

Previously dates were Unix timestamps. All API consumers must update
their date parsing logic.

Closes #789
```

## Pre-Commit Hook

The project uses Husky + Commitlint to enforce:

1. **Commit message format**: Must follow conventional commits
2. **Tests pass**: `bun test` must succeed
3. **Linting**: No ESLint errors

If commit fails:
- Check test output: `bun test`
- Check linting: `bun run lint`
- Fix issues and try again

## Skip Hooks (Use Sparingly)

Only skip pre-commit hooks when absolutely necessary:

```bash
git commit --no-verify -m "wip: temporary checkpoint"
```

**Warning**: Skipping hooks means untested code may enter the repository.

## Amending Commits

To fix the last commit message:

```bash
git commit --amend
```

To add forgotten files to the last commit:

```bash
git add forgotten-file.ts
git commit --amend --no-edit
```

## Best Practices

1. ✅ **Atomic commits**: One logical change per commit
2. ✅ **Descriptive messages**: Future you will thank you
3. ✅ **Test before committing**: Ensure tests pass
4. ✅ **Stage intentionally**: Review `git diff --staged` before committing
5. ✅ **Reference issues**: Link commits to GitHub issues
6. ✅ **Use present tense**: "add" not "added"
7. ✅ **Keep commits small**: Easier to review and revert if needed

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitlint](https://commitlint.js.org/)
