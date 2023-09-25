"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
describe("Error page", () => {
    it("should return 404 for not existing page", () => {
        return (0, supertest_1.default)(app_1.app).get("/fake-page")
            .expect(404);
    });
});
//# sourceMappingURL=error.spec.js.map