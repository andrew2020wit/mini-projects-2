const redis = require("redis");
const client = redis.createClient();

client.on("error", function (error) {
  console.error("client-on-ready: ", error);
});

client.on("connect", function () {
  console.log("client-on-connect");
});

client.on("ready", function () {
  console.log("client-on-ready");
});

client.on("reconnecting", function () {
  console.log("client-on-reconnecting");
});

client.on("end", function () {
  console.log("client-on-end");
});
client.on("warning", function () {
  console.log("client-on-warning");
});

client.hmset("test", {
  demo2: "example3",
  demo3: "example4",
  demo4: "example5",
});

client.hgetall("test", function (err, object) {
  if (err) {
    console.error("error: ", err);
  }
  console.log(object);
});
