import express from "express";
import swaggerSpec from "./config/swagger";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import columnRoutes from "./routes/column.routes";
import taskRoutes from "./routes/task.routes";


const app = express();


app.use(cors());
app.use(express.json());

app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec));


app.use("/api/auth", authRoutes);

app.use("/api/projects",projectRoutes);

app.use("/api/columns",columnRoutes);

app.use("/api/tasks",taskRoutes);
app.get("/",(req,res)=>{
 res.json({
  message:"TaskFlow API running successfully"
 });
});


export default app;