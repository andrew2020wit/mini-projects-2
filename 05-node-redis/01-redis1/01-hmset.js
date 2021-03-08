const redis = require("redis");
const client = redis.createClient();

client.on("error", function (error) {
  console.error(error);
});

client.on("connect", function () {
  console.log("Successfully connected");
});

client.hmset("test", {
  demo2: "example3",
  demo3: "example4",
  demo4: "example5",
});

client.hgetall("test", function (err, object) {
  console.log(object);
});
