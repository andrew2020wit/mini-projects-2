var amqp = require("amqplib/callback_api");

const messageBase = "messageN";
const exchangeName = "logs";

function sendMessage(exchangeName, messageText) {
  amqp.connect("amqp://localhost", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      channel.assertExchange(exchangeName, "fanout", {
        durable: false,
      });
      channel.publish(exchangeName, "", Buffer.from(messageText));

      console.log(" [x] Sent %s", messageText);
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
  sendMessage(exchangeName, messageBase + "-" + count);
}, 100);
