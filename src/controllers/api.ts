import { Request, Response } from "express";
import { CsvObjWatcher } from "../util/csvObjWatcher"

/**
 * GET /api
 * Root route.
 */
export const index = async (req: Request, res: Response): Promise<void> => {
    const activities = new CsvObjWatcher('activities')
    const records = await activities.processFile();
    console.info(records);
    res.json({ status: 200, message: `ok - ${activities.output()}` });
};
