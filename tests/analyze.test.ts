import request from 'supertest';
import app from '../src/index';
import { analyzePatterns, detectPattern } from '../src/services/patternDetector';

describe('Pattern detection logic', () => {
  const mockCases = [
    {
      name: 'plain text matching',
      text: 'alpha beta alpha gamma alpha',
      pattern: 'alpha',
      expectedOccurrences: 3,
      expectedPositions: [0, 11, 23]
    },
    {
      name: 'regex matching with flags',
      text: 'Email: A@B.COM and c@d.com',
      pattern: '/[a-z]+@[a-z]+\\.[a-z]+/i',
      expectedOccurrences: 2,
      expectedPositions: [7, 19]
    },
    {
      name: 'sample limiting',
      text: 'a a a a a a a',
      pattern: 'a',
      expectedOccurrences: 7,
      expectedSampleCount: 5
    }
  ];

  it.each(mockCases)('detectPattern - $name', ({ text, pattern, expectedOccurrences, expectedPositions, expectedSampleCount }) => {
    const result = detectPattern(text, pattern);
    expect(result.occurrences).toBe(expectedOccurrences);

    if (expectedPositions) {
      expect(result.positions).toEqual(expectedPositions);
    }

    if (expectedSampleCount) {
      expect(result.samples).toHaveLength(expectedSampleCount);
    }
  });

  it('analyzePatterns returns metadata and all results', () => {
    const output = analyzePatterns('abc abc', ['abc', '/b./']);
    expect(output.matches).toHaveLength(2);
    expect(output.metadata.totalPatterns).toBe(2);
    expect(output.metadata.processingTime).toMatch(/ms$/);
  });
});

describe('API integration tests', () => {
  it('POST /api/analyze should return matches and metadata', async () => {
    const response = await request(app).post('/api/analyze').send({
      text: 'cat dog cat bird',
      patterns: ['cat', '/d.g/']
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('matches');
    expect(response.body).toHaveProperty('metadata');
    expect(response.body.metadata.totalPatterns).toBe(2);
  });

  it('POST /api/analyze should validate invalid payload', async () => {
    const response = await request(app).post('/api/analyze').send({
      text: '',
      patterns: []
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/Invalid input/);
  });

  it('GET /health should return healthy status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
