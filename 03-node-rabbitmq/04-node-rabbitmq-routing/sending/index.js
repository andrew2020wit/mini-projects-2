var amqp = require("amqplib/callback_api");

const messageBase = "messageN";
const exchangeName = "direct_logs";
const severity = "info";

function sendMessage(exchangeName, severity, messageText) {
  amqp.connect("amqp://localhost", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      channel.assertExchange(exchangeName, "direct", {
        durable: false,
      });

      channel.publish(exchangeName, severity, Buffer.from(messageText));

      console.log(" [x] Sent %s: '%s'", severity, messageText);
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
  let severity2 = severity;
  if (count % 2 !== 0) {
    severity2 = "info2";
  }
  sendMessage(exchangeName, severity2, messageBase + "-" + count);
}, 100);
