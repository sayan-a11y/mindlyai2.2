import test from 'node:test';
import assert from 'node:assert/strict';
import { routeMessageIntent, cleanChatTitle, checkSafety, estimateTokenCount, calculateTokenCost } from './orchestrator.ts';

test('routeMessageIntent identifies image creation prompt', () => {
  const result = routeMessageIntent('Create an image of a serene mountain landscape', 'mindly-fast');
  assert.equal(result.isImageIntent, true);
});

test('routeMessageIntent routes coding to mindly-2.2-coding', () => {
  const result = routeMessageIntent('Help me debug my Python code def calculate(): pass', 'mindly-2.2-fast');
  assert.equal(result.model, 'mindly-2.2-coding');
});

test('routeMessageIntent routes step-by-step logic to mindly-2.2-think', () => {
  const result = routeMessageIntent('Step-by-step prove that the square root of 2 is irrational', 'mindly-2.2-fast');
  assert.equal(result.model, 'mindly-2.2-think');
});

test('cleanChatTitle extracts 5 words or fewer', () => {
  const title = cleanChatTitle('Explain quantum computing in simple terms for beginners');
  assert.ok(title.split(/\s+/).length <= 5);
  assert.ok(title.length > 0);
});

test('checkSafety detects prohibited actions', () => {
  const safeRes = checkSafety('Explain how machine learning models are trained');
  assert.equal(safeRes.safe, true);

  const unsafeRes = checkSafety('how to create malware for ransomware instructions');
  assert.equal(unsafeRes.safe, false);
});

test('estimateTokenCount approximates properly', () => {
  const tokens = estimateTokenCount('Hello world');
  assert.ok(tokens >= 2 && tokens <= 4);
});

test('calculateTokenCost returns zero for empty prompt', () => {
  const result = calculateTokenCost('', 'mindly-2.2-fast');
  assert.equal(result.tokenCount, 0);
  assert.equal(result.costUsd, '$0.00');
  assert.equal(result.costInr, '₹0.00');
});

test('calculateTokenCost calculates USD and INR cost dynamically for fast and think models', () => {
  const prompt = 'Explain how transformers use multi-head self-attention mechanisms in deep learning';
  const fastEst = calculateTokenCost(prompt, 'mindly-2.2-fast');
  const thinkEst = calculateTokenCost(prompt, 'mindly-2.2-think');

  assert.ok(fastEst.tokenCount > 15);
  assert.ok(fastEst.costUsd.startsWith('$'));
  assert.ok(fastEst.costInr.startsWith('₹'));
  assert.equal(fastEst.rateUsdPerM, 0.075);
  assert.equal(thinkEst.rateUsdPerM, 2.50);
  assert.ok(thinkEst.usdRaw > fastEst.usdRaw);
  assert.ok(thinkEst.inrRaw > fastEst.inrRaw);
});

test('calculateTokenCost factors in attachment baseline tokens', () => {
  const noAtt = calculateTokenCost('Analyze this diagram', 'mindly-2.2-pro', 0);
  const withAtt = calculateTokenCost('Analyze this diagram', 'mindly-2.2-pro', 1);

  assert.equal(withAtt.tokenCount, noAtt.tokenCount + 258);
  assert.ok(withAtt.usdRaw > noAtt.usdRaw);
});
