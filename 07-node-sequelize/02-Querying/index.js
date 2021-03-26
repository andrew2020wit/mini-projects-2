const { Sequelize, DataTypes } = require("sequelize");
const { Op } = require("sequelize");

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

    await User.create({ name: "Jane", age: 20 });
    await User.create({ name: "Bob", age: 20 });
    await User.create({ name: "John", age: 30 });
    await User.create({ name: "Dan", age: 30 });
    await User.create({ name: "John40", age: 40 });
    await User.create({ name: "Dan40", age: 40 });

    const usersAge30 = await User.findAll({
      attributes: ["name", "age"],
      where: { age: 30 },
    });
    console.log("usersAge30:", JSON.stringify(usersAge30, null, 2));

    const usersAge30OrBob = await User.findAll({
      attributes: ["name", "age"],
      where: { [Op.or]: [{ age: 30 }, { name: "Bob" }] },
    });
    console.log("usersAge30OrBob:", JSON.stringify(usersAge30OrBob, null, 2));

    const usersAgeMoreThan20 = await User.findAll({
      attributes: ["name", "age"],
      where: { age: { [Op.gt]: 20 } },
    });
    console.log(
      "usersAgeMoreThan20:",
      JSON.stringify(usersAgeMoreThan20, null, 2)
    );

    sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    sequelize.close();
  }
}

main();
