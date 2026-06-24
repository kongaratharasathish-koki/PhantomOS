# Contributing to PhantomOS

Thank you for your interest in improving PhantomOS! As a security-critical project, we maintain high standards for code quality, safety, and testing.

## 🛠️ Development Setup

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Start the development server**: `npm run dev`
4. **Run tests**: `npm run test`

## 🧪 Testing Requirements

Every new feature or bug fix must include:
- **Unit Tests**: For logic and utility functions.
- **Security Tests**: To ensure no RBAC or tenant isolation regressions.
- **Integration Tests**: Verification against the Phantom SDK.

## 🛡️ Security Guidelines

*   **Never commit secrets**: Use `.env` for local development.
*   **Audit logic**: Any changes to `server/interceptor.ts` or `server/security.ts` require a deep security review.
*   **Immutable chains**: Ensure that any changes to the audit flow do not break the SHA-256 evidence chain integrity.

## 📝 Pull Request Process

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the linter passes: `npm run lint`.
5. Submit your PR and wait for review from the core security team.

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.
