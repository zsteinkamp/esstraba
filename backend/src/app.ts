import express from "express"
import logger from "morgan"

import { errorHandler, errorNotFoundHandler } from "./middlewares/errorHandler"

// Routes
import { routes } from "./routes/index"
// Create Express server
export const app = express()

app.set("port", process.env.PORT || 3888)

app.use(logger("dev"))

app.use("/", routes)

app.use(errorNotFoundHandler)
app.use(errorHandler)
