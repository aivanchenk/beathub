const blacklistedTokens = new Set();

module.exports = {
  add(token) {
    blacklistedTokens.add(token);
  },
  isBlacklisted(token) {
    return blacklistedTokens.has(token);
  },
};
