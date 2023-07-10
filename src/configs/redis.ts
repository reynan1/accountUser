import RedisClient, {Redis} from 'ioredis'
const redisHost = `redis://${process.env.REDIS_HOST}` // use v3 redis
export const redisClient = (new RedisClient(redisHost)) as Redis
redisClient.on('error', (err: Error) => {
  if (err) {
    return
  }
});
redisClient.on('connect', (err: Error) => {
  if (err) {
    return
  }
  console.log(`Connected to ${redisHost}.`);
});