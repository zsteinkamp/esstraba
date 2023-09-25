import { Request, Response } from "express"
import { CsvObjWatcher } from "../util/csvObjWatcher"

/**
 * GET /api
 * Root route.
 */
const activities = new CsvObjWatcher("activities")

export const index = async (req: Request, res: Response): Promise<void> => {
  res.json({
    activities: activities.records(),
  })
}

export const show = async (req: Request, res: Response): Promise<void> => {
  const activity = activities.byId(req.params.activityId)
  res.json({ activity })
}
