var amqp = require("amqplib/callback_api");
const cluster = require("cluster");

const exchangeName = "logs";

const pid = process.pid;

if (cluster.isMaster) {
  for (let i = 0; i < 4; i++) {
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

      channel.assertExchange(exchangeName, "fanout", {
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
          channel.bindQueue(q.queue, exchangeName, "");

          channel.consume(
            q.queue,
            function (msg) {
              if (msg.content) {
                console.log(" [x] %s", msg.content.toString());
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
