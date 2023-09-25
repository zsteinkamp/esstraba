"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const errorHandler_1 = require("./middlewares/errorHandler");
// Routes
const index_1 = require("./routes/index");
// Create Express server
exports.app = (0, express_1.default)();
exports.app.set("port", process.env.PORT || 3888);
exports.app.use((0, morgan_1.default)("dev"));
exports.app.use("/", index_1.routes);
exports.app.use(errorHandler_1.errorNotFoundHandler);
exports.app.use(errorHandler_1.errorHandler);
//# sourceMappingURL=app.js.map