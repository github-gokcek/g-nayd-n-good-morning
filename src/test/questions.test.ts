import { describe, expect, it } from 'vitest';
import { chooseSequence, jokeForStep, questions, sequences } from '../lib/questions';

describe('Göksu invitation rules', () => {
  it('keeps the approved twelve-question pool', () => {
    expect(questions).toHaveLength(12);
  });
  it('shows five questions in every regular sequence', () => {
    expect(sequences.filter(sequence => sequence.length > 1).map(sequence => sequence.length)).toEqual([5, 5, 5, 5, 5]);
  });
  it('offers the night invitation as a standalone sequence', () => {
    expect(chooseSequence(0.99).map(question => question.id)).toEqual([9]);
  });
  it('never asks another question after a final invitation', () => {
    for (let index = 0; index < sequences.length; index++) {
      const sequence = chooseSequence(index / sequences.length + 0.001);
      expect(sequence.at(-1)?.kind).toBe('final');
      expect(sequence.slice(0, -1).some(question => question.kind === 'final')).toBe(false);
    }
  });
  it('starts regular sequences with an opening question', () => {
    for (let index = 0; index < 5; index++) expect(chooseSequence(index / 6 + 0.001)[0].kind).toBe('opening');
  });
  it('uses all three negative-option jokes', () => {
    expect([0, 1, 2].map(jokeForStep)).toEqual(['runaway', 'change', 'confirm']);
  });
});