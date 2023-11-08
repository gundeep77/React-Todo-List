import todoListRoutes from "./todoList.js";

const constructorMethod = (app) => {
  app.use("/", todoListRoutes);

  app.use("*", (req, res) => {
    res.status(404).send("Page Not Found!");
  });
};

export default constructorMethod;
