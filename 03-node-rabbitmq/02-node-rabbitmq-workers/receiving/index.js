var amqp = require("amqplib/callback_api");
const cluster = require("cluster");

const queueName = "queue-workers3";

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

      channel.assertQueue(queueName, {
        durable: true,
      });

      channel.prefetch(1);

      console.log(
        " [*] Waiting for messages in %s. To exit press CTRL+C",
        queueName
      );

      channel.consume(
        queueName,
        function (msg) {
          const msg1 = JSON.parse(msg.content.toString());
          for (let i = 1; i < 10000000 * +msg1.timeMS; i++) {}
          channel.ack(msg);
          console.log(`Pid: ${pid} received:`, msg1);
        },
        {
          noAck: false,
        }
      );
    });
  });
}
