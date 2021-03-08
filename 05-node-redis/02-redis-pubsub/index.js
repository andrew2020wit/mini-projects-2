const redis = require("redis");

const subscriber = redis.createClient();
const subscriber2 = redis.createClient();
const publisher = redis.createClient();

let messageCount = 0;
let setIntervalID;

// publish
subscriber.on("subscribe", function (channel, count) {
  for (let i = 1; i < 10; i++) {
    publisher.publish("channelNameN1", "messageN" + i);
  }

  setIntervalID = setInterval(() => {
    publisher.publish("channelNameN2", "messageN" + messageCount);
  }, 100);
});

// subscriber1
subscriber.on("message", function (channel, message) {
  messageCount += 1;
  console.log(
    "Subscriber received message in channel '" + channel + "': " + message
  );
  stop();
});

// subscriber2
subscriber2.on("message", function (channel, message) {
  messageCount += 1;
  console.log(
    "Subscriber2 received message in channel '" + channel + "': " + message
  );
  stop();
});

function stop() {
  if (messageCount === 20) {
    clearInterval(setIntervalID);
    subscriber.unsubscribe();
    subscriber.quit();
    subscriber2.unsubscribe();
    subscriber2.quit();
    publisher.quit();
    console.log("=== stop. ===");
  }
}

// Run subscribers
subscriber.subscribe("channelNameN1");
subscriber2.subscribe("channelNameN2");
