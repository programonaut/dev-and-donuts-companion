import express, { Request, Response, Router } from 'express';
import { desc, eq } from 'drizzle-orm';
import type { ApiResponse, Event } from '../types/index.js';
import { db } from '../../lib/index.js';
import * as schema from '../../lib/schema';

const router: Router = express.Router();

// GET /api/events - Fetch all events
router.get('/', async (_req: Request, res: Response<ApiResponse<Event[]>>) => {
    try {
        const allEvents = await db.select().from(schema.events).orderBy(desc(schema.events.date)).limit(1);
        return res.json({
            success: true,
            data: allEvents,
            count: allEvents.length
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch events',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// GET /api/events/:id - Fetch event by ID
router.get('/:id', async (req: Request, res: Response<ApiResponse<Event>>) => {
    try {
        const eventId = parseInt(req.params['id'] || '');

        if (isNaN(eventId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid event ID'
            });
        }

        const event = await db.select().from(schema.events).where(eq(schema.events.id, eventId));

        if (event.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        return res.json({
            success: true,
            data: event[0]!
        });
    } catch (error) {
        console.error('Error fetching event:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch event',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router; 