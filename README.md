# React Router 7 + Drizzle Starter

My `react-router` and `drizzle` starter. With `ssr` mode by default, simple user + password auth.

## 🚀 Live Demo

- [Deployed Application](https://react-router-jfranciscosousa.vercel.app/)
- [React Router 7 Documentation](https://reactrouter.com/home)

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 22.16.0
- **PNPM** (recommended) or npm
- **PostgreSQL** database

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:jfranciscosousa/react-router-starter.git
   cd react-router-starter
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   cp .env.test.sample .env.test
   # Edit .env with your database URL and secrets
   ```

4. **Initialize database**
   ```bash
   ./bin/setup-drizzle  # Sets up database with Drizzle
   ```

5. **Start development**
   ```bash
   ./bin/dev       # Starts development server at http://localhost:5173
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

### Vercel

Any app that uses this repo as the template can be deployed

## 🔧 Technologies

- [React Router](https://reactrouter.com/) - Modern React framework
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe database ORM
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Caveats

The authentication is not production ready. I use this for mainly for MVPs. It's secure but it's lacking:
- brute force protection
- password recovery via email

We are already tracking user sessions and we support invalidating user sessions as well.

Consider something like [Clerk](https://clerk.com/) instead if you don't want to implement those things yourself.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
