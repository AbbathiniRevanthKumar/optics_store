const redis = require("redis");
const { consts } = require("./config");

// Use environment variables
const redisClient = redis.createClient({
  socket: {
    host: consts.redis_host || 'localhost',
    port: consts.redis_port || 6379,
  },
});

const connectToRedis = async () => {
  try {
    await redisClient.connect();
    console.log("-------------Redis connected--------------");
  } catch (error) {
    console.log("Redis error : ", error);
  }
};

module.exports = { redisClient, connectToRedis };
