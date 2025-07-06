import { eq, aliasedTable, or } from 'drizzle-orm';
import express, { Request, Response, Router } from 'express';
import { db } from '../../lib/index.js';
import * as schema from '../../lib/schema';
import type { ApiResponse } from '../types/index.js';

const router: Router = express.Router();

// GET /api/matches/:id - Fetch match by ID
router.get('/:uniqueId', async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
        const uniqueId = req.params['uniqueId'];

        if (!uniqueId) {
            return res.status(400).json({
                success: false,
                error: 'Unique ID is required'
            });
        }

        const user1 = aliasedTable(schema.users, 'user1');
        const user2 = aliasedTable(schema.users, 'user2');
        const match = await db.select({
            user1: user1.name,
            user2: user2.name,
            emoji1: schema.matches.emoji1,
            emoji2: schema.matches.emoji2,
            icebreakers: schema.matches.icebreakers,
            reason: schema.matches.reason
        }).from(schema.matches)
            .innerJoin(user1, eq(schema.matches.userId1, user1.id))
            .innerJoin(user2, eq(schema.matches.userId2, user2.id))
            .where(or(eq(user1.uniqueId, uniqueId), eq(user2.uniqueId, uniqueId)));

        console.log(match);

        res.json({
            success: true,
            data: match
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

export default router; 