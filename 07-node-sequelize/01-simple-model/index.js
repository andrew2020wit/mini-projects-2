const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("testdb", "root", "12345", {
  dialect: "mysql",
  host: "localhost",
  port: "3306",
});

const User = sequelize.define("user", {
  name: DataTypes.TEXT,
  favoriteColor: {
    type: DataTypes.TEXT,
    defaultValue: "green",
  },
  age: DataTypes.INTEGER,
  cash: DataTypes.INTEGER,
});

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true

async function main() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");

    await User.create({ name: "Jane" });

    const users = await User.findAll();
    console.log(users.every((user) => user instanceof User)); // true
    console.log("All users:", JSON.stringify(users, null, 2));

    sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    sequelize.close();
  }
}

main();
