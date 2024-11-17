const { createClient } = require("redis");
const redisClient = createClient();

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

(async () => {
  await redisClient.connect();
  console.log("Redis client connected.");
})();

module.exports = {
  add(token) {
    const expiry = 3600;
    redisClient.set(token, true, { EX: expiry });
  },
  isBlacklisted(token, callback) {
    redisClient.get(token, (err, reply) => {
      if (err) {
        return callback(false);
      }
      callback(reply !== null);
    });
  },
};
