import { Request, Response } from "express";
import { CsvObjWatcher } from "../util/csvObjWatcher"

/**
 * GET /api
 * Root route.
 */
const activities = new CsvObjWatcher('activities')

export const index = async (req: Request, res: Response): Promise<void> => {
    console.info(activities.records().length);
    res.json({ status: 200, message: 'ok', record: activities.records()[0] });
};
