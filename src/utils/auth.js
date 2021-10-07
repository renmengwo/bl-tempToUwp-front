import Cookies from 'js-cookie';

const TokenKey = 'DMS_TOKEN';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function setStorage(StorageKey, value) {
  return localStorage.setItem(StorageKey, value);
}

export function getStorage(StorageKey) {
  return localStorage.getItem(StorageKey);
}

export function removeStorage(StorageKey) {
  return localStorage.removeItem(StorageKey);
}
