import express, { Request, Response, Router } from 'express';
import { eq } from 'drizzle-orm';
import type { CreateMatchRequest, ApiResponse, Match } from '../types/index.js';
import { db } from '../../lib/index.js';
import * as schema from '../../lib/schema';

const router: Router = express.Router();

// GET /api/matches - Fetch all matches
router.get('/', async (req: Request, res: Response<ApiResponse<Match[]>>) => {
    try {
        const allMatches = await db.select().from(schema.matches);
        res.json({
            success: true,
            data: allMatches,
            count: allMatches.length
        });
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch matches',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// GET /api/matches/:id - Fetch match by ID
router.get('/:id', async (req: Request, res: Response<ApiResponse<Match>>) => {
    try {
        const matchId = parseInt(req.params['id'] || '');

        if (isNaN(matchId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid match ID'
            });
        }

        const match = await db.select().from(schema.matches).where(eq(schema.matches.id, matchId));

        if (match.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Match not found'
            });
        }

        res.json({
            success: true,
            data: match[0]!
        });
    } catch (error) {
        console.error('Error fetching match:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch match',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// POST /api/matches - Create a new match
router.post('/', async (req: Request<{}, {}, CreateMatchRequest>, res: Response<ApiResponse<Match>>) => {
    try {
        const { userId1, userId2, reason } = req.body;

        if (!userId1 || !userId2 || !reason) {
            return res.status(400).json({
                success: false,
                error: 'userId1, userId2, and reason are required'
            });
        }

        // Verify that both users exist
        const user1 = await db.select().from(schema.users).where(eq(schema.users.id, userId1));
        const user2 = await db.select().from(schema.users).where(eq(schema.users.id, userId2));

        if (user1.length === 0 || user2.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'One or both users not found'
            });
        }

        const newMatch = await db.insert(schema.matches).values({
            userId1,
            userId2,
            reason
        }).returning();

        res.status(201).json({
            success: true,
            data: newMatch[0]!
        });
    } catch (error) {
        console.error('Error creating match:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create match',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

router.post('/start', async (req: Request, res: Response<ApiResponse<Match>>) => {
    try {
        const { userId1, userId2 } = req.body;

        if (!userId1 || !userId2) {
            return res.status(400).json({
                success: false,
                error: 'userId1 and userId2 are required'
            });
        }

        const match = await db.insert(schema.matches).values({
            userId1,
            userId2,
            reason: 'Start match'
        }).returning();
    } catch (error) {
        console.error('Error starting match:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to start match',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router; 