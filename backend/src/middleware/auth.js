import { db } from '../db/index.js';
import { apiKeys } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const validateApiKey = async (req, res, next) => {
  // Support both custom header and Bearer token
  let key = req.headers['x-api-key'];
  
  if (!key && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      key = parts[1];
    }
  }

  // To allow standard dashboard operations to hit features without strict token requirements
  // we optionally accept a frontend bypass if needed, but per instructions, lock it under valid API keys.
  // We'll enforce this for everyone for now.

  if (!key) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing API Key' });
  }

  try {
    const [apiKeyRecord] = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.key, key))
      .limit(1);

    if (!apiKeyRecord) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Invalid API Key' });
    }

    if (apiKeyRecord.expires_at && new Date(apiKeyRecord.expires_at) < new Date()) {
        return res.status(401).json({ success: false, error: 'Unauthorized: API Key Expired' });
    }

    req.apiKey = apiKeyRecord;
    req.userId = apiKeyRecord.user_id;
    next();
  } catch (error) {
    console.error('API Key validation error:', error);
    res.status(500).json({ success: false, error: 'Internal server error during auth' });
  }
};