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

const TokenStorage = {
  getToken,
  hasToken,
  setToken,
};

export default TokenStorage;

export { TOKEN_KEY };
