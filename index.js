const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors());

const mongoose = require("mongoose");
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/to-do-list",
  { useNewUrlParser: true }
);

const TaskModel = mongoose.model("Tâche", {
  title: String,
  done: {
    type: Boolean,
    default: false
  }
});

app.get("/", function(req, res) {
  TaskModel.find()
    .sort({ done: 1 })
    .exec(function(err, taskList) {
      if (err) {
        res.json({
          error: err.message
        });
      } else {
        res.json(taskList);
      }
    });
});

app.post("/create", function(req, res) {
  let task = {
    title: req.body.title,
    done: false
  };

  let newTask = new TaskModel(task);

  newTask.save(function(err, task) {
    if (err) {
      return res.json(err);
    }
    res.json(task);
  });
});

app.post("/update/:id", function(req, res) {
  TaskModel.findById(req.params.id).exec(function(err, task) {
    if (err) {
      res.json({
        error: err.message
      });
    } else {
      task.done = !task.done;
      task.save(function(err, savedTask) {
        if (err) {
          res.json({ error: err.message });
        } else {
          res.json(savedTask);
        }
      });
    }
  });
});

app.post("/delete/:id", function(req, res) {
  TaskModel.findById(req.params.id).exec(function(err, task) {
    if (err) {
      res.json({
        error: err.message
      });
    } else {
      task.delete(function(err, removedTask) {
        if (err) {
          res.json({ error: err.message });
        } else {
          res.json({
            message: "task removed"
          });
        }
      });
    }
  });
});

app.listen(process.env.PORT || 3001, function() {
  console.log("Server is up!");
});
