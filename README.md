# 🚀 Sortify

A modern full-stack URL shortening platform built with Next.js, Prisma, PostgreSQL, Redis, and Auth.js.

Sortify allows users to create, manage, track, and secure short links while also providing a developer-friendly REST API with API key authentication.

## 🌐 Live Demo

**Website:** https://sortify-drab.vercel.app/

---

# ✨ Features

### 🔗 URL Shortening

* Create short URLs instantly
* Generate random slugs automatically
* Create custom slugs
* Copy links with one click

### 🔒 Secure Links

* Password-protected links
* Expiry date support
* Protected access verification

### 📊 Analytics

Track link performance with:

* Total clicks
* Browser analytics
* Device analytics
* Country tracking
* Link-level insights

### 📱 QR Codes

Generate QR codes for every short URL and share links quickly across devices.

### ⚡ Performance

* Redis caching using Upstash
* Faster link resolution
* Reduced database queries

### 🛡️ Security & Protection

* Google OAuth Authentication
* Dashboard rate limiting
* API rate limiting
* Secure API key hashing using bcrypt

### 👨‍💻 Developer Platform

Generate API keys and access Sortify programmatically.

Available API endpoints:

* Create links
* Get all links
* View analytics
* Delete links

### 🔍 Productivity Features

* Search links
* Pagination
* Dashboard management
* Profile page
* API documentation

---

# 🏗️ Tech Stack

## Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* Lucide Icons

## Backend

* Next.js Route Handlers
* Prisma ORM

## Database

* PostgreSQL (Neon)

## Authentication

* Auth.js (NextAuth)
* Google OAuth

## Caching

* Upstash Redis

## Rate Limiting

* Upstash Ratelimit

## Validation

* Zod

## API Security

* bcryptjs

---

# 📚 REST API

## Authentication

Send API key in request headers:

```http
x-api-key: sk_sortify_xxxxxxxxxxxxxxxxx
```

---

## Create Link

```http
POST /api/v1/links
```

Request:

```json
{
  "url": "https://google.com",
  "slug": "google"
}
```

Response:

```json
{
  "success": true,
  "shortUrl": "https://your-domain.com/google"
}
```

---

## Get Links

```http
GET /api/v1/links
```

---

## Get Analytics

```http
GET /api/v1/analytics/[slug]
```

---

## Delete Link

```http
DELETE /api/v1/links/[slug]
```

---

# 📸 Screenshots

Add screenshots here:

* Landing Page
* Dashboard
* Analytics Page
* API Documentation
* Profile Page
* QR Code Feature

---

# 🚀 Local Setup

Clone the repository:

```bash
git clone https://github.com/your-username/sortify.git
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
DATABASE_URL=
AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

---

# 🧠 What I Learned

While building Sortify, I gained hands-on experience with:

* Full-stack application architecture
* Authentication and authorization
* Database design using Prisma
* Redis caching strategies
* API key authentication
* REST API development
* Rate limiting implementation
* Production deployment workflows
* TypeScript and Next.js App Router

---

# 📈 Future Improvements

* API usage analytics
* Team workspaces
* Custom domains
* Webhooks
* Bulk URL creation
* Advanced analytics dashboard
* Link tags and categories

---

# 👨‍💻 Author

**Thushar Rai**

B.Tech CSE (2028)

Passionate about Full-Stack Development, AI, and building scalable web applications.
