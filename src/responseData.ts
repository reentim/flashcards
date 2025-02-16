import Storage from './storage';

type Satisfaction = {
  [cardId: string]: 0 | 1;
};

interface ResponseDataProps {
  id: string;
  deckId: string;
  satisfaction: Satisfaction;
}

export default class ResponseData {
  id: string;
  deckId: string;
  satisfaction: Satisfaction;

  constructor(props: ResponseDataProps) {
    const { id, deckId, satisfaction } = props;

    this.id = id;
    this.deckId = deckId;
    this.satisfaction = satisfaction;
  }

  save() {
    const existingResponseIds = Storage.get(`deck_${this.deckId}_responseIds`) || [];

    if (!existingResponseIds.includes(this.id)) {
      Storage.set(`deck_${this.deckId}_responseIds`, [...existingResponseIds, this.id]);
    }

    Storage.set(`response_${this.id}`, this.satisfaction);
  }
}
