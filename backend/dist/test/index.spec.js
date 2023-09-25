"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
describe("GET /", () => {
    it("should return 200 OK", () => {
        return (0, supertest_1.default)(app_1.app).get("/")
            .expect(200);
    });
    it("should return Welcome to Express", (done) => {
        return (0, supertest_1.default)(app_1.app).get("/")
            .end(function (err, res) {
            expect(res.text).toContain("Welcome to Express");
            done();
        });
    });
});
//# sourceMappingURL=index.spec.js.map