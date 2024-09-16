import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectToDatabase } from "./db/connectToDatabase.js";
import { config } from "dotenv";
import bodyParser from "body-parser";
import authRouter from "./Routes/auth.router.js";
import agentRouter from "./Routes/auth.agent.router.js";
import checkAgent from "./Routes/checkAgent.router.js";
import carsRouter from "./Routes/cars.router.js";
import userRouter from "./Routes/user.router.js";
config();

const app: Express = express();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173", // Set this to your frontend's domain
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/agent-state", checkAgent);
app.use("/auth", authRouter);
app.use("/agent", agentRouter);
app.use("/cars", carsRouter);
app.use("/user", userRouter);

app.listen(PORT, async () => {
    await connectToDatabase();
    console.log(`server is running on port ${PORT}`);
});