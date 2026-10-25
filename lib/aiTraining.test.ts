import test from 'node:test';
import assert from 'node:assert/strict';
import { A_TO_Z_TRAINING_MODULES, getMasterSystemInstruction, getFastHighPowerResponse } from './aiTraining.ts';

test('A to Z training modules contain all 26 alphabet categories from A to Z', () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  for (const letter of letters) {
    assert.ok(A_TO_Z_TRAINING_MODULES[letter], `Module ${letter} should exist`);
    assert.ok(A_TO_Z_TRAINING_MODULES[letter].category.length > 0, `Module ${letter} category should be defined`);
    assert.ok(A_TO_Z_TRAINING_MODULES[letter].guidelines.length > 0, `Module ${letter} guidelines should exist`);
  }
  assert.equal(Object.keys(A_TO_Z_TRAINING_MODULES).length, 26);
});

test('getMasterSystemInstruction produces rich system prompt with personal context', () => {
  const instruction = getMasterSystemInstruction({
    model: 'mindly-think',
    webSearch: true,
    customInstructions: {
      aboutMe: 'Staff AI Engineer',
      howToReply: 'Provide clean TypeScript examples',
    },
    memories: [{ text: 'User loves high-performance computing' }],
  });

  assert.ok(instruction.includes('MINDLY'));
  assert.ok(instruction.includes('Staff AI Engineer'));
  assert.ok(instruction.includes('Provide clean TypeScript examples'));
  assert.ok(instruction.includes('User loves high-performance computing'));
  assert.ok(instruction.includes('THINK MODE ACTIVE'));
  assert.ok(instruction.includes('WEB SEARCH ACTIVE'));
});

test('getFastHighPowerResponse returns instant quantum physics explanation', () => {
  const response = getFastHighPowerResponse('Explain quantum computing', 'mindly-fast');
  assert.ok(response.includes('Qubits') || response.includes('qubit'));
  assert.ok(response.includes('Superposition'));
  assert.ok(response.includes('Entanglement'));
});

test('getFastHighPowerResponse returns optimized Python code for coding queries', () => {
  const response = getFastHighPowerResponse('Help me debug my Python fibonacci code', 'mindly-pro');
  assert.ok(response.includes('```python'));
  assert.ok(response.includes('lru_cache'));
  assert.ok(response.includes('fibonacci'));
});

test('getFastHighPowerResponse handles Hindi and Bengali multilingual greetings', () => {
  const response = getFastHighPowerResponse('Namaste kaise ho aap', 'mindly-2.2-fast');
  assert.ok(response.includes('Namaste') || response.includes('MINDLY'));
});

test('getFastHighPowerResponse solves calculus integrals step-by-step', () => {
  const response = getFastHighPowerResponse('Compute the integral of x e^{ax}', 'mindly-2.2-think');
  assert.ok(response.includes('Integration by Parts') || response.includes('calculus'));
  assert.ok(response.includes('frac{e^{ax}}{a^2}'));
});

test('getFastHighPowerResponse explains biology and CRISPR mechanism', () => {
  const response = getFastHighPowerResponse('Explain how CRISPR-Cas9 works in biology', 'mindly-2.2-pro');
  assert.ok(response.includes('CRISPR-Cas9'));
  assert.ok(response.includes('PAM'));
});

test('getFastHighPowerResponse identifies creator Sayan Karmakar in Hindi and English', () => {
  const hindiResponse = getFastHighPowerResponse('tume kisne banaya hai owner kaun hai', 'mindly-2.2-fast');
  assert.ok(hindiResponse.includes('Sayan Karmakar'));
  assert.ok(hindiResponse.includes('Co-Founder & CEO of MINDLY'));

  const englishResponse = getFastHighPowerResponse('Who created you and who is the CEO?', 'mindly-2.2-fast');
  assert.ok(englishResponse.includes('Sayan Karmakar'));
  assert.ok(englishResponse.includes('Co-Founder and CEO of MINDLY'));
});

test('getFastHighPowerResponse identifies as MINDLY 2.2 when asked which model', () => {
  const modelResponse = getFastHighPowerResponse('tum konsa model ho', 'mindly-2.2-coding');
  assert.ok(modelResponse.includes('MINDLY 2.2 Coding'));
});

test('getFastHighPowerResponse returns exact greeting for hi', () => {
  const greetingResponse = getFastHighPowerResponse('hi', 'mindly-2.2-fast');
  assert.equal(greetingResponse, 'Hi! 👋 How can I help you today?');
});

test('readAndSolveCode detects const reassignment bug and fixes it', () => {
  const userCode = 'const count = 0; count = count + 1;';
  const response = getFastHighPowerResponse(userCode, 'mindly-2.2-coding');
  assert.ok(response.includes('TypeError: Assignment to constant variable'));
  assert.ok(response.includes('let count'));
});

test('readAndSolveCode detects off-by-one loop index bound bug', () => {
  const userCode = 'for (let i = 0; i <= arr.length; i++) { console.log(arr[i]); }';
  const response = getFastHighPowerResponse(userCode, 'mindly-2.2-coding');
  assert.ok(response.includes('Off-by-one error'));
  assert.ok(response.includes('i < arr.length'));
});

test('readAndSolveCode generates React counter and binary search when requested', () => {
  const reactResponse = getFastHighPowerResponse('create a react counter component', 'mindly-2.2-coding');
  assert.ok(reactResponse.includes('useState<number>'));
  assert.ok(reactResponse.includes('Counter'));

  const bsResponse = getFastHighPowerResponse('implement binary search algorithm', 'mindly-2.2-coding');
  assert.ok(bsResponse.includes('binarySearch'));
  assert.ok(bsResponse.includes('O(log n)'));
});

test('readAndSolveCode generates full HTML website for html webside creat', () => {
  const websiteResponse = getFastHighPowerResponse('html webside creat', 'mindly-2.2-coding');
  assert.ok(websiteResponse.includes('<!DOCTYPE html>'));
  assert.ok(websiteResponse.includes('Complete Responsive HTML5 Website'));
  assert.ok(!websiteResponse.includes('I was created and am owned'));
});



