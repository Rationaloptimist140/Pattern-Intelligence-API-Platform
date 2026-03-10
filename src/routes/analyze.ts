import { Router, Request, Response } from 'express';
import { validateAnalyzeRequest } from '../middleware/validator';
import { analyzePatterns } from '../services/patternDetector';
import { AnalyzeRequestBody } from '../types';

const router = Router();

router.post('/analyze', validateAnalyzeRequest, (req: Request<unknown, unknown, AnalyzeRequestBody>, res: Response) => {
  try {
    const { text, patterns } = req.body;
    const result = analyzePatterns(text, patterns);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof SyntaxError) {
      res.status(400).json({ error: `Invalid regex pattern: ${error.message}` });
      return;
    }

    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
