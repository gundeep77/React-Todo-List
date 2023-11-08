import express from "express";
import dotenv from "dotenv";
import configRoutes from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);

dotenv.config();

app.listen(8000, () => {
  console.log("Server listening on http://localhost:8000");
});
