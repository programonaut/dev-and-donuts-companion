import Groq from "groq-sdk";
import type { NewMatch } from "../src/types/index.js";
import { db } from "./index.js";
import * as schema from "./schema.js";

const groqApiKey = process.env['GROQ'];

if (!groqApiKey) {
    throw new Error("GROQ_API_KEY is not set");
}

const groq = new Groq({ apiKey: groqApiKey });

const questionnaire = {
    technicalDomain: {
        type: "multiple_choice",
        question: "Which technical domains excite you the most (choose up to 3)",
        options: [
            {
                label: "Web Development",
                value: "web_development",
            },
            {
                label: "Mobile Development",
                value: "mobile_development",
            },
            {
                label: "AI",
                value: "ai",
            },
            {
                label: "Cloud Computing",
                value: "cloud_computing",
            },
            {
                label: "DevOps",
                value: "devops",
            }
        ]
    },
    tonight: {
        type: "free_text",
        question: "Tonight I'm hoping to",
    },
    sideProject: {
        type: "free_text",
        question: "In one sentence, describe a project, side-project or experiment you're proud of.",
    },
    helpSkill: {
        type: "free_text",
        question: "One topic or skill you could help others with tonight",
    },
    nonSoftware: {
        type: "free_text",
        question: "Non-software topic you could nerd-out about for 5 minutes",
    }
}

export const saveMatches = async (matches: NewMatch[]): Promise<void> => {
    if (matches.length === 0) {
        console.log("No matches to save");
        return;
    }

    try {
        await db.insert(schema.matches).values(matches);
        console.log(`Successfully saved ${matches.length} matches to database`);
    } catch (error) {
        console.error("Error saving matches:", error);
        throw new Error(`Failed to save matches: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export const matchUsers = async (): Promise<NewMatch[]> => {
    const allUsers = await db.select().from(schema.users);

    if (allUsers.length < 2) {
        console.log("Not enough users to create matches");
        return [];
    }

    // delete all matches as we want to create new ones
    // later only delete matches for the event
    await db.delete(schema.matches);

    const prompt = `Match developers for a networking event based on their interests and goals.

Available users (${allUsers.length}): ${allUsers.map(u => u.id).join(', ')}

Questionnaire:
${JSON.stringify(questionnaire, null, 2)}

Users data:
${JSON.stringify(allUsers.map(user => ({
        id: user.id,
        name: user.name,
        answers: user.answers
    })), null, 2)}

Rules:
- Each user can only be matched once (CRITICAL: no duplicate user IDs)
- Create pairs with complementary or similar interests
- DO NOT hallucinate anything into what the users said. Take it at face value and use it for the matching.
- Focus on side projects and hobby topics for conversation
- If odd number of users, leave last person unmatched

Return JSON array:
[
  {
    "userId1": 1,
    "userId2": 3,
    "emoji1": "🔐",
    "emoji2": "💰",
    "whyYoullHitItOff": "You both love building from scratch! Your side projects tackle real problems with style. Why not dive into a chat about your development challenges, what you've learned from your users, and maybe even brainstorm your next big idea together?",
    "suggestedIcebreakers": [
      "🛡 How do you handle security challenges in your projects?",
      "📱 What's your favorite 'a-ha' moment from building user-facing features?",
      "👂 What's the best feedback you've gotten from your users?"
    ]
  }
]

Choose relevant emojis for each user based on their interests and projects. Write 'whyYoullHitItOff' as warm, conversational text that highlights their shared interests and side projects. Create 3 'suggestedIcebreakers' that are specific to their interests and projects. Make it feel like a natural introduction between two people who would genuinely enjoy talking. NO markdown formatting. NO duplicate user IDs. NO text before or after the JSON array.`;


    console.log(prompt);
    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1, // Even lower temperature for more consistent output
            max_tokens: 2000,
            top_p: 0.9, // Slightly lower for more focused output
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        let content = response.choices[0]?.message.content;

        if (!content) {
            throw new Error("No content returned from LLM");
        }

        console.log("Raw response:", content);

        // Clean the content - remove markdown code blocks and trim whitespace
        content = content
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        console.log("Cleaned content:", content);

        // Parse the JSON response
        let parsedResponse: any[];
        try {
            const parsed = JSON.parse(content);
            parsedResponse = Array.isArray(parsed) ? parsed : [];
        } catch (parseError) {
            console.error("Failed to parse JSON response:", parseError);
            console.error("Cleaned content:", content);

            // Try to extract JSON array from the content
            try {
                const arrayMatch = content.match(/\[[\s\S]*\]/);
                if (arrayMatch) {
                    const jsonContent = arrayMatch[0];
                    console.log("Extracted JSON array:", jsonContent);
                    const parsed = JSON.parse(jsonContent);
                    parsedResponse = Array.isArray(parsed) ? parsed : [];
                } else {
                    throw new Error("No JSON array found in response");
                }
            } catch (fallbackError) {
                console.error("Fallback parsing also failed:", fallbackError);
                throw new Error("Invalid JSON response from LLM and fallback parsing failed");
            }
        }

        // Validate and transform the response to ensure no duplicates
        const validMatches: NewMatch[] = [];
        const matchedUserIds = new Set<number>();
        const duplicateCounts: { [key: number]: number } = {};

        // First pass: count duplicates to show the LLM what went wrong
        for (const match of parsedResponse) {
            if (typeof match.userId1 === 'number') {
                duplicateCounts[match.userId1] = (duplicateCounts[match.userId1] || 0) + 1;
            }
            if (typeof match.userId2 === 'number') {
                duplicateCounts[match.userId2] = (duplicateCounts[match.userId2] || 0) + 1;
            }
        }

        // Log duplicate analysis
        const duplicates = Object.entries(duplicateCounts).filter(([_, count]) => count > 1);
        if (duplicates.length > 0) {
            console.warn("DUPLICATE ANALYSIS - The following user IDs appeared multiple times:");
            duplicates.forEach(([userId, count]) => {
                console.warn(`  User ID ${userId}: appeared ${count} times`);
            });
        }

        for (const match of parsedResponse) {
            // Validate required fields
            if (typeof match.userId1 !== 'number' || typeof match.userId2 !== 'number' || typeof match.whyYoullHitItOff !== 'string' || typeof match.emoji1 !== 'string' || typeof match.emoji2 !== 'string' || !Array.isArray(match.suggestedIcebreakers)) {
                console.warn("Invalid match object:", match);
                continue;
            }

            // Check for duplicate users (CRITICAL: prevent same user being matched multiple times)
            if (matchedUserIds.has(match.userId1) || matchedUserIds.has(match.userId2)) {
                console.warn(`Duplicate user detected - userId1: ${match.userId1}, userId2: ${match.userId2}`);
                continue;
            }

            // Ensure userId1 < userId2 for consistency
            const [userId1, userId2] = match.userId1 < match.userId2 ? [match.userId1, match.userId2] : [match.userId2, match.userId1];

            validMatches.push({
                userId1,
                userId2,
                reason: match.whyYoullHitItOff.trim(),
                emoji1: match.emoji1,
                emoji2: match.emoji2,
                icebreakers: match.suggestedIcebreakers
            });

            // Mark both users as matched
            matchedUserIds.add(match.userId1);
            matchedUserIds.add(match.userId2);
        }

        console.log(`Successfully created ${validMatches.length} valid matches (filtered out ${parsedResponse.length - validMatches.length} invalid/duplicate matches)`);
        console.log(`Matched user IDs: ${Array.from(matchedUserIds).sort((a, b) => a - b).join(', ')}`);

        if (validMatches.length > 0) {
            await saveMatches(validMatches);
        }

        return validMatches;
    } catch (error) {
        console.error("Error matching users:", error);
        throw new Error(`Failed to match users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}