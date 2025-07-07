import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import usersRouter from './routes/users.js';
import eventsRouter from './routes/events.js';
import matchesRouter from './routes/matches.js';
import type { ApiResponse } from './types/index.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] ? parseInt(process.env['PORT']) : 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req: Request, res: Response<ApiResponse>) => {
    res.json({
        success: true,
        data: {
            message: 'Dev and Donuts API is running',
            timestamp: new Date().toISOString(),
            environment: process.env['NODE_ENV'] || 'development'
        }
    });
});

// API routes
app.use('/api/users', usersRouter);
app.use('/api/events', eventsRouter);
app.use('/api/matches', matchesRouter);

// Root endpoint
app.get('/', (_req: Request, res: Response<ApiResponse>) => {
    res.json({
        success: true,
        data: {
            message: 'Welcome to Dev and Donuts API',
            version: '1.0.0',
            endpoints: {
                health: '/health',
                users: '/api/users',
                events: '/api/events',
                matches: '/api/matches',
            }
        }
    });
});

// 404 handler
app.use('*', (req: Request, res: Response<ApiResponse>) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        data: {
            path: req.originalUrl
        }
    });
});

// Error handler
app.use((error: Error, _req: Request, res: Response<ApiResponse>, _next: NextFunction) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env['NODE_ENV'] === 'development' ? error.message : 'Something went wrong'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
    console.log(`🌍 Environment: ${process.env['NODE_ENV'] || 'development'}`);
}); 