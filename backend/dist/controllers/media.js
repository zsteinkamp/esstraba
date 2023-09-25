"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.show = void 0;
const path_1 = __importDefault(require("path"));
const show = async (req, res) => {
    console.log(req.path);
    if (req.path.match(/\.\./) || !req.path.match(/^\/media\//)) {
        res.send({ status: 404, msg: "Not Found" });
        return;
    }
    res.sendFile(path_1.default.resolve(`data/${req.path}`));
};
exports.show = show;
//# sourceMappingURL=media.js.map