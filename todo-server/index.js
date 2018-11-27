const express = require("express");
const app = express();
const axios = require("axios");

const mongoose = require("mongoose");
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/to-do-list",
  { useNewUrlParser: true }
);

const TaskModel = mongoose.model("Tâche", {
  title: String
});
