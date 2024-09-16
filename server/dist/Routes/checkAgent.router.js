"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAgent_1 = require("../middleware/checkAgent");
const checkAgent = express_1.default.Router();
checkAgent.post("/", checkAgent_1.getAgentState);
exports.default = checkAgent;
