import DeckString from '../src/deckString';

describe(DeckString, () => {
  describe('the encode / decode round trip', () => {
    const obj = {
      decks: [
        {
          name: 'Test deck',
          cards: {
            '🇺🇳': 'United Nations',
            мир: 'peace, world',
            義: 'ギ (gi): righteousness, justice, morality, honor, loyalty, meaning',
          },
        },
      ],
    };

    it('recreates a matching object', () => {
      expect(DeckString.decode(DeckString.encode(obj))).toMatchObject(obj);
    });
  });
});
