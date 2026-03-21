import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { apiKeys } from '../db/schema.js';
import crypto from 'crypto';

const router = Router();

// Function to generate a secure random API key
function generateApiKey() {
  return 'fs_live_' + crypto.randomBytes(24).toString('base64url').replace(/[^a-zA-Z0-9]/g, '');
}

// POST /api/v1/keys - Generate a new API Key
router.post('/', async (req, res) => {
  try {
    const { userId, name, expiresAt } = req.body;
    
    if (!userId || !name) {
      return res.status(400).json({ success: false, error: 'User ID and key name are required' });
    }

    const key = generateApiKey();
    const expiryDate = expiresAt ? new Date(expiresAt) : null;

    const [newKey] = await db.insert(apiKeys).values({
      user_id: userId,
      key,
      name,
      expires_at: expiryDate
    }).returning();

    return res.json({ success: true, result: newKey });
  } catch (err) {
    console.error('API Key generation error:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// GET /api/v1/keys/:userId - List all API keys for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const keys = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        key: apiKeys.key, // In a real system, you might want to only return the first/last few chars
        expires_at: apiKeys.expires_at,
        created_at: apiKeys.created_at
      })
      .from(apiKeys)
      .where(eq(apiKeys.user_id, userId));

    return res.json({ success: true, result: keys });
  } catch (err) {
    console.error('API Key fetch error:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// DELETE /api/v1/keys/:id - Revoke an API key
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(apiKeys).where(eq(apiKeys.id, id));
    return res.json({ success: true, message: 'API key revoked' });
  } catch (err) {
    console.error('API Key deletion error:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

export default router;