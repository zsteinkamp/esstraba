import { Router } from "express";
import * as indexController from "../controllers/index";
import * as apiController from "../controllers/api";

export const routes = Router();

routes.get("/", indexController.index);
routes.get("/api", apiController.index);
