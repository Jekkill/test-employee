const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const dbConfig = require("./config/db");
const pgp = require("pg-promise")();

const Office = require('./model/office');
const Employee = require('./model/employee');
const Tag = require('./model/tag');

const app = express();
const connection = pgp(`postgres://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.db}`);
const office = new Office(connection);
const employee = new Employee(connection);
const tag = new Tag(connection);

// middle-ware handler;
app.use(bodyParser.json());
app.use(cors());

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// Office CRUD part
app.get("/offices", async (req, res, next) => {
  try {
    const data = await office.getList();
    sendResult(data, res);
  }
  catch (e) {
    sendError(e, res);
  }
});

app.get("/offices/:id", async (req, res, next) => {
  try {
    const officeId = req.params.id;
    const data = await office.getOne(officeId);
    sendResult(data[0], res);
  }
  catch (e) {
    sendError(e, res);
  }
});

app.post("/offices", async (req, res, next) => {
  try {
    const officeName = req.body.name;
    const data = await office.insertOne(officeName);
    sendResult(data, res);
  }
  catch (e) {
    sendError(e, res);
  }
});

app.put("/offices/:id", async (req, res, next) => {
  try {
    const officeId = req.params.id;
    const officeName = req.body.name;
    const data = await office.updateOne(officeName, officeId);
    sendResult(data, res);
  }
  catch (e) {
    sendError(e, res);
  }
});

app.delete("/offices/:id", async (req, res, next) => {
  try {
    const officeId = req.params.id;
    const data = await office.removeOne(officeId);
    sendResult(data, res);
  }
  catch (e) {
    sendError(e, res);
  }
});


// Employee CRUD part
app.get("/employees", async (req, res, next) => {
  try {
    const data = await employee.getList();
    sendResult(data, res);
  }
  catch (e) {
    sendError(e, res);
  }
});

app.get("/employees/:id", async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const data = await employee.getOne(employeeId);
    sendResult(data[0], res);
  }
  catch (e) {
    sendError(e, res);
  }
});

app.post("/employees", async (req, res, next) => {
  try {
    const body = req.body;
    const data = await employee.insertOne(body);
    sendResult(data, res);
  } catch (e) {
    sendError(e, res);
  }
});

app.put('/employees', async (req, res, next) => {
  try {
    const body = req.body;
    const data = await employee.updateOne(body.data, body.oldData);
    sendResult(data, res);
  } catch (e) {
    sendError(e, res);
  }
});

app.delete("/employees/:id", async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const data = await employee.removeOne(employeeId);
    sendResult(data, res);
  }
  catch (e) {
    sendError(e, res);
  }
});


// Tags CRUD part
app.get("/tags", async (req, res, next) => {
  try {
    const data = await tag.getList();
    sendResult(data, res);
  } catch (e) {
    sendError(e, res);
  }
});

app.get("/tags/:id", async (req, res, next) => {
  try {
    const tagId = req.params.id;
    const data = await tag.getOne(tagId);
    sendResult(data[0], res);
  }
  catch (e) {
    sendError(e, res);
  }
});

app.post("/tags", async (req, res, next) => {
  try {
    const tagName = req.body.name;
    const data = await tag.insertOne(tagName);
    sendResult(data, res);
  }
  catch (e) {
    sendError(e, res);
  }
});

app.put("/tags/:id", async (req, res, next) => {
  try {
    const tagId = req.params.id;
    const tagName = req.body.name;
    const data = await tag.updateOne(tagName, tagId);
    sendResult(data, res);
  }
  catch (e) {
    sendError(e, res);
  }
});

app.delete("/tags/:id", async (req, res, next) => {
  try {
    const tagId = req.params.id;
    const data = await tag.removeOne(tagId);
    sendResult(data, res);
  }
  catch (e) {
    sendError(e, res);
  }
});

function sendResult(data, res) {
  res.json(data);
}

function sendError(error, res) {
  res.status(500).send({
    message: error.message
  });
}