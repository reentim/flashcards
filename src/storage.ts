export default class Storage {
  static append(key: string, value: string) {
    const current = JSON.parse(localStorage.getItem(key) || '[]');

    localStorage.setItem(key, JSON.stringify(current.concat(value)));
  }

  static set(key: string, value: Object) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static get(key: string) {
    const data: string | null = localStorage.getItem(key);

    if (data) {
      return JSON.parse(data);
    }
  }

  static remove(key: string) {
    localStorage.removeItem(key);
  }
}
