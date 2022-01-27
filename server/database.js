module.exports = function () {
  const dbConfig = require("./config/db.js");
  const pgp = require("pg-promise")();
  const db = pgp(`postgres://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.db}`);

  if (!db) {
    throw new Exception("Couldn't connect to database. Check your connection string");
  }
  console.log(db);

  this.getEmployees = function () {
    return db.any('SELECT * FROM employees');
  }
}
