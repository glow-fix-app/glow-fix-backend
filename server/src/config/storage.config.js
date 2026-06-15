"use strict";
// Register this in AppModule's ConfigModule.load array:
//   ConfigModule.forRoot({ load: [storageConfig, jwtConfig, …] })
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('storage', function () {
    var _a, _b, _c, _d, _e;
    return ({
        endpoint: process.env.STORAGE_ENDPOINT, // omit for native AWS S3
        region: (_a = process.env.STORAGE_REGION) !== null && _a !== void 0 ? _a : 'us-east-1',
        bucket: (_b = process.env.STORAGE_BUCKET) !== null && _b !== void 0 ? _b : '',
        keyId: (_c = process.env.STORAGE_KEY_ID) !== null && _c !== void 0 ? _c : '',
        keySecret: (_d = process.env.STORAGE_KEY_SECRET) !== null && _d !== void 0 ? _d : '',
        cdnBase: (_e = process.env.STORAGE_CDN_BASE) !== null && _e !== void 0 ? _e : '',
    });
});
