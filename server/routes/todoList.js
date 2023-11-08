import express from "express";
import {
  deleteAll,
  deleteTask,
  editTask,
  getAllTasks,
  getTaskById,
  newTask,
} from "../data/todoList.js";
const router = express.Router();

// display all the task
router
  .route("/todoList")
  .get(async (req, res) => {
    try {
      const allTasks = await getAllTasks();
      res.json(allTasks);
    } catch (error) {
      res.status(error.code).send(error.message);
    }
  })
// upload a task
  .post(async (req, res) => {
    try {
      const { task } = req.body;
      const createdTask = await newTask(task);
      res.json(createdTask);
    } catch (error) {
      res.status(error.code).send(error.message);
    }
  })
  // clear the list (delete all tasks)
  .delete(async (req, res) => {
    try {
      const deleteInfo = await deleteAll();
      res.json(deleteInfo);
    } catch (error) {
      res.status(error.code).send(error.message);
    }
  });

router
  .route("/todolist/:taskId")
  // get a task with a particular id
  .get(async (req, res) => {
    try {
      console.log(req.params.taskId);
      const taskById = await getTaskById(req.params.taskId);
      res.json(taskById);
    } catch (error) {
      res.status(error.code).send(error.message);
    }
  })
// edit a task
  .put(async (req, res) => {
    try {
      const oldTask = await getTaskById(req.params.taskId);
      const { task } = req.body;
      let editedTask;
      if (task === oldTask.task)
        editedTask = await editTask(
          req.params.taskId,
          task,
          !oldTask.completed
        );
      else if (task !== oldTask.task)
        editedTask = await editTask(
          req.params.taskId,
          task,
          oldTask.completed
        );
      res.json(editedTask);
    } catch (error) {
      console.log(error);
      res.status(error.code).send(error.message);
    }
  })

  // delete a task with a particular id
  .delete(async (req, res) => {
    try {
      await getTaskById(req.params.taskId);
      const deleteInfo = await deleteTask(req.params.taskId);
      res.json(deleteInfo);
    } catch (error) {
      res.status(error.code).send(error.message);
    }
  });

export default router;
