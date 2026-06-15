"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinstonLoggerService = void 0;
var common_1 = require("@nestjs/common");
var winston = __importStar(require("winston"));
var WinstonLoggerService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var WinstonLoggerService = _classThis = /** @class */ (function () {
        function WinstonLoggerService_1(configService) {
            var _a;
            var _b, _c, _d;
            this.configService = configService;
            var logLevel = ((_b = this.configService) === null || _b === void 0 ? void 0 : _b.get('logging.level')) || 'debug';
            var logFormat = ((_c = this.configService) === null || _c === void 0 ? void 0 : _c.get('logging.format')) || 'pretty';
            var nodeEnv = ((_d = this.configService) === null || _d === void 0 ? void 0 : _d.get('app.nodeEnv')) || 'development';
            var formats = [
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
                winston.format.errors({ stack: true }),
            ];
            if (logFormat === 'json' || nodeEnv === 'production') {
                formats.push(winston.format.json());
            }
            else {
                formats.push(winston.format.colorize(), winston.format.printf(function (_a) {
                    var timestamp = _a.timestamp, level = _a.level, message = _a.message, context = _a.context, correlationId = _a.correlationId, meta = __rest(_a, ["timestamp", "level", "message", "context", "correlationId"]);
                    var ctx = context ? "[".concat(context, "]") : '';
                    var corrId = correlationId ? "[".concat(correlationId, "]") : '';
                    var metaStr = Object.keys(meta).length > 0 ? " ".concat(JSON.stringify(meta)) : '';
                    return "".concat(timestamp, " ").concat(level, " ").concat(corrId).concat(ctx, " ").concat(message).concat(metaStr);
                }));
            }
            this.logger = winston.createLogger({
                level: logLevel,
                format: (_a = winston.format).combine.apply(_a, formats),
                defaultMeta: { service: 'glow-fix-api' },
                transports: [
                    new winston.transports.Console(),
                ],
            });
            // File transports for production (disabled in Railway/Docker by default)
            if (nodeEnv === 'production' && process.env.WRITE_LOGS_TO_FILE === 'true') {
                this.logger.add(new winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                    maxsize: 10 * 1024 * 1024, // 10MB
                    maxFiles: 5,
                }));
                this.logger.add(new winston.transports.File({
                    filename: 'logs/combined.log',
                    maxsize: 10 * 1024 * 1024,
                    maxFiles: 10,
                }));
            }
        }
        WinstonLoggerService_1.prototype.log = function (message, context, meta) {
            this.logger.info(message, __assign({ context: context }, meta));
        };
        WinstonLoggerService_1.prototype.error = function (message, trace, context, meta) {
            this.logger.error(message, __assign({ context: context, trace: trace }, meta));
        };
        WinstonLoggerService_1.prototype.warn = function (message, context, meta) {
            this.logger.warn(message, __assign({ context: context }, meta));
        };
        WinstonLoggerService_1.prototype.debug = function (message, context, meta) {
            this.logger.debug(message, __assign({ context: context }, meta));
        };
        WinstonLoggerService_1.prototype.verbose = function (message, context, meta) {
            this.logger.verbose(message, __assign({ context: context }, meta));
        };
        /**
         * Log with correlation ID (for request tracing)
         */
        WinstonLoggerService_1.prototype.logWithCorrelation = function (level, message, correlationId, context, meta) {
            this.logger.log(level, message, __assign({ correlationId: correlationId, context: context }, meta));
        };
        return WinstonLoggerService_1;
    }());
    __setFunctionName(_classThis, "WinstonLoggerService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WinstonLoggerService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WinstonLoggerService = _classThis;
}();
exports.WinstonLoggerService = WinstonLoggerService;
