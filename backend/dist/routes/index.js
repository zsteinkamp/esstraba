"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const mediaController = __importStar(require("../controllers/media"));
const activitiesController = __importStar(require("../controllers/activities"));
const apiActivityController = __importStar(require("../controllers/apiActivity"));
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
//import express from "express"
exports.routes = (0, express_1.Router)();
exports.routes.get("/media/*", mediaController.show);
exports.routes.get("/activities/*", activitiesController.show);
exports.routes.get("/api/activity/", apiActivityController.index);
exports.routes.get("/api/activity/:activityId", apiActivityController.show);
if (process.env.NODE_ENV !== "production") {
    exports.routes.get("*", (0, express_http_proxy_1.default)("http://frontend:3000"));
}
// else {
//  routes.get("*", express.static("/app/dist_frontend/"))
//}
//# sourceMappingURL=index.js.map