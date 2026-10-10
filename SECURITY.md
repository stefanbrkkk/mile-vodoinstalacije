# Security notes

Audited on 2026-10-10. No authentication, database, payment processing, or private API is implemented in this repository. Contact links hand off to the visitor's own email, phone or messaging application. No submitted contact data is sent to an application server.

The lockfile pins patched source-map-js 1.2.2. npm audit reports no known vulnerabilities after this patch.

The documented Vercel static deployment reads vercel.json security headers. Local vite preview does not apply Vercel header rules. The CSP restricts framing, plugins and base URLs without changing script/style/font loading.

Environment files are ignored by Git. Browser-exposed NEXT_PUBLIC_ and VITE_ variables must contain only public configuration. Ignore rules do not remove any previously committed files; the working tree and full fetched history were scanned separately.
