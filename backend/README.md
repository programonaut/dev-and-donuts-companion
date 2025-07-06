# Dev and Donuts Backend API

A simple Express.js API with TypeScript, PostgreSQL database using Drizzle ORM for the Dev and Donuts companion app.

## Features

- 🚀 Express.js server with TypeScript and RESTful API
- 🗄️ PostgreSQL database with Drizzle ORM
- 🔐 Environment-based configuration
- 📊 Health check endpoint
- 🛡️ CORS enabled
- 📝 Comprehensive error handling
- 🎯 Full TypeScript support with strict type checking

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn
- TypeScript knowledge (recommended)

## Setup

1. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**

   ```bash
   cp env.example .env
   ```

   Update the `.env` file with your database credentials:

   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/dev_and_donuts
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Database Setup**

   ```bash
   # Generate migration files
   npm run db:generate

   # Run migrations
   npm run db:migrate
   ```

4. **Start the server**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Build for production
   npm run build

   # Production mode
   npm start
   ```

## API Endpoints

### Health Check

- `GET /health` - Check if the API is running

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create a new event

### Matches

- `GET /api/matches` - Get all matches
- `GET /api/matches/:id` - Get match by ID
- `POST /api/matches` - Create a new match

## Database Schema

### Users Table

- `id` - Primary key (auto-increment)
- `name` - User's name (required)
- `answers` - JSON field for questionnaire answers
- `uniqueIdentifier` - Foreign key to data table
- `created_at` - Timestamp

### Events Table

- `id` - Primary key (auto-increment)
- `date` - Event date (required)
- `name` - Event name (required, unique)
- `structure` - JSON field for event structure
- `created_at` - Timestamp

### Matches Table

- `id` - Primary key (auto-increment)
- `user_id1` - First user ID (foreign key)
- `user_id2` - Second user ID (foreign key)
- `reason` - Match reason (required)
- `created_at` - Timestamp

### Data Table

- `id` - Primary key (auto-increment)
- `uniqueIdentifier` - Unique identifier (required, unique)
- `created_at` - Timestamp

## Example API Usage

### Create a User

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "uniqueIdentifier": "user123",
    "answers": {"question1": "answer1"}
  }'
```

### Get All Users

```bash
curl http://localhost:3001/api/users
```

### Create an Event

```bash
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "name": "Dev Meetup",
    "structure": {"sessions": []}
  }'
```

## Development

### Available Scripts

- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start the server (production)
- `npm run dev` - Start in development mode with auto-reload
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:seed` - Seed database with sample data
- `npm test` - Test API endpoints

### Project Structure

```
backend/
├── src/
│   ├── db/
│   │   ├── index.ts      # Database connection
│   │   └── schema.ts     # Database schema
│   ├── routes/
│   │   ├── users.ts      # User routes
│   │   ├── events.ts     # Event routes
│   │   └── matches.ts    # Match routes
│   ├── types/
│   │   └── index.ts      # TypeScript type definitions
│   ├── scripts/
│   │   └── seed.ts       # Database seeding script
│   └── index.ts          # Main server file
├── dist/                 # Compiled JavaScript (generated)
├── drizzle/              # Generated migrations
├── package.json
├── tsconfig.json         # TypeScript configuration
├── drizzle.config.js
└── README.md
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message (development only)"
}
```

## TypeScript Features

This project uses TypeScript with strict configuration for better type safety:

- **Strict Type Checking**: All TypeScript strict flags are enabled
- **Type Inference**: Automatic type inference from Drizzle schema
- **API Type Safety**: Request/response types for all endpoints
- **Database Types**: Generated types from database schema
- **Error Handling**: Typed error responses

### Type Definitions

The project includes comprehensive type definitions in `src/types/index.ts`:

- Database entity types (User, Event, Match, Data)
- API request/response types
- Environment configuration types
- Frontend-compatible types (Questionnaire, EventStructure)

## CORS Configuration

CORS is enabled by default for `http://localhost:3000`. Update the `CORS_ORIGIN` environment variable to change the allowed origin.
