•	Solution architecture: module boundaries: Each reources has it one route , folder structure: client and server is separated , and key trade-offs: I make use of ORM for optimised query, 
•	Scalability: how the system handles 10 times and 100 times current load, including connection pooling, read replicas, caching, worker scaling, and very large files; the first bottleneck you expect and how you would detect it.
•	Security: a short threat assessment against the most relevant OWASP API Security Top 10 risks, file-upload risks, secrets management in production, and dependency vulnerability scanning.
•	Best practices: linting and formatting (for example ESLint and Prettier), a CI pipeline that lints and tests every change, zero-downtime database migrations, and a rollback approach.
•	Observability: I added a logger to the server to show the Method and the path
