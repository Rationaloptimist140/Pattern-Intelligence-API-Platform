import { NextFunction, Request, Response } from 'express';

const MAX_TEXT_LENGTH = 50000;
const MIN_PATTERNS = 1;
const MAX_PATTERNS = 10;

export const validateAnalyzeRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { text, patterns } = req.body as { text?: unknown; patterns?: unknown };

  if (typeof text !== 'string' || text.trim().length === 0) {
    res.status(400).json({ error: 'Invalid input: text must be a non-empty string.' });
    return;
  }

  if (text.length > MAX_TEXT_LENGTH) {
    res.status(400).json({ error: `Invalid input: text must be at most ${MAX_TEXT_LENGTH} characters.` });
    return;
  }

  if (!Array.isArray(patterns)) {
    res.status(400).json({ error: 'Invalid input: patterns must be an array of strings.' });
    return;
  }

  if (patterns.length < MIN_PATTERNS || patterns.length > MAX_PATTERNS) {
    res
      .status(400)
      .json({ error: `Invalid input: patterns must contain between ${MIN_PATTERNS} and ${MAX_PATTERNS} items.` });
    return;
  }

  if (patterns.some((pattern) => typeof pattern !== 'string' || pattern.trim().length === 0)) {
    res.status(400).json({ error: 'Invalid input: each pattern must be a non-empty string.' });
    return;
  }

  next();
};
