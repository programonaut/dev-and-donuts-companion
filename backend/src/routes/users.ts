import { eq } from 'drizzle-orm';
import express, { Request, Response, Router } from 'express';
import { db } from '../../lib';
import * as schema from '../../lib/schema';
import type { ApiResponse, Questionnaire, User } from '../types/index';
import { matchUsers } from '../../lib/matching';

const router: Router = express.Router();

// endpoint to answer the questions
router.put('/:uniqueId', async (req: Request, res: Response<ApiResponse<User>>) => {
    try {
        const { uniqueId } = req.params;

        const { answers } = req.body as { answers: Questionnaire };

        if (!uniqueId) {
            return res.status(400).json({
                success: false,
                error: 'User uniqueId is required'
            });
        }

        if (!answers) {
            return res.status(400).json({
                success: false,
                error: 'Answers are required in request body'
            });
        }

        const user = await db.select().from(schema.users).where(eq(schema.users.uniqueId, uniqueId));

        if (user.length === 0 || !user[0]) {
            // create a new user
            const newUser = await db.insert(schema.users).values({
                uniqueId: uniqueId,
                answers: answers,
                name: answers.name
            }).returning();

            return res.json({
                success: true,
                data: newUser[0]!
            });
        }

        const updatedUser = await db.update(schema.users).set({
            answers: answers
        }).where(eq(schema.users.uniqueId, uniqueId)).returning();

        await matchUsers();

        return res.json({
            success: true,
            data: updatedUser[0]!
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to update user',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router; 