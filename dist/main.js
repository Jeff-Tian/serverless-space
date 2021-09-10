"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@nestjs/core");
const serverless_express_1 = __importDefault(require("@vendia/serverless-express"));
const app_module_1 = require("./app.module");
let server;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    return serverless_express_1.default({ app: expressApp });
}
const handler = async (event, context, callback) => {
    server = server !== null && server !== void 0 ? server : (await bootstrap());
    return server(event, context, callback);
};
exports.handler = handler;
//# sourceMappingURL=main.js.map