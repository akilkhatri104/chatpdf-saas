# chatpdf-saas

Lightweight SaaS for conversational PDF search and QA built with Next.js and modern vector/LLM tooling.

Live demo: https://chatpdf-saas-bay.vercel.app
GitHub: https://github.com/akilkhatri104/chatpdf-saas

## Quick overview
This app lets users upload PDF documents, creates vector embeddings, and provides a chat-style interface to ask questions over documents. It includes user auth, storage, optional payments, and uses common vector DB and LLM tooling.

## Features
- Upload and parse PDFs (pdf-parse)
- Chunking and text-splitting for embeddings
- Vector storage and retrieval (Pinecone / other)
- Conversational QA over documents (LLM + retrieval)
- User authentication (Clerk)
- File storage (S3-compatible) and optional Neon DB for metadata
- Payment integration (Razorpay) — optional
- Admin/usage dashboard hooks
- Drizzle ORM for DB schema management
- Streaming responses and a modern React UI

## Tech stack
- Next.js (app router)
- React 19 + TypeScript
- TailwindCSS
- LangChain / @langchain packages
- Pinecone (vector DB) or alternative
- AWS S3 (or S3-compatible) for file storage
- NeonDB + Drizzle ORM for relational metadata
- Clerk for authentication
- Razorpay for payments (optional)
- PDF parsing with pdf-parse
- Other libs: axios, md5, nanoid, react-dropzone

## Requirements
- Node.js 18+ (or matching your environment)
- npm / pnpm / yarn
- Access keys for any external services you plan to use (Pinecone, S3, Clerk, Razorpay, OpenAI/Google GenAI)

## Installation (local)
1. Clone the repo:
   git clone https://github.com/akilkhatri104/chatpdf-saas.git
   cd chatpdf-saas

2. Install dependencies:
   npm install
   # or
   pnpm install
   # or
   yarn

3. Create a .env.local in the project root and add required variables (example below).

4. If using Drizzle migrations / schema push:
   npm run db:push

5. Run development server:
   npm run dev
   Visit http://localhost:3000

Note: The dev script sets NODE_OPTIONS on Windows. On other platforms you may want to run:
NODE_OPTIONS="--max-old-space-size=8192" next dev

## Example .env.local (replace values)

```bash
# Clerk configuration for Next.js application
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=

# NeonDB
DATABASE_URL=

# AWS S3
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=
NEXT_PUBLIC_AWS_BUCKET_NAME=
NEXT_PUBLIC_AWS_REGION=

# PineconeDB
PINECONE_ENVIRONMENT=
PINECONE_API_KEY=
PINECONE_INDEX=

# GEMINI
GOOGLE_GENERATIVE_AI_API_KEY=
GOOGLE_GENERATIVE_AI_EMBEDDING_MODEL=
GOOGLE_GENERATIVE_AI_LLM_MODEL=

# RazorPay
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_PRO_PLAN_ID=
RAZORPAY_WEBHOOK_SECRET=
GRACE_PERIOD_DAYS=

# Base URL
NEXT_PUBLIC_BASE_URL=
```

## Running in production
1. Build:
   npm run build

2. Start:
   npm start

Deploy to platforms like Vercel, DigitalOcean App Platform, or your own server. Example live deployment: https://chatpdf-saas-yji4j.ondigitalocean.app/

## Database & migrations
This project uses Drizzle ORM. To push schema:
npm run db:push

## Usage (typical flow)
1. Sign in (Clerk).
2. Upload one or more PDF files.
3. The app parses, chunks, and stores embeddings in your vector DB.
4. Ask questions in the chat — the app retrieves relevant chunks and queries the LLM.

