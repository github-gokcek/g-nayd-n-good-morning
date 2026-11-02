export const questions = [
  { id: 1, text: 'Bugün de en sevdiğim duo olur musun?', kind: 'opening' },
  { id: 2, text: 'Benimle bir el TFT oynar mısın?', kind: 'opening' },
  { id: 3, text: 'Seninle küçük bir anime molası verelim mi?', kind: 'opening' },
  { id: 4, text: 'Bir el daha bahanesiyle biraz daha yanımda kalır mısın?', kind: 'middle' },
  { id: 5, text: 'Kaybetsek de beraber gülmeye devam edelim mi?', kind: 'middle' },
  { id: 6, text: 'Sıradaki animeyi beraber seçelim mi?', kind: 'middle' },
  { id: 7, text: 'Bir bölüm daha izleyip zamanı unutalım mı?', kind: 'middle' },
  { id: 8, text: 'Bu akşam sohbetimize biraz daha vakit ayıralım mı?', kind: 'middle' },
  { id: 9, text: 'Bu geceyi bana lütfeder misin?', kind: 'final' },
  { id: 10, text: 'Bu akşamı birlikte geçirelim mi?', kind: 'final' },
  { id: 11, text: 'Oyunuyla, animesiyle, sohbetiyle bu gece benimle olur musun?', kind: 'final' },
  { id: 12, text: 'Bu gece de en sevdiğim kişiyle vakit geçirebilir miyim?', kind: 'final' },
] as const;

export const sequences = [
  [2, 4, 5, 6, 11],
  [1, 5, 6, 7, 10],
  [3, 6, 7, 8, 12],
  [2, 5, 7, 8, 10],
  [1, 4, 6, 8, 11],
  [9],
];

export function chooseSequence(random = Math.random()) {
  const index = Math.min(sequences.length - 1, Math.max(0, Math.floor(random * sequences.length)));
  return sequences[index].map(id => {
    const question = questions.find(item => item.id === id);
    if (!question) throw new Error('Unknown question');
    return question;
  });
}

export function jokeForStep(step: number) {
  return (['runaway', 'change', 'confirm'] as const)[step % 3];
}