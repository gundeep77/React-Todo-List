import mongoose from "mongoose";

const todoListSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  complete: {
    type: Boolean,
    default: false,
  },
});

const todoListModel = mongoose.model("todoList", todoListSchema);

export default todoListModel;
