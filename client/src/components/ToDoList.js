import React, { useEffect, useState } from "react";
import axios from "axios";

function ToDoList() {
  const [taskData, setTaskData] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [count, setCount] = useState(0);
  const [addOrEdit, setAddOrEdit] = useState("Add new task");
  const [tempTaskId, setTempTaskId] = useState(undefined);
  const [updatedStatus, setUpdatedStatus] = useState(undefined);
  const [showCancelEdit, setShowCancelEdit] = useState(false);
  // const [showClearList, setShowClearList] = useState(undefined);
  let taskList = null;

  useEffect(() => {
    const getTasksData = async () => {
      try {
        const { data } = await axios.get(`/todoList`);
        setTaskData(data);
      } catch (error) {
        console.log(error);
      }
    };
    getTasksData();
  }, [count, newTask]);

  const handleAddNewTask = async (event) => {
    event.preventDefault();
    if (addOrEdit === "Edit task") {
      if (newTask.length) {
        await axios
          .put(`/todoList/${tempTaskId}`, {
            task: document.getElementById("newTask").value,
            completed: updatedStatus,
          })
          .then(() => {
            setCount(count + 1);
            setNewTask("");
            document.getElementById("newTask").value = "";
            setAddOrEdit("Add new task");
            setShowCancelEdit(false);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      if (newTask.length) {
        await axios
          .post("/todoList", { task: event.target[0].value })
          .then(() => {
            setCount(count + 1);
            setNewTask("");
            document.getElementById("newTask").value = "";
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };

  const handleEditTask = async (taskId) => {
    taskData.forEach((task) => {
      if (task._id === taskId) {
        document.getElementById("newTask").value = task.task;
        setUpdatedStatus(task.completed);
      }
    });
    setShowCancelEdit(true);
    setCount(count + 1);
    setTempTaskId(taskId);
    setAddOrEdit("Edit task");
  };

  const handleNewTaskChange = (event) => {
    if (!event.target.value.trim().length) {
      setCount(count + 1);
      setNewTask("");
    } else {
      setCount(count + 1);
      setNewTask(event.target.value);
    }
  };

  const handleDeleteAll = async () => {
    await axios.delete("/todoList");
    setCount(count + 1);
    setAddOrEdit("Add new task");
    setShowCancelEdit(false);
    // setShowClearList(false);
    document.getElementById("newTask").value = "";
  };

  const handleDeleteTask = async (taskId) => {
    await axios.delete(`/todoList/${taskId}`);
    setCount(count + 1);
    setAddOrEdit("Add new task");
    setShowCancelEdit(false);
    document.getElementById("newTask").value = "";
  };

  const handleStatusChange = async (taskId) => {
    let updatedTask;
    taskData.forEach((task) => {
      if (task._id === taskId) {
        task.completed = !task.completed;
        updatedTask = task;
      }
    });
    await axios.put(`/todoList/${taskId}`, updatedTask);
    setCount(count + 1);
  };

  const handleCancelEdit = () => {
    setShowCancelEdit(false);
    setAddOrEdit("Add new task");
    document.getElementById("newTask").value = "";
  };

  // building a task including task status, task content, task date, delete and edit buttons to render the component
  const buildTask = (task) => {
    return (
      <div key={task._id} className="container">
        <div className="task-status">
          <input
            checked={task.completed}
            onChange={() => handleStatusChange(task._id)}
            type="checkbox"
          />
        </div>
        {task.completed ? (
          <div className="task-content">
            <s>{task.task}</s>
          </div>
        ) : (
          <div className="task-content">{task.task}</div>
        )}
        <div className="task-date">{task.addedDate}</div>
        <div>
          <button
            className="edit-task"
            onClick={() => handleEditTask(task._id)}
          >
            Edit
          </button>
        </div>
        <div className="all-buttons">
          <button
            className="delete-task"
            onClick={() => {
              handleDeleteTask(task._id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  taskList = taskData.length ? (
    <table className="tasks-table">
      <tbody>
        <tr>
          <div className="task-list-box">
            <td>{taskData.map((task) => buildTask(task))}</td>
          </div>
        </tr>
      </tbody>
    </table>
  ) : (
    <h4>
      <br />
      No pending tasks!
    </h4>
  );

  return (
    <>
      <div className="header-things">
        <form onSubmit={handleAddNewTask}>
          <input
            autoFocus={true}
            onChange={handleNewTaskChange}
            placeholder="List your tasks here..."
            type="text"
            id="newTask"
            autoComplete="off"
          />
          <button id="addTask" type="submit">
            {addOrEdit}
          </button>
          {showCancelEdit ? (
            <button id="cancelEdit" onClick={handleCancelEdit}>
              Cancel Edit
            </button>
          ) : (
            <></>
          )}
        </form>
        {taskData.length ? (
          <button id="clearList" onClick={handleDeleteAll}>
            Clear List
          </button>
        ) : (
          <></>
        )}
      </div>
      <br />
      <br />
      {taskList}
    </>
  );
}
export default ToDoList;
