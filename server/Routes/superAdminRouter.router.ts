import express from "express";
import { protectSuperAdmin } from "../middleware/protectSuperAdmin.js";
import { deleteUser, getAgencys, getDashboard, getReservations, getUserReservations, getUsers } from "../Controller/superAdmin.controller.js";

const superAdminRouter = express.Router();

superAdminRouter.get("/get-users", getUsers);
superAdminRouter.get("/get-user-reservations", getUserReservations);
superAdminRouter.get("/get-agencys", getAgencys);
superAdminRouter.get("/get-dashboard", getDashboard);
superAdminRouter.get("/get-reservations", getReservations);
superAdminRouter.delete("/delete-user", deleteUser);

export default superAdminRouter;