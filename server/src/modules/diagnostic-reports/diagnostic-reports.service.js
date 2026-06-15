"use strict";
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
exports.DiagnosticReportsService = void 0;
var common_1 = require("@nestjs/common");
var diagnostic_reports_events_1 = require("./diagnostic-reports.events");
var client_1 = require("@prisma/client");
var DiagnosticReportsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DiagnosticReportsService = _classThis = /** @class */ (function () {
        function DiagnosticReportsService_1(prisma, eventEmitter) {
            this.prisma = prisma;
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(DiagnosticReportsService.name);
        }
        DiagnosticReportsService_1.prototype.createReport = function (managerId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, validUntil, existingReport, report, diagnosisSentStatus;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findUnique({
                                where: { id: dto.booking_id },
                                include: {
                                    business: true,
                                    vehicle: {
                                        include: {
                                            client: {
                                                include: { user: true },
                                            },
                                        },
                                    },
                                    statusHistory: {
                                        include: { status: true },
                                        orderBy: { createdAt: 'desc' },
                                        take: 1,
                                    },
                                },
                            })];
                        case 1:
                            booking = _a.sent();
                            if (!booking) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            if (booking.business.managerId !== managerId) {
                                throw new common_1.ForbiddenException('You do not own this business');
                            }
                            validUntil = new Date();
                            validUntil.setHours(validUntil.getHours() + (dto.valid_hours || 72));
                            return [4 /*yield*/, this.prisma.diagnosticReport.findUnique({
                                    where: { bookingId: dto.booking_id },
                                })];
                        case 2:
                            existingReport = _a.sent();
                            if (!existingReport) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.prisma.reportFinding.deleteMany({ where: { reportId: existingReport.id } })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.recommendedRepair.deleteMany({ where: { reportId: existingReport.id } })];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [4 /*yield*/, this.prisma.diagnosticReport.upsert({
                                where: { bookingId: dto.booking_id },
                                create: {
                                    bookingId: dto.booking_id,
                                    summary: dto.summary,
                                    validUntil: validUntil,
                                    estimatedDuration: dto.estimated_duration,
                                    findings: {
                                        create: dto.findings.map(function (f) { return ({
                                            title: f.title,
                                            description: f.description,
                                            priority: f.priority,
                                        }); }),
                                    },
                                    recommendedRepairs: {
                                        create: dto.recommended_repairs.map(function (r) { return ({
                                            businessServiceId: r.business_service_id,
                                            title: r.title,
                                            description: r.description,
                                            price: r.price ? new client_1.Prisma.Decimal(r.price.toString()) : undefined,
                                            durationMinutes: r.duration_minutes,
                                            isSelected: false,
                                        }); }),
                                    },
                                },
                                update: {
                                    summary: dto.summary,
                                    validUntil: validUntil,
                                    estimatedDuration: dto.estimated_duration,
                                    findings: {
                                        create: dto.findings.map(function (f) { return ({
                                            title: f.title,
                                            description: f.description,
                                            priority: f.priority,
                                        }); }),
                                    },
                                    recommendedRepairs: {
                                        create: dto.recommended_repairs.map(function (r) { return ({
                                            businessServiceId: r.business_service_id,
                                            title: r.title,
                                            description: r.description,
                                            price: r.price ? new client_1.Prisma.Decimal(r.price.toString()) : undefined,
                                            durationMinutes: r.duration_minutes,
                                            isSelected: false,
                                        }); }),
                                    },
                                },
                                include: {
                                    findings: true,
                                    recommendedRepairs: true,
                                    booking: {
                                        include: {
                                            vehicle: {
                                                include: {
                                                    client: { include: { user: true } },
                                                },
                                            },
                                        },
                                    },
                                },
                            })];
                        case 6:
                            report = _a.sent();
                            return [4 /*yield*/, this.prisma.status.findFirst({
                                    where: { context: 'DIAGNOSIS_SENT' },
                                })];
                        case 7:
                            diagnosisSentStatus = _a.sent();
                            if (!diagnosisSentStatus) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.prisma.bookingStatus.create({
                                    data: {
                                        bookingId: dto.booking_id,
                                        statusId: diagnosisSentStatus.id,
                                    },
                                })];
                        case 8:
                            _a.sent();
                            _a.label = 9;
                        case 9:
                            this.logger.log("Diagnostic report created for booking ".concat(dto.booking_id, " by manager ").concat(managerId));
                            this.eventEmitter.emit(diagnostic_reports_events_1.DIAGNOSTIC_EVENTS.REPORT_CREATED, {
                                bookingId: dto.booking_id,
                                clientId: booking.vehicle.client.userId,
                                reportId: report.id,
                            });
                            return [2 /*return*/, this.mapToResponseDto(report)];
                    }
                });
            });
        };
        DiagnosticReportsService_1.prototype.getReportByBookingId = function (bookingId, userId, userRole) {
            return __awaiter(this, void 0, void 0, function () {
                var report, isClient, isManager, isAdmin;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.diagnosticReport.findUnique({
                                where: { bookingId: bookingId },
                                include: {
                                    findings: true,
                                    recommendedRepairs: true,
                                    booking: {
                                        include: {
                                            business: true,
                                            vehicle: {
                                                include: {
                                                    client: { include: { user: true } },
                                                },
                                            },
                                        },
                                    },
                                },
                            })];
                        case 1:
                            report = _a.sent();
                            if (!report) {
                                return [2 /*return*/, null];
                            }
                            isClient = report.booking.vehicle.client.userId === userId;
                            isManager = report.booking.business.managerId === userId;
                            isAdmin = userRole === 'ADMIN';
                            if (!isClient && !isManager && !isAdmin) {
                                throw new common_1.ForbiddenException('You do not have access to this report');
                            }
                            if (report.validUntil &&
                                new Date() > report.validUntil &&
                                !report.clientAction) {
                                report.summary = '[EXPIRED] ' + report.summary;
                            }
                            return [2 /*return*/, this.mapToResponseDto(report)];
                    }
                });
            });
        };
        DiagnosticReportsService_1.prototype.getReportById = function (reportId, userId, userRole) {
            return __awaiter(this, void 0, void 0, function () {
                var report, isClient, isManager, isAdmin;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.diagnosticReport.findUnique({
                                where: { id: reportId },
                                include: {
                                    findings: true,
                                    recommendedRepairs: true,
                                    booking: {
                                        include: {
                                            business: true,
                                            vehicle: {
                                                include: {
                                                    client: { include: { user: true } },
                                                },
                                            },
                                        },
                                    },
                                },
                            })];
                        case 1:
                            report = _a.sent();
                            if (!report) {
                                throw new common_1.NotFoundException('Diagnostic report not found');
                            }
                            isClient = report.booking.vehicle.client.userId === userId;
                            isManager = report.booking.business.managerId === userId;
                            isAdmin = userRole === 'ADMIN';
                            if (!isClient && !isManager && !isAdmin) {
                                throw new common_1.ForbiddenException('You do not have access to this report');
                            }
                            return [2 /*return*/, this.mapToResponseDto(report)];
                    }
                });
            });
        };
        DiagnosticReportsService_1.prototype.updateReport = function (managerId, reportId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var report, updatedReport, finalReport;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.diagnosticReport.findUnique({
                                where: { id: reportId },
                                include: {
                                    booking: {
                                        include: {
                                            business: true,
                                        },
                                    },
                                },
                            })];
                        case 1:
                            report = _a.sent();
                            if (!report) {
                                throw new common_1.NotFoundException('Diagnostic report not found');
                            }
                            if (report.booking.business.managerId !== managerId) {
                                throw new common_1.ForbiddenException('You do not own this business');
                            }
                            if (report.clientAction) {
                                throw new common_1.BadRequestException('Cannot update report after client has responded');
                            }
                            return [4 /*yield*/, this.prisma.diagnosticReport.update({
                                    where: { id: reportId },
                                    data: {
                                        summary: dto.summary,
                                        estimatedDuration: dto.estimated_duration,
                                        updatedAt: new Date(),
                                    },
                                    include: {
                                        findings: true,
                                        recommendedRepairs: true,
                                        booking: {
                                            include: {
                                                vehicle: {
                                                    include: {
                                                        client: { include: { user: true } },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                })];
                        case 2:
                            updatedReport = _a.sent();
                            if (!dto.findings) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.prisma.reportFinding.deleteMany({
                                    where: { reportId: reportId },
                                })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.reportFinding.createMany({
                                    data: dto.findings.map(function (f) { return ({
                                        reportId: reportId,
                                        title: f.title,
                                        description: f.description,
                                        priority: f.priority,
                                    }); }),
                                })];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            if (!dto.recommended_repairs) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.prisma.recommendedRepair.deleteMany({
                                    where: { reportId: reportId },
                                })];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.recommendedRepair.createMany({
                                    data: dto.recommended_repairs.map(function (r) { return ({
                                        reportId: reportId,
                                        businessServiceId: r.business_service_id,
                                        title: r.title,
                                        description: r.description,
                                        price: r.price ? new client_1.Prisma.Decimal(r.price.toString()) : undefined,
                                        durationMinutes: r.duration_minutes,
                                        isSelected: false,
                                    }); }),
                                })];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8: return [4 /*yield*/, this.prisma.diagnosticReport.findUnique({
                                where: { id: reportId },
                                include: {
                                    findings: true,
                                    recommendedRepairs: true,
                                    booking: {
                                        include: {
                                            vehicle: {
                                                include: {
                                                    client: { include: { user: true } },
                                                },
                                            },
                                        },
                                    },
                                },
                            })];
                        case 9:
                            finalReport = _a.sent();
                            this.logger.log("Diagnostic report ".concat(reportId, " updated by manager ").concat(managerId));
                            return [2 /*return*/, this.mapToResponseDto(finalReport)];
                    }
                });
            });
        };
        DiagnosticReportsService_1.prototype.getReportSummary = function (bookingId, userId, userRole) {
            return __awaiter(this, void 0, void 0, function () {
                var report, isClient, isManager, isAdmin, criticalCount, warningCount, infoCount, totalCost;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.diagnosticReport.findUnique({
                                where: { bookingId: bookingId },
                                include: {
                                    findings: true,
                                    recommendedRepairs: true,
                                    booking: {
                                        include: {
                                            business: true,
                                            vehicle: {
                                                include: {
                                                    client: { include: { user: true } },
                                                },
                                            },
                                        },
                                    },
                                },
                            })];
                        case 1:
                            report = _a.sent();
                            if (!report) {
                                return [2 /*return*/, null];
                            }
                            isClient = report.booking.vehicle.client.userId === userId;
                            isManager = report.booking.business.managerId === userId;
                            isAdmin = userRole === 'ADMIN';
                            if (!isClient && !isManager && !isAdmin) {
                                throw new common_1.ForbiddenException('You do not have access to this report');
                            }
                            criticalCount = report.findings.filter(function (f) { return f.priority === 'CRITICAL'; }).length;
                            warningCount = report.findings.filter(function (f) { return f.priority === 'WARNING'; }).length;
                            infoCount = report.findings.filter(function (f) { return f.priority === 'INFO'; }).length;
                            totalCost = report.recommendedRepairs.reduce(function (sum, r) { return sum + (r.price ? Number(r.price) : 0); }, 0);
                            return [2 /*return*/, {
                                    report_id: report.id,
                                    booking_id: report.bookingId,
                                    booking_code: "BK-".concat(report.bookingId.slice(0, 8).toUpperCase()),
                                    summary: report.summary,
                                    critical_count: criticalCount,
                                    warning_count: warningCount,
                                    info_count: infoCount,
                                    total_repairs: report.recommendedRepairs.length,
                                    total_cost: totalCost,
                                    client_action: report.clientAction || undefined,
                                    created_at: report.createdAt,
                                }];
                    }
                });
            });
        };
        DiagnosticReportsService_1.prototype.getClientReports = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, page, limit) {
                var skip, take, client, _a, reports, total, data;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            skip = (page - 1) * limit;
                            take = Math.min(limit, 50);
                            return [4 /*yield*/, this.prisma.client.findUnique({
                                    where: { userId: userId },
                                })];
                        case 1:
                            client = _b.sent();
                            if (!client) {
                                throw new common_1.NotFoundException('Client not found');
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.diagnosticReport.findMany({
                                        where: {
                                            booking: {
                                                vehicle: { clientId: client.id },
                                            },
                                        },
                                        include: {
                                            findings: true,
                                            recommendedRepairs: true,
                                            booking: true,
                                        },
                                        orderBy: { createdAt: 'desc' },
                                        skip: skip,
                                        take: take,
                                    }),
                                    this.prisma.diagnosticReport.count({
                                        where: {
                                            booking: {
                                                vehicle: { clientId: client.id },
                                            },
                                        },
                                    }),
                                ])];
                        case 2:
                            _a = _b.sent(), reports = _a[0], total = _a[1];
                            data = reports.map(function (report) { return ({
                                report_id: report.id,
                                booking_id: report.bookingId,
                                booking_code: "BK-".concat(report.bookingId.slice(0, 8).toUpperCase()),
                                summary: report.summary,
                                critical_count: report.findings.filter(function (f) { return f.priority === 'CRITICAL'; })
                                    .length,
                                warning_count: report.findings.filter(function (f) { return f.priority === 'WARNING'; })
                                    .length,
                                info_count: report.findings.filter(function (f) { return f.priority === 'INFO'; }).length,
                                total_repairs: report.recommendedRepairs.length,
                                total_cost: report.recommendedRepairs.reduce(function (sum, r) { return sum + (r.price ? Number(r.price) : 0); }, 0),
                                client_action: report.clientAction || undefined,
                                created_at: report.createdAt,
                            }); });
                            return [2 /*return*/, {
                                    data: data,
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(total / limit),
                                    },
                                }];
                    }
                });
            });
        };
        // ==================== PRIVATE HELPERS ====================
        DiagnosticReportsService_1.prototype.mapToResponseDto = function (report) {
            var totalCost = report.recommendedRepairs.reduce(function (sum, r) { return sum + (r.price ? Number(r.price) : 0); }, 0);
            return {
                id: report.id,
                booking_id: report.bookingId,
                booking_code: "BK-".concat(report.bookingId.slice(0, 8).toUpperCase()),
                summary: report.summary,
                valid_until: report.validUntil || undefined,
                estimated_duration: report.estimatedDuration || undefined,
                client_action: report.clientAction || undefined,
                client_action_at: report.clientActionAt || undefined,
                findings: report.findings.map(function (f) { return ({
                    id: f.id,
                    title: f.title,
                    description: f.description || undefined,
                    priority: f.priority,
                }); }),
                recommended_repairs: report.recommendedRepairs.map(function (r) { return ({
                    id: r.id,
                    business_service_id: r.businessServiceId,
                    title: r.title || 'Repair Service',
                    description: r.description || undefined,
                    price: r.price ? Number(r.price) : 0,
                    duration_minutes: r.durationMinutes || 60,
                    is_selected: r.isSelected || false,
                }); }),
                total_repair_cost: totalCost,
                created_at: report.createdAt,
                updated_at: report.updatedAt,
            };
        };
        return DiagnosticReportsService_1;
    }());
    __setFunctionName(_classThis, "DiagnosticReportsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DiagnosticReportsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DiagnosticReportsService = _classThis;
}();
exports.DiagnosticReportsService = DiagnosticReportsService;
