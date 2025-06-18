#READ ME ❤️


# Git Workflow Framework

## Branch Naming Convention

**Format**: `type/description-in-kebab-case`

### Branch Types

* **feature/**: New features or enhancements
  - `feature/user-authentication`
  - `feature/payment-integration`
  - `feature/dashboard-analytics`

* **fix/**: Bug fixes and patches
  - `fix/login-redirect-issue`
  - `fix/memory-leak-dashboard`
  - `fix/validation-error-handling`

* **hotfix/**: Critical production fixes
  - `hotfix/security-vulnerability`
  - `hotfix/payment-processing-down`
  - `hotfix/data-corruption-patch`

* **docs/**: Documentation updates
  - `docs/api-endpoints`
  - `docs/installation-guide`
  - `docs/contributing-guidelines`

* **refactor/**: Code restructuring without functional changes
  - `refactor/user-service-cleanup`
  - `refactor/extract-utility-functions`
  - `refactor/database-layer-optimization`

* **test/**: Adding or updating tests
  - `test/user-service-unit-tests`
  - `test/integration-test-suite`
  - `test/e2e-checkout-flow`

* **chore/**: Maintenance, dependencies, tooling
  - `chore/update-dependencies`
  - `chore/configure-eslint`
  - `chore/setup-ci-pipeline`

* **style/**: Code formatting and style changes
  - `style/fix-linting-errors`
  - `style/consistent-indentation`
  - `style/update-code-formatting`

* **release/**: Preparing releases
  - `release/v2.1.0`
  - `release/january-2025`
  - `release/hotfix-v1.2.1`

### Branch Naming Rules

1. Use lowercase letters only
2. Separate words with hyphens (kebab-case)
3. Keep descriptions concise but descriptive
4. No spaces or special characters except hyphens
5. Delete branches after merging to keep repository clean

## Commit Message Convention

### Commit Types

* **feat**: New feature
* **fix**: Bug fix
* **docs**: Documentation changes
* **style**: Formatting, missing semicolons (no code change)
* **refactor**: Code change that neither fixes bug nor adds feature
* **test**: Adding or updating tests
* **chore**: Maintenance tasks, dependencies, build process

### Commit Message Rules

1. **Keep the first line under 50 characters**
2. **Use imperative mood** ("add" not "added" or "adds")
3. **Don't end with a period**
4. **Capitalize the first letter of description**

### Examples

```
feat: Add user authentication middleware
fix: Handle null values in payment processing
docs: Update API documentation for v2 endpoints
test: Add unit tests for user service
refactor: Extract common validation logic
chore: Update dependencies to latest versions
```

## Example Workflow

```
Branch: feature/user-authentication
├── feat: Add user model and schema
├── feat: Implement password hashing
├── test: Add authentication middleware tests
├── docs: Update authentication API documentation
└── fix: Handle edge case in token validation
```

The branch name provides context for the overall work, while individual commits describe specific changes within that work.
