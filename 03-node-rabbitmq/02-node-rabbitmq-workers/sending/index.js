var amqp = require("amqplib/callback_api");

const queueName = "queue-workers3";
const messageBase = "messageN";

function sendMessage(queueName, messageText, timeMS) {
  amqp.connect("amqp://localhost", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      channel.assertQueue(queueName, {
        durable: true,
      });

      const message = { messageText, timeMS };

      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });
      console.log(" [x] Sent %s", message);
    });
    setTimeout(function () {
      connection.close();
    }, 500);
  });
}

let count = 0;

const int = setInterval(() => {
  count++;
  if (count > 16) {
    clearInterval(int);
    return;
  }
  const tm = (count % 4) * 300;
  sendMessage(queueName, messageBase + "-" + count, tm);
}, 100);
