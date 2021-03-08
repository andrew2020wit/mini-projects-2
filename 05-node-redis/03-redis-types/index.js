const redis = require("redis");
const client = redis.createClient();

client.lpush("list1", "v1");

client.lrange("list1", 0, -1, (err, repl) => {
  console.log("list1: ", repl);
});

client.lpop("list1", (err, repl) => {
  console.log(repl);
});
