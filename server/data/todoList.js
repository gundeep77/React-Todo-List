import { ObjectId } from "mongodb";
import moment from "moment";
import { todoList } from "../config/mongoCollections.js";
import {
  badRequestError,
  internalServerError,
  notFoundError,
} from "../helpers/wrappers.js";
// import todoListModel from "../Models/todoList.js";

const getAllTasks = async () => {
  const taskCollection = await todoList();
  const allTasks = await taskCollection.find().toArray();
  return allTasks;
};

const deleteAll = async () => {
  const taskCollection = await todoList();
  taskCollection.deleteMany({});
  return { deletedAll: true };
};

const getTaskById = async (taskId) => {
  taskId = taskId.trim();
  const taskCollection = await todoList();
  const taskById = await taskCollection.findOne({ _id: new ObjectId(taskId) });
  if (taskById === null) throw notFoundError("No task with this ID exists!");
  taskById._id = taskById._id.toString();
  return taskById;
};

const newTask = async (task) => {
  const taskCollection = await todoList();
  const createdTask = {
    task: task,
    completed: false,
    addedDate: moment().format("MMM Do"),
  };
  const insertedInfo = taskCollection.insertOne(createdTask);
  if (insertedInfo.insertedCount === 0)
    throw internalServerError("Could not add task to the todo list!");
  return createdTask;
};

const editTask = async (taskId, updatedTask, updatedStatus) => {
  taskId = taskId.trim();
  const updatedTaskObj = {
    task: updatedTask,
    completed: updatedStatus,
  };
  const taskCollection = await todoList();
  const updateInfo = await taskCollection.updateOne(
    { _id: new ObjectId(taskId) },
    { $set: updatedTaskObj }
  );
  if (updateInfo.modifiedCount === 0)
    throw badRequestError("No change in the task!");
  return await getTaskById(taskId);
};

const deleteTask = async (taskId) => {
  taskId = taskId.trim();

  const taskById = await getTaskById(taskId);
  if (taskById === null) throw notFoundError("No task with this ID exists!");

  const taskCollection = await todoList();
  const deleteInfo = taskCollection.deleteOne({_id: new ObjectId(taskId)});

  if (deleteInfo.deletedCount === 0)
    throw internalServerError("Could not delete task!");
  return { taskById, deleted: true };
};

export { getAllTasks, getTaskById, newTask, editTask, deleteTask, deleteAll };
