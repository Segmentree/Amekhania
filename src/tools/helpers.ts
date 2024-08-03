import sha256 from 'crypto-js/sha256';

export function proxyUnwrap(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

export function createHash(key: string) {
  return sha256(key).toString();
}

export function getFromLocalStorage<T>(key: string) {
  try {
    return (
      localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : {}
    ) as { [key: string]: T };
  } catch (e) {
    console.error(e);
    return {} as { [key: string]: T };
  }
}

export function setToLocalStorage<T>(key: string, value: { [key: string]: T }) {
  localStorage.setItem(key, JSON.stringify(value));
}
