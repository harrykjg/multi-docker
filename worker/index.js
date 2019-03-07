const keys = require('./keys'); //先读一个file,这个file里存一些key value
const redis = require('redis');//import redis client

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {//给redis发信息
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');
