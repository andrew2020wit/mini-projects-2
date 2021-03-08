const redis = require("redis");
const client = redis.createClient();

client.set("key2", "value2", "NX", "EX", 2);

client.get("key2", redis.print);

setTimeout(() => {
  client.get("key2", redis.print);
}, 3000);
