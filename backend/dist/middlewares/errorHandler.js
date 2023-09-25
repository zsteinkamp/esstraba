"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorNotFoundHandler = exports.errorHandler = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const errorHandler = (err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error", { title: err.name, message: err.message });
};
exports.errorHandler = errorHandler;
const errorNotFoundHandler = (req, res, next) => {
    next((0, http_errors_1.default)(404));
};
exports.errorNotFoundHandler = errorNotFoundHandler;
//# sourceMappingURL=errorHandler.js.map