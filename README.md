# AI Project

First quick "code vibing" but going towards "specification driven" backend app in TypeScript and Express that exposes REST API endpoints. Done under a quick workshop with Magnus Ferm.

- Tested with a `cloudflared` tunnel to check endpoints from `https://sundsgarden-rules.lovable.app/`

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

## Available scripts

- `npm.cmd run build`: compile TypeScript to `dist/`
- `npm.cmd start`: run the compiled server
- `npm.cmd run dev`: run the server in watch mode
- `npm.cmd test`: run the API test suite

## API endpoints

- `GET /`
- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`
