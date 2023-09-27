import { Router } from "express"
import * as mediaController from "../controllers/media"
import * as activitiesController from "../controllers/activities"
import * as apiActivityController from "../controllers/apiActivity"
import httpProxy from "express-http-proxy"
//import express from "express"

export const routes = Router()

routes.get("/media/*", mediaController.show)
routes.get("/activities/*", activitiesController.show)
routes.get("/api/activity/", apiActivityController.index)
routes.get("/api/activity/:activityId", apiActivityController.show)

const proxy = httpProxy("http://frontend:3888")

if (process.env.NODE_ENV !== "production") {
  routes.get("*", proxy)
}
