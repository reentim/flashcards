import Storage from './storage';

export type Satisfaction = {
  [cardId: string]: 0 | 1;
};

interface NewResponseModel {
  id: string;
  deckId: string;
  satisfaction: Satisfaction;
}

interface ResponseModelProps {
  id: string;
  satisfaction: Satisfaction;
}

export default class ResponseModel {
  id: string;
  satisfaction: Satisfaction;

  constructor(props: ResponseModelProps) {
    const { id, satisfaction } = props;

    this.id = id;
    this.satisfaction = satisfaction;
  }

  static find(id: string | undefined): ResponseModel | undefined {
    const response = id && Storage.get(`response_${id}`);

    return response && new this({ id: id, satisfaction: response });
  }

  static saveNew(data: NewResponseModel) {
    const existingResponseIds =
      Storage.get(`deck_${data.deckId}_responseIds`) || [];

    if (!existingResponseIds.includes(data.id)) {
      Storage.set(`deck_${data.deckId}_responseIds`, [
        ...existingResponseIds,
        data.id,
      ]);
    }

    Storage.set(`response_${data.id}`, data.satisfaction);
  }
}
