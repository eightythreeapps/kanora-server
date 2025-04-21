# Kanora Server

A headless server application that provides a RESTful API for managing music collections. Built with Node.js, TypeScript, Express, and Prisma.

## Features

- RESTful API for music library management
- Real-time updates via WebSocket
- Authentication and authorization
- Rate limiting and security features
- PostgreSQL database with Prisma ORM
- Comprehensive test suite
- TypeScript for type safety
- Error handling and logging

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/eightythreeapps/kanora-server.git
   cd kanora-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up the database:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

## Development

Start the development server:
```bash
npm run dev
```

The server will be running at `http://localhost:3000` (or the port specified in your .env file).

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server
- `npm run build` - Build the TypeScript code
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Express middleware
├── models/         # Data models
├── repositories/   # Database repositories
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
└── __tests__/     # Tests
```

## API Documentation

API documentation is available at `/api/docs` when running the server.

## Contributing

1. Create a new branch following the GitFlow pattern:
   - `feature/issue-{number}-{description}` for new features
   - `bugfix/issue-{number}-{description}` for bug fixes
   - `refactor/issue-{number}-{description}` for refactoring

2. Make your changes and write tests

3. Submit a pull request

## License

ISC 