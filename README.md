<div align="center">
    <img alt="Logo" src="public/logo.png" width="100" />
</div>
<h1 align="center">
    personal website
</h1>
<p align="center">
    Built with <a href="https://nextjs.org/">Next.js</a> (App Router), <a href="https://tailwindcss.com/">Tailwind CSS</a>, <a href="https://www.prisma.io/">Prisma</a>, PostgreSQL, Docker, and Nginx CDN.
</p>
<p align="center">
    Features a custom admin dashboard, markdown blog system, CDN-backed image and resume uploads, with deployment workflows.
</p>

## getting started

Configure environment variables first in both `server/api/linkedin` and `/` directories. Refer to the `.env.example` files.

First, run the development server:

```bash
npm run dev && docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## deployment

This site is deployed with the help of <a href="https://vercel.com/">Vercel</a>, <a href="https://www.cloudflare.com/">Cloudflare</a>, and the power of my own self-hosted VPS.

- To take backups of the database, run the `/scripts/backup.sh`
- To take backups of the CDN, run `/server/cdn/manage.sh backup /backups/<backup-name>.tar.gz`
