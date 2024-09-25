"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_agent_controller_js_1 = require("../Controller/auth.agent.controller.js");
const protectAgentRoute_js_1 = require("../middleware/protectAgentRoute.js");
const agent_controller_js_1 = require("../Controller/agent.controller.js");
const agentRouter = express_1.default.Router();
agentRouter.get("/get-agent-profile", protectAgentRoute_js_1.protectAgentRoute, agent_controller_js_1.getAgentProfile);
agentRouter.get("/get-cars", protectAgentRoute_js_1.protectAgentRoute, agent_controller_js_1.getCars);
agentRouter.get("/get-single-car/:id", protectAgentRoute_js_1.protectAgentRoute, agent_controller_js_1.getSingleCar);
agentRouter.get("/get-dashboard", protectAgentRoute_js_1.protectAgentRoute, agent_controller_js_1.getDashboard);
agentRouter.post("/register", auth_agent_controller_js_1.registerAgent);
agentRouter.post("/login", auth_agent_controller_js_1.loginAgent);
agentRouter.post("/logout", auth_agent_controller_js_1.logoutAgent);
agentRouter.post("/updateProfile", protectAgentRoute_js_1.protectAgentRoute, agent_controller_js_1.updateAgentProfile);
agentRouter.put("/edit-car", protectAgentRoute_js_1.protectAgentRoute, agent_controller_js_1.editVehicule);
agentRouter.delete("/delete-car/:car_id", protectAgentRoute_js_1.protectAgentRoute, agent_controller_js_1.deleteCar);
// this is for stripe
//agentRouter.post("/payment", protectAgentRoute, createPaymentSession);
//agentRouter.post("/hooks", express.raw({ type: "application/json" }), webHooks);
exports.default = agentRouter;
