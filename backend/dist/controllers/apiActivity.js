"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.show = exports.index = void 0;
const csvObjWatcher_1 = require("../util/csvObjWatcher");
/**
 * GET /api
 * Root route.
 */
const activities = new csvObjWatcher_1.CsvObjWatcher("activities");
const index = async (req, res) => {
    res.json({
        activities: activities.records(),
    });
};
exports.index = index;
const show = async (req, res) => {
    const activity = activities.byId(req.params.activityId);
    res.json({ activity });
};
exports.show = show;
//# sourceMappingURL=apiActivity.js.map