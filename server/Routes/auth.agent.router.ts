import express from "express";
import { createPaymentSession, loginAgent, logoutAgent, registerUser, webHooks } from "../Controller/auth.agent.controller.js";
import { protectAgentRoute } from "../middleware/protectAgentRoute.js";
import { deleteCar, editVehicule, getAgentProfile, getCars, getDashboard, getSingleCar, updateAgentProfile } from "../Controller/agent.controller.js";

const agentRouter = express.Router();

agentRouter.get("/get-agent-profile", protectAgentRoute, getAgentProfile);
agentRouter.get("/get-cars", protectAgentRoute, getCars);
agentRouter.get("/get-single-car/:id", protectAgentRoute, getSingleCar);
agentRouter.get("/get-dashboard", protectAgentRoute, getDashboard);
agentRouter.post("/register", registerUser);
agentRouter.post("/login", loginAgent);
agentRouter.post("/logout", logoutAgent);
agentRouter.post("/updateProfile", protectAgentRoute, updateAgentProfile);
agentRouter.put("/edit-car", protectAgentRoute, editVehicule);
agentRouter.delete("/delete-car/:car_id", protectAgentRoute, deleteCar);



// this is for stripe
agentRouter.post("/payment", protectAgentRoute, createPaymentSession);
agentRouter.post("/hooks", express.raw({ type: "application/json" }), webHooks);

export default agentRouter;