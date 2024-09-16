import express from "express";
import { getAgentState } from "../middleware/checkAgent";

const checkAgent = express.Router();

checkAgent.post("/", getAgentState);

export default checkAgent;