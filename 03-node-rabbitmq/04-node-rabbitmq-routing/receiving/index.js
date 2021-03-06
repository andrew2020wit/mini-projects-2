var amqp = require("amqplib/callback_api");
const cluster = require("cluster");

const exchangeName = "direct_logs";
const severity = "info";

if (cluster.isMaster) {
  for (let i = 0; i < 2; i++) {
    cluster.fork(); //create worker
  }
}

if (cluster.isWorker) {
  console.log(`Worker ${process.pid} started`);
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

      channel.assertQueue(
        "",
        {
          exclusive: true,
        },
        function (error2, q) {
          if (error2) {
            throw error2;
          }
          console.log(
            " [*] Waiting for messages in %s. To exit press CTRL+C",
            q.queue
          );
          channel.bindQueue(q.queue, exchangeName, severity);

          channel.consume(
            q.queue,
            function (msg) {
              if (msg.content) {
                console.log(
                  " [x] %s: '%s'",
                  msg.fields.routingKey,
                  msg.content.toString()
                );
              }
            },
            {
              noAck: true,
            }
          );
        }
      );
    });
  });
}
