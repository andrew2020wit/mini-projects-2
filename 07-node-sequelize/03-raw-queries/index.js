const { Sequelize, DataTypes } = require("sequelize");
const { QueryTypes } = require("sequelize");

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

    const [results, metadata] = await sequelize.query("SELECT * FROM `users`");
    //for MSSQL and MySQL it will be two references to the same object.
    console.log("results, metadata: ", results, metadata);

    // use QueryTypes
    const users = await sequelize.query("SELECT * FROM `users`", {
      type: QueryTypes.SELECT,
    });
    // We didn't need to destructure the result here -
    // the results were returned directly
    console.log("use QueryTypes, users", users);

    // Replacements
    // ?
    const users2 = await sequelize.query(
      "SELECT * FROM `users` WHERE name = ?",
      {
        replacements: ["Bob"],
        type: QueryTypes.SELECT,
      }
    );
    console.log("Bob: ", users2);

    // bind $1
    const users22 = await sequelize.query(
      "SELECT * FROM `users` WHERE name = $1",
      {
        bind: ["Bob"],
        type: QueryTypes.SELECT,
      }
    );
    console.log("bind, Bob: ", users22);

    // :name
    const users3 = await sequelize.query(
      "SELECT * FROM `users` WHERE name = :name",
      {
        replacements: { name: "Dan" },
        type: QueryTypes.SELECT,
      }
    );
    console.log("Dan: ", users3);

    sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    sequelize.close();
  }
}

main();
