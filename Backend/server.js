import express from 'express';
import { connectDB } from './Config/db.js';
import dotenv from "dotenv"
import router from './Route/route.js';
import path from "path";
const PORT = process.env.PORT || 3000;
dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/todos", router); 
 const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/Frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
  });
}
app.listen(PORT, () => {
    connectDB();
  console.log('Server is running on port 3000');
});