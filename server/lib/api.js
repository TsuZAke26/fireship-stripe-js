"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = express_1.default();
// Allow Express to stringify JSON to be interpreted correctly
exports.app.use(express_1.default.json());
// Allow other origins to call Express endpoints
const cors_1 = __importDefault(require("cors"));
exports.app.use(cors_1.default({ origin: true }));
// Test endpoint
exports.app.post("/test", (req, res) => {
    const amount = req.body.amount;
    res.status(200).send({ with_tax: amount * 1.07 });
});
//# sourceMappingURL=api.js.map