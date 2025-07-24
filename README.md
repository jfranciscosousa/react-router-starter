# React Router 7 + Drizzle Starter

A modern, production-ready full-stack web application starter built with **React Router 7**, **Drizzle ORM**, and **PostgreSQL**. Features authentication, internationalization, theming, and comprehensive tooling.

## 🚀 Live Demo

- [Deployed Application](https://react-router-starter.fly.dev/)
- [React Router 7 Documentation](https://reactrouter.com/home)

## ✨ Features

### Core Functionality
- **🔐 Authentication** - Cookie-based auth with secure sessions
- **📝 Notes App** - Full CRUD operations with user-specific data
- **👤 User Profiles** - User registration, login, and profile management
- **🌍 Internationalization** - Automatic locale detection from Accept-Language headers
- **🎨 Theming** - Light/dark/system theme support with persistent preferences

### Technical Stack
- **⚡ React Router 7** - Latest routing and SSR capabilities
- **🗄️ Drizzle ORM + PostgreSQL** - Type-safe database ORM with SQL-like queries
- **🎨 Tailwind CSS + shadcn/ui** - Modern styling with beautiful components
- **🔒 Security** - Argon2 password hashing, secure cookies, CSRF protection
- **📱 Responsive Design** - Mobile-first approach with modern UI patterns

### Developer Experience
- **📦 PNPM** - Fast, disk space efficient package manager
- **🧪 Testing** - Playwright E2E + Vitest unit testing
- **🔍 Type Safety** - Full TypeScript coverage with strict mode
- **🚨 Code Quality** - ESLint, Prettier, Husky pre-commit hooks
- **🔧 Tooling** - Comprehensive bin scripts for development workflow

## 🏗️ Architecture

### Project Structure
```
├── app/                    # Application source code
│   ├── components/         # Reusable UI components
│   │   ├── layouts/        # Layout components
│   │   └── ui/             # shadcn/ui components (React 19 compatible)
│   ├── data/               # Data access layer
│   │   ├── schema.ts       # Drizzle database schema
│   │   ├── users.server.ts # User operations
│   │   ├── notes.server.ts # Notes operations
│   │   └── utils/          # Database utilities
│   ├── modules/            # Feature modules
│   │   ├── Auth/           # Authentication flows
│   │   ├── Notes/          # Notes management
│   │   └── Profile/        # User profile
│   ├── routes/             # Route definitions
│   ├── hooks/              # Custom React hooks
│   ├── env/                # Environment configuration
│   └── web/                # Server-side utilities
├── bin/                    # Development scripts
├── drizzle/                # Database migrations (generated)
├── tests/                  # E2E and unit tests
└── public/                 # Static assets
```

### Database Schema
- **Users** - Authentication and profile data with feature flags
- **Notes** - User-specific note content with timestamps
- **Relations** - Proper foreign key relationships with cascade operations

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 22.16.0
- **PNPM** (recommended) or npm
- **PostgreSQL** database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-router-starter
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and secrets
   ```

4. **Initialize database**
   ```bash
   ./bin/setup-drizzle  # Sets up database schema with Drizzle
   ```

5. **Start development**
   ```bash
   ./bin/dev       # Starts development server at http://localhost:3000
   ```

## 🛠️ Development

### Available Scripts

The project includes comprehensive bin scripts for streamlined development:

#### Build Commands
```bash
./bin/build         # Build for production
./bin/clean         # Clean build artifacts and cache
```

#### Development Commands
```bash
./bin/dev           # Start development server
./bin/start         # Start production server
```

#### Code Quality
```bash
./bin/lint          # Run ESLint
./bin/ts-check      # TypeScript type checking
./bin/ts-watch      # TypeScript watch mode
```

#### Testing
```bash
./bin/test              # Run all tests (unit + e2e)
./bin/test-vitest       # Unit tests only
./bin/test-vitest-watch # Unit tests in watch mode
./bin/test-e2e          # E2E tests with setup
./bin/test-e2e-quick    # E2E tests without rebuild
./bin/test-e2e-ui       # E2E tests with Playwright UI
```

#### Deployment
```bash
./bin/deploy        # Full deployment process
./bin/validate-env  # Validate environment configuration
./bin/ci           # Run full CI pipeline
```

#### Utilities
```bash
./bin/help         # Show all available commands
./bin/dotenv       # Advanced .env file handling
```

### Environment Configuration

The project uses smart environment loading:
- **Development**: Automatically loads `.env`
- **Testing**: Test scripts automatically use `.env.test`
- **Production**: Uses system environment variables

Environment variables are loaded once per script execution to prevent conflicts when scripts call other scripts.

### Database Operations

```bash
# Database setup and migrations
pnpm drizzle-kit push       # Push schema changes
pnpm drizzle-kit generate   # Generate migration files
pnpm drizzle-kit studio     # Open database browser

# Using bin scripts (includes environment loading)
./bin/setup-drizzle    # Full database initialization
```

## 🧪 Testing

### End-to-End Testing

Comprehensive E2E testing with Playwright:

```bash
# First time setup
pnpm dlx playwright install
pnpm dlx playwright install-deps

# Run tests
./bin/test-e2e        # Full E2E suite with database setup
./bin/test-e2e-ui     # Interactive mode with Playwright UI
```

Test features:
- **Authentication flows** (signup, login, logout)
- **Notes management** (create, delete, delete all)
- **User profiles** and theme switching
- **Database isolation** - Each test runs with clean database state

### Unit Testing

Vitest-based unit testing:

```bash
./bin/test-vitest         # Run once
./bin/test-vitest-watch   # Watch mode for development
```

## 🚀 Deployment

### Fly.io (Recommended)

The project is configured for Fly.io deployment:

```bash
# Deploy manually
fly deploy --remote-only

# Or use the deployment script
./bin/deploy
```

### GitHub Actions

Automated deployment is configured:
1. Set `FLY_API_TOKEN` in your GitHub repository secrets
2. Push to main branch triggers automatic deployment

### Vercel

Also supports Vercel deployment with included `vercel.json` configuration.

## 🔧 Technology Details

### React 19 Compatibility

The project is fully updated for React 19:
- **No forwardRef** - Direct ref props on components
- **Modern patterns** - Uses latest React Router 7 conventions
- **Type safety** - Full TypeScript coverage with React 19 types

### Authentication System

- **Secure cookies** - HttpOnly, SameSite strict
- **Password hashing** - Argon2 for production-grade security
- **Session management** - Configurable expiration and remember-me
- **Route protection** - Automatic redirects for auth state

### Performance Optimizations

- **SSR** - Server-side rendering for better SEO and performance
- **Code splitting** - Automatic route-based splitting
- **Modern bundling** - Vite-powered build system
- **Efficient caching** - Optimized asset and data caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `./bin/ci`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- [React Router](https://reactrouter.com/) - Modern React framework
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe database ORM
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
