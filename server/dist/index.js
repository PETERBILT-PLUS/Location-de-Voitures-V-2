"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const connectToDatabase_js_1 = require("./db/connectToDatabase.js");
const dotenv_1 = require("dotenv");
const body_parser_1 = __importDefault(require("body-parser"));
const auth_router_js_1 = __importDefault(require("./Routes/auth.router.js"));
const auth_agent_router_js_1 = __importDefault(require("./Routes/auth.agent.router.js"));
const checkAgent_router_js_1 = __importDefault(require("./Routes/checkAgent.router.js"));
const cars_router_js_1 = __importDefault(require("./Routes/cars.router.js"));
const user_router_js_1 = __importDefault(require("./Routes/user.router.js"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:5173", // Set this to your frontend's domain
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/agent-state", checkAgent_router_js_1.default);
app.use("/auth", auth_router_js_1.default);
app.use("/agent", auth_agent_router_js_1.default);
app.use("/cars", cars_router_js_1.default);
app.use("/user", user_router_js_1.default);
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connectToDatabase_js_1.connectToDatabase)();
    console.log(`server is running on port ${PORT}`);
}));
