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
exports.DiagnosticReportsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var report_response_dto_1 = require("./dto/report-response.dto");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var DiagnosticReportsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Diagnostic Reports'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Controller)({ path: 'diagnostic-reports', version: '1' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createReport_decorators;
    var _updateReport_decorators;
    var _getReportByBookingId_decorators;
    var _getReportSummary_decorators;
    var _getMyReports_decorators;
    var _getReportById_decorators;
    var DiagnosticReportsController = _classThis = /** @class */ (function () {
        function DiagnosticReportsController_1(diagnosticReportsService) {
            this.diagnosticReportsService = (__runInitializers(this, _instanceExtraInitializers), diagnosticReportsService);
        }
        // ==================== MANAGER/PROVIDER ENDPOINTS ====================
        DiagnosticReportsController_1.prototype.createReport = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.diagnosticReportsService.createReport(user.id, dto)];
                });
            });
        };
        DiagnosticReportsController_1.prototype.updateReport = function (user, reportId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.diagnosticReportsService.updateReport(user.id, reportId, dto)];
                });
            });
        };
        // ==================== CLIENT ENDPOINTS ====================
        DiagnosticReportsController_1.prototype.getReportByBookingId = function (user, bookingId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.diagnosticReportsService.getReportByBookingId(bookingId, user.id, user.role)];
                });
            });
        };
        DiagnosticReportsController_1.prototype.getReportSummary = function (user, bookingId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.diagnosticReportsService.getReportSummary(bookingId, user.id, user.role)];
                });
            });
        };
        DiagnosticReportsController_1.prototype.getMyReports = function (user_1) {
            return __awaiter(this, arguments, void 0, function (user, page, limit) {
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.diagnosticReportsService.getClientReports(user.id, page, limit)];
                });
            });
        };
        // ==================== SHARED ENDPOINTS ====================
        DiagnosticReportsController_1.prototype.getReportById = function (user, reportId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.diagnosticReportsService.getReportById(reportId, user.id, user.role)];
                });
            });
        };
        return DiagnosticReportsController_1;
    }());
    __setFunctionName(_classThis, "DiagnosticReportsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createReport_decorators = [(0, common_1.Post)(), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiOperation)({ summary: 'Create a diagnostic report (manager only)' }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'Report created',
                type: report_response_dto_1.DiagnosticReportResponseDto,
            })];
        _updateReport_decorators = [(0, common_1.Put)(':reportId'), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiOperation)({ summary: 'Update a diagnostic report (manager only)' }), (0, swagger_1.ApiParam)({ name: 'reportId', description: 'Report UUID' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Report updated',
                type: report_response_dto_1.DiagnosticReportResponseDto,
            })];
        _getReportByBookingId_decorators = [(0, common_1.Get)('booking/:bookingId'), (0, swagger_1.ApiOperation)({ summary: 'Get diagnostic report by booking ID' }), (0, swagger_1.ApiParam)({ name: 'bookingId', description: 'Booking UUID' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Report details',
                type: report_response_dto_1.DiagnosticReportResponseDto,
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Report not found' })];
        _getReportSummary_decorators = [(0, common_1.Get)('booking/:bookingId/summary'), (0, swagger_1.ApiOperation)({ summary: 'Get report summary for a booking' }), (0, swagger_1.ApiParam)({ name: 'bookingId', description: 'Booking UUID' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Report summary',
                type: report_response_dto_1.ReportSummaryDto,
            })];
        _getMyReports_decorators = [(0, common_1.Get)('my'), (0, swagger_1.ApiOperation)({ summary: 'Get all reports for current client' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 })];
        _getReportById_decorators = [(0, common_1.Get)(':reportId'), (0, swagger_1.ApiOperation)({ summary: 'Get diagnostic report by ID' }), (0, swagger_1.ApiParam)({ name: 'reportId', description: 'Report UUID' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Report details',
                type: report_response_dto_1.DiagnosticReportResponseDto,
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Report not found' })];
        __esDecorate(_classThis, null, _createReport_decorators, { kind: "method", name: "createReport", static: false, private: false, access: { has: function (obj) { return "createReport" in obj; }, get: function (obj) { return obj.createReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateReport_decorators, { kind: "method", name: "updateReport", static: false, private: false, access: { has: function (obj) { return "updateReport" in obj; }, get: function (obj) { return obj.updateReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getReportByBookingId_decorators, { kind: "method", name: "getReportByBookingId", static: false, private: false, access: { has: function (obj) { return "getReportByBookingId" in obj; }, get: function (obj) { return obj.getReportByBookingId; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getReportSummary_decorators, { kind: "method", name: "getReportSummary", static: false, private: false, access: { has: function (obj) { return "getReportSummary" in obj; }, get: function (obj) { return obj.getReportSummary; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyReports_decorators, { kind: "method", name: "getMyReports", static: false, private: false, access: { has: function (obj) { return "getMyReports" in obj; }, get: function (obj) { return obj.getMyReports; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getReportById_decorators, { kind: "method", name: "getReportById", static: false, private: false, access: { has: function (obj) { return "getReportById" in obj; }, get: function (obj) { return obj.getReportById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DiagnosticReportsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DiagnosticReportsController = _classThis;
}();
exports.DiagnosticReportsController = DiagnosticReportsController;
