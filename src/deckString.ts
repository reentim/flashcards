import { inflate, deflate } from 'pako';

export default class DeckString {
  static encode(obj: Object): string {
    const binaryString = Array.from(deflate(JSON.stringify(obj), { level: 9 }))
      .map((code) => String.fromCharCode(code))
      .join('');

    return btoa(binaryString);
  }

  static decode(string: string): Object {
    const binaryString = atob(string);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return JSON.parse(inflate(bytes, { to: 'string' }));
  }
}
