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
exports.BookingsManagerController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var booking_response_dto_1 = require("./dto/booking-response.dto");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var BookingsManagerController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Bookings (Manager)'), (0, swagger_1.ApiBearerAuth)(), (0, roles_decorator_1.Roles)('MANAGER'), (0, common_1.Controller)({ path: 'manager/bookings', version: '1' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getManagerBookings_decorators;
    var _getManagerBooking_decorators;
    var _reviewBooking_decorators;
    var _updateStatus_decorators;
    var _rescheduleBooking_decorators;
    var _cancelBooking_decorators;
    var BookingsManagerController = _classThis = /** @class */ (function () {
        function BookingsManagerController_1(bookingsService) {
            this.bookingsService = (__runInitializers(this, _instanceExtraInitializers), bookingsService);
        }
        BookingsManagerController_1.prototype.getManagerBookings = function (user, query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bookingsService.getManagerBookings(user.id, query)];
                });
            });
        };
        BookingsManagerController_1.prototype.getManagerBooking = function (user, bookingId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bookingsService.getManagerBooking(user.id, bookingId)];
                });
            });
        };
        BookingsManagerController_1.prototype.reviewBooking = function (user, bookingId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bookingsService.reviewBookingByManager(user.id, bookingId, dto)];
                });
            });
        };
        BookingsManagerController_1.prototype.updateStatus = function (user, bookingId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bookingsService.updateBookingStatusByManager(user.id, bookingId, dto)];
                });
            });
        };
        BookingsManagerController_1.prototype.rescheduleBooking = function (user, bookingId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bookingsService.rescheduleBookingByManager(user.id, bookingId, dto)];
                });
            });
        };
        BookingsManagerController_1.prototype.cancelBooking = function (user, bookingId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bookingsService.cancelBookingByManager(user.id, bookingId, dto)];
                });
            });
        };
        return BookingsManagerController_1;
    }());
    __setFunctionName(_classThis, "BookingsManagerController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getManagerBookings_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'List provider\'s bookings (Manager)' }), (0, swagger_1.ApiResponse)({ status: 200 })];
        _getManagerBooking_decorators = [(0, common_1.Get)(':bookingId'), (0, swagger_1.ApiOperation)({ summary: 'Get details of a booking (Manager)' }), (0, swagger_1.ApiResponse)({ status: 200, type: booking_response_dto_1.BookingResponseDto })];
        _reviewBooking_decorators = [(0, common_1.Patch)(':bookingId/review'), (0, swagger_1.ApiOperation)({ summary: 'Accept or reject booking request and optionally negotiate prices (Manager)' }), (0, swagger_1.ApiResponse)({ status: 200, type: booking_response_dto_1.BookingResponseDto })];
        _updateStatus_decorators = [(0, common_1.Patch)(':bookingId/status'), (0, swagger_1.ApiOperation)({ summary: 'Update progress status of a booking (Manager)' }), (0, swagger_1.ApiResponse)({ status: 200, type: booking_response_dto_1.BookingResponseDto })];
        _rescheduleBooking_decorators = [(0, common_1.Patch)(':bookingId/reschedule'), (0, swagger_1.ApiOperation)({ summary: 'Reschedule booking date & time (Manager)' }), (0, swagger_1.ApiResponse)({ status: 200, type: booking_response_dto_1.BookingResponseDto })];
        _cancelBooking_decorators = [(0, common_1.Patch)(':bookingId/cancel'), (0, swagger_1.ApiOperation)({ summary: 'Cancel booking (Manager)' }), (0, swagger_1.ApiResponse)({ status: 200, type: booking_response_dto_1.BookingResponseDto })];
        __esDecorate(_classThis, null, _getManagerBookings_decorators, { kind: "method", name: "getManagerBookings", static: false, private: false, access: { has: function (obj) { return "getManagerBookings" in obj; }, get: function (obj) { return obj.getManagerBookings; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getManagerBooking_decorators, { kind: "method", name: "getManagerBooking", static: false, private: false, access: { has: function (obj) { return "getManagerBooking" in obj; }, get: function (obj) { return obj.getManagerBooking; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _reviewBooking_decorators, { kind: "method", name: "reviewBooking", static: false, private: false, access: { has: function (obj) { return "reviewBooking" in obj; }, get: function (obj) { return obj.reviewBooking; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateStatus_decorators, { kind: "method", name: "updateStatus", static: false, private: false, access: { has: function (obj) { return "updateStatus" in obj; }, get: function (obj) { return obj.updateStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _rescheduleBooking_decorators, { kind: "method", name: "rescheduleBooking", static: false, private: false, access: { has: function (obj) { return "rescheduleBooking" in obj; }, get: function (obj) { return obj.rescheduleBooking; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _cancelBooking_decorators, { kind: "method", name: "cancelBooking", static: false, private: false, access: { has: function (obj) { return "cancelBooking" in obj; }, get: function (obj) { return obj.cancelBooking; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BookingsManagerController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BookingsManagerController = _classThis;
}();
exports.BookingsManagerController = BookingsManagerController;
