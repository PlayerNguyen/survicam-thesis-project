const TOKEN_KEY = "jwt-app-token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function hasToken() {
  return getToken() !== null;
}

function setToken(value: any) {
  localStorage.setItem(TOKEN_KEY, value);
}

function deleteToken() {
  localStorage.removeItem(TOKEN_KEY);
}

const TokenStorage = {
  getToken,
  hasToken,
  setToken,
  deleteToken,
};

export default TokenStorage;

export { TOKEN_KEY };
