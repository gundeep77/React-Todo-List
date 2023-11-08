import React from "react";
import "./App.css"
import ToDoList from "./components/ToDoList.js";
// import Users from "./components/Users.js";

function App() {
  return (
    <div style={{marginTop: "50px"}}>
      <h1>Techolution's Todo List</h1>
      {/* <Users /> */}
      <ToDoList />
    </div>
  );
}

export default App;
