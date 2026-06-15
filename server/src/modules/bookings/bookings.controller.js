"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var multer_1 = require("multer");
var swagger_1 = require("@nestjs/swagger");
var booking_response_dto_1 = require("./dto/booking-response.dto");
var BookingsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Bookings (Client)'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Controller)({ path: 'bookings', version: '1' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _uploadBookingImages_decorators;
    var _createBooking_decorators;
    var _getMyBookings_decorators;
    var _getMyBooking_decorators;
    var _cancelBooking_decorators;
    var _rescheduleBooking_decorators;
    var BookingsController = _classThis = /** @class */ (function () {
        function BookingsController_1(bookingsService, storageService) {
            this.bookingsService = (__runInitializers(this, _instanceExtraInitializers), bookingsService);
            this.storageService = storageService;
        }
        // ── Upload booking problem photos ──────────────────────────────────────────
        BookingsController_1.prototype.uploadBookingImages = function (files) {
            return __awaiter(this, void 0, void 0, function () {
                var uploads;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!files || files.length === 0) {
                                throw new common_1.BadRequestException('At least one image file is required');
                            }
                            return [4 /*yield*/, Promise.all(files.map(function (file) {
                                    return _this.storageService.uploadImage(file.buffer, 'bookings/problems', {
                                        width: 1200,
                                        height: 1200,
                                        quality: 85,
                                    });
                                }))];
                        case 1:
                            uploads = _a.sent();
                            return [2 /*return*/, {
                                    urls: uploads.map(function (r) { return r.url; }),
                                    images: uploads.map(function (r) { return ({ url: r.url, storageKey: r.storageKey }); }),
                                }];
                    }
                });
            });
        };
        BookingsController_1.prototype.createBooking = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bookingsService.createBooking(user.id, dto)];
                });
            });
        };
        BookingsController_1.prototype.getMyBookings = function (user, query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bookingsService.getClientBookings(user.id, query)];
                });
            });
        };
        BookingsController_1.prototype.getMyBooking = function (user, bookingId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bookingsService.getClientBooking(user.id, bookingId)];
                });
            });
        };
        BookingsController_1.prototype.cancelBooking = function (user, bookingId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bookingsService.cancelBookingByClient(user.id, bookingId, dto)];
                });
            });
        };
        BookingsController_1.prototype.rescheduleBooking = function (user, bookingId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bookingsService.rescheduleBookingByClient(user.id, bookingId, dto)];
                });
            });
        };
        return BookingsController_1;
    }());
    __setFunctionName(_classThis, "BookingsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _uploadBookingImages_decorators = [(0, common_1.Post)('upload-images'), (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 5, {
                storage: (0, multer_1.memoryStorage)(),
                limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
                fileFilter: function (_req, file, cb) {
                    if (!file.mimetype.startsWith('image/')) {
                        return cb(new common_1.BadRequestException('Only image files are allowed'), false);
                    }
                    cb(null, true);
                },
            })), (0, swagger_1.ApiOperation)({ summary: 'Upload problem photos for a booking (max 5)' }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        images: { type: 'array', items: { type: 'string', format: 'binary' } },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Returns uploaded image URLs and storage keys' })];
        _createBooking_decorators = [(0, common_1.Post)(['', 'create']), (0, swagger_1.ApiOperation)({ summary: 'Create a new booking request (Client)' }), (0, swagger_1.ApiResponse)({ status: 201, type: booking_response_dto_1.BookingResponseDto })];
        _getMyBookings_decorators = [(0, common_1.Get)(['', 'my-bookings']), (0, swagger_1.ApiOperation)({ summary: 'List client\'s own bookings (Client)' }), (0, swagger_1.ApiResponse)({ status: 200 })];
        _getMyBooking_decorators = [(0, common_1.Get)([':bookingId', 'my-bookings/:bookingId']), (0, swagger_1.ApiOperation)({ summary: 'Get details of a client\'s booking (Client)' }), (0, swagger_1.ApiResponse)({ status: 200, type: booking_response_dto_1.BookingResponseDto })];
        _cancelBooking_decorators = [(0, common_1.Patch)([':bookingId/cancel', 'my-bookings/:bookingId/cancel']), (0, swagger_1.ApiOperation)({ summary: 'Cancel a booking request (Client)' }), (0, swagger_1.ApiResponse)({ status: 200, type: booking_response_dto_1.BookingResponseDto })];
        _rescheduleBooking_decorators = [(0, common_1.Patch)([':bookingId/reschedule', 'my-bookings/:bookingId/reschedule']), (0, swagger_1.ApiOperation)({ summary: 'Reschedule a booking request (Client)' }), (0, swagger_1.ApiResponse)({ status: 200, type: booking_response_dto_1.BookingResponseDto })];
        __esDecorate(_classThis, null, _uploadBookingImages_decorators, { kind: "method", name: "uploadBookingImages", static: false, private: false, access: { has: function (obj) { return "uploadBookingImages" in obj; }, get: function (obj) { return obj.uploadBookingImages; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createBooking_decorators, { kind: "method", name: "createBooking", static: false, private: false, access: { has: function (obj) { return "createBooking" in obj; }, get: function (obj) { return obj.createBooking; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyBookings_decorators, { kind: "method", name: "getMyBookings", static: false, private: false, access: { has: function (obj) { return "getMyBookings" in obj; }, get: function (obj) { return obj.getMyBookings; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyBooking_decorators, { kind: "method", name: "getMyBooking", static: false, private: false, access: { has: function (obj) { return "getMyBooking" in obj; }, get: function (obj) { return obj.getMyBooking; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _cancelBooking_decorators, { kind: "method", name: "cancelBooking", static: false, private: false, access: { has: function (obj) { return "cancelBooking" in obj; }, get: function (obj) { return obj.cancelBooking; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _rescheduleBooking_decorators, { kind: "method", name: "rescheduleBooking", static: false, private: false, access: { has: function (obj) { return "rescheduleBooking" in obj; }, get: function (obj) { return obj.rescheduleBooking; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BookingsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BookingsController = _classThis;
}();
exports.BookingsController = BookingsController;
