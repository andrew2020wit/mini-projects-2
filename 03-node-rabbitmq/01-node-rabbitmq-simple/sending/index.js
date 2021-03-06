var amqp = require("amqplib/callback_api");

const queueName = "queueN1";
const messageBase = "messageN";
let count = 0;

function sendMessage(queueName, message) {
  amqp.connect("amqp://localhost", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      channel.assertQueue(queueName, {
        durable: false,
      });

      channel.sendToQueue(queueName, Buffer.from(message));
      console.log(" [x] Sent %s", message);
    });
    setTimeout(function () {
      connection.close();
    }, 500);
  });
}

const int = setInterval(() => {
  count++;
  if (count > 10) {
    clearTimeout(int);
  }
  sendMessage(queueName, messageBase + count);
}, 1000);
