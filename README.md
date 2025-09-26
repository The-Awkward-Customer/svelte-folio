# Svelte Portfolio Application


A modern, high-performance portfolio application built with SvelteKit 5, featuring advanced animations, AI-powered chat, and a comprehensive design system.

[![SvelteKit](https://img.shields.io/badge/SvelteKit-5.0-FF3E00?logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)

## 🚀 Features

- **Modern SvelteKit 5** with latest runes system ($state, $derived, $props)
- **Advanced Animation System** powered by GSAP and custom canvas rendering
- **AI-Powered Chat** integration with OpenAI API
- **Comprehensive Design System** with Style Dictionary and theming
- **Type-Safe Database** operations with Drizzle ORM and Supabase
- **Professional Development Setup** with ESLint 9, Prettier, and Playwright
- **Responsive Design** with mobile-first approach
- **Accessibility Features** including reduced motion support

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** (for local database)
- **Supabase CLI** >= 1.0.0 (install with `npm install -g supabase`)

## 🛠 Installation

```bash
# Clone the repository
git clone <repository-url>
cd svelte-folio

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start Supabase local development environment
cd ..
supabase start

# Generate design tokens
cd frontend
npm run build:tokens
```

## 🚦 Getting Started

```bash
# Make sure Supabase is running (from project root)
supabase status

# Start the frontend development server (from frontend/ directory)
cd frontend
npm run dev

# Open browser at http://localhost:5173
```

## 📦 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run preview      # Preview production build
npm run check        # Type check with svelte-check
npm run check:watch  # Type check in watch mode
```

### Build & Deploy
```bash
npm run build        # Production build
npm run format       # Format code with Prettier
npm run lint         # Lint code with ESLint
```

### Quality Checks
```bash
npm run check:console   # Scan app code for raw console.* (excludes server/scripts/logger)
npm run lint:ci         # CI-friendly wrapper (currently runs check:console)
```

### Database & Supabase
```bash
# Supabase local development (from project root)
supabase start       # Start all Supabase services
supabase stop        # Stop all services
supabase status      # Check service status
supabase db reset    # Reset database with fresh migrations

# Database management (from frontend/ directory)
npm run db:push      # Push schema changes
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio

# Edge Functions
supabase functions serve    # Start Edge Functions locally
supabase functions deploy   # Deploy functions to remote
```

### Data Management
```bash
npm run ingest       # Import QA content
npm run build:tokens # Generate design tokens
```

## 🏗 Architecture

### Project Structure
```
frontend/
├── src/
│   ├── lib/
│   │   ├── components/      # UI components
│   │   │   ├── primitives/  # Basic UI elements
│   │   │   ├── actions/     # Interactive components
│   │   │   ├── content/     # Content-specific components
│   │   │   ├── layout/      # Layout components
│   │   │   ├── chat/        # AI chat system
│   │   │   └── Dialog/      # Modal dialogs
│   │   ├── animations/      # GSAP animation system
│   │   ├── stores/          # Svelte 5 runes-based stores
│   │   ├── server/          # Server-side utilities
│   │   ├── types/           # TypeScript definitions
│   │   └── utils/           # Utility functions
│   ├── routes/              # SvelteKit routes
│   └── modelData/           # Static content data
├── static/                  # Static assets
└── docs/                    # Documentation
```

### Key Technologies

- **Frontend Framework:** SvelteKit 5 with TypeScript
- **Animation:** GSAP 3.13 with custom canvas engine
- **Database:** PostgreSQL with Drizzle ORM
- **Backend Services:** Supabase
- **AI Integration:** OpenAI API
- **Styling:** CSS with Style Dictionary design tokens
- **Testing:** Vitest (unit) + Playwright (e2e)
- **Deployment:** Vercel

## 🎨 Design System

The application includes a comprehensive design system with:

- **Design Tokens:** Managed with Style Dictionary
- **Theme System:** Support for light/dark modes with system preference detection
- **Component Library:** Modular, reusable components
- **Typography:** Geist font family with multiple weights
- **Icons:** Custom SVG icon system
- **Animations:** Performance-optimized with reduced motion support

## 🔧 Configuration

### Environment Variables
Create `.env.local` with the following:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### Database Setup

#### Local Development with Supabase
```bash
# From project root - Start Supabase stack
supabase start

# This will start:
# - PostgreSQL database (port 54322)
# - Supabase Studio (port 54323)
# - Supabase API (port 54321)
# - Edge Runtime (port 54321)
# - Storage API
# - Auth service
# - Realtime service

# From frontend/ directory - Apply migrations
npm run db:migrate

# Optional: Open Drizzle Studio
npm run db:studio

# Optional: View Supabase Studio
# Open http://127.0.0.1:54323 in browser
```

#### Keep-Alive Function
The project includes a keep-alive Edge Function to prevent database hibernation:

```bash
# Test the function locally
curl -X POST http://127.0.0.1:54321/functions/v1/keep-alive \
  -H "Authorization: Bearer <anon_key>" \
  -H "Content-Type: application/json"

# The function runs automatically in production to maintain database activity
```

## 🧪 Testing

### Unit Tests
```bash
# Run unit tests
npm run test:unit

# Run in watch mode
npm run test:unit -- --watch
```

### E2E Tests
```bash
# Install Playwright browsers
npx playwright install

# Run e2e tests
npm run test:e2e

# Run with UI mode
npm run test:e2e -- --ui
```

## 📱 Browser Support

- **Chrome:** 90+
- **Firefox:** 88+
- **Safari:** 14+
- **Edge:** 90+

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

The application is configured with `@sveltejs/adapter-vercel` for optimal Vercel deployment.

### Manual Build
```bash
npm run build
# Deploy the `build` folder to your hosting provider
```

## 🔍 Development Guidelines

### Code Style
- **ESLint:** Configured with latest flat config system
- **Prettier:** Automatic code formatting
- **TypeScript:** Strict mode enabled

### Component Development
- Use Svelte 5 runes (`$state`, `$derived`, `$props`)
- Follow the established component structure
- Include proper TypeScript types
- Add accessibility attributes

### Animation Best Practices
- Use the custom animation engine for complex animations
- Respect user's reduced motion preferences
- Optimize for 60fps performance
- Clean up animation resources properly

## 🐛 Troubleshooting

### Common Issues

**Development server not starting:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Database connection issues:**
```bash
# Restart Docker containers
docker compose down
docker compose up -d
```

**Build failures:**
```bash
# Check TypeScript errors
npm run check

# Lint and format code
npm run lint
npm run format
```

### Debug Mode
Enable debug logging:
```javascript
// In browser console
localStorage.setItem('animation-debug', 'true');
localStorage.setItem('chat-debug', 'true');
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'feat: add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Submit a pull request

### Commit Convention
Use conventional commits:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks


## 🙏 Acknowledgments

- **Svelte Team** for the amazing framework
- **Vercel** for hosting and deployment platform
- **GSAP** for professional animation capabilities
- **Supabase** for backend services
- **OpenAI** for AI integration capabilities

---

Built with ❤️ using SvelteKit 5 and modern web technologies.

## Git Workflow


[![SvelteKit](https://img.shields.io/badge/SvelteKit-5.0-FF3E00?logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)





