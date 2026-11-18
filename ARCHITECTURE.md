•	Solution architecture: module boundaries, folder structure, and key trade-offs (for example ORM or query builder, queue technology, and whether the worker is a separate service).
•	Scalability: how the system handles 10 times and 100 times current load, including connection pooling, read replicas, caching, worker scaling, and very large files; the first bottleneck you expect and how you would detect it.
•	Security: a short threat assessment against the most relevant OWASP API Security Top 10 risks, file-upload risks, secrets management in production, and dependency vulnerability scanning.
•	Best practices: linting and formatting (for example ESLint and Prettier), a CI pipeline that lints and tests every change, zero-downtime database migrations, and a rollback approach.
•	Observability: key metrics and alerts, and how logs and correlation IDs trace an import from upload to completion.
