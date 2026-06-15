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
exports.ReviewsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var review_response_dto_1 = require("./dto/review-response.dto");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var public_decorator_1 = require("../../common/decorators/public.decorator");
var ReviewsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Reviews'), (0, common_1.Controller)({ path: 'reviews', version: '1' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createReview_decorators;
    var _canReview_decorators;
    var _getMyReviews_decorators;
    var _getReviewByBookingId_decorators;
    var _updateReview_decorators;
    var _deleteReview_decorators;
    var _getBusinessReviews_decorators;
    var _getBusinessRatingSummary_decorators;
    var _getTopRatedBusinesses_decorators;
    var _getReviewById_decorators;
    var _adminDeleteReview_decorators;
    var _replyToReview_decorators;
    var ReviewsController = _classThis = /** @class */ (function () {
        function ReviewsController_1(reviewsService) {
            this.reviewsService = (__runInitializers(this, _instanceExtraInitializers), reviewsService);
        }
        // ==================== CLIENT ENDPOINTS ====================
        ReviewsController_1.prototype.createReview = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reviewsService.createReview(user.id, dto)];
                });
            });
        };
        ReviewsController_1.prototype.canReview = function (user, bookingId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reviewsService.canReview(user.id, bookingId)];
                });
            });
        };
        ReviewsController_1.prototype.getMyReviews = function (user, pageParam, limitParam) {
            return __awaiter(this, void 0, void 0, function () {
                var page, limit;
                return __generator(this, function (_a) {
                    page = pageParam && !isNaN(Number(pageParam)) ? Number(pageParam) : 1;
                    limit = limitParam && !isNaN(Number(limitParam)) ? Number(limitParam) : 20;
                    return [2 /*return*/, this.reviewsService.getUserReviews(user.id, page, limit)];
                });
            });
        };
        ReviewsController_1.prototype.getReviewByBookingId = function (user, bookingId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reviewsService.getReviewByBookingId(bookingId, user.id, user.role)];
                });
            });
        };
        ReviewsController_1.prototype.updateReview = function (user, reviewId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reviewsService.updateReview(user.id, reviewId, dto)];
                });
            });
        };
        ReviewsController_1.prototype.deleteReview = function (user, reviewId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reviewsService.deleteReview(user.id, user.role, reviewId)];
                });
            });
        };
        // ==================== PUBLIC ENDPOINTS ====================
        ReviewsController_1.prototype.getBusinessReviews = function (businessId, pageParam, limitParam, ratingParam, sortBy) {
            return __awaiter(this, void 0, void 0, function () {
                var page, limit, rating;
                return __generator(this, function (_a) {
                    page = pageParam && !isNaN(Number(pageParam)) ? Number(pageParam) : 1;
                    limit = limitParam && !isNaN(Number(limitParam)) ? Number(limitParam) : 20;
                    rating = ratingParam && !isNaN(Number(ratingParam)) ? Number(ratingParam) : undefined;
                    return [2 /*return*/, this.reviewsService.getBusinessReviews(businessId, page, limit, rating, sortBy)];
                });
            });
        };
        ReviewsController_1.prototype.getBusinessRatingSummary = function (businessId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reviewsService.getBusinessRatingSummary(businessId)];
                });
            });
        };
        ReviewsController_1.prototype.getTopRatedBusinesses = function () {
            return __awaiter(this, arguments, void 0, function (limit, minReviews) {
                if (limit === void 0) { limit = 10; }
                if (minReviews === void 0) { minReviews = 5; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reviewsService.getTopRatedBusinesses(limit, minReviews)];
                });
            });
        };
        // ==================== ADMIN/MANAGER ENDPOINTS ====================
        ReviewsController_1.prototype.getReviewById = function (user, reviewId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reviewsService.getReviewById(reviewId, user.id, user.role)];
                });
            });
        };
        ReviewsController_1.prototype.adminDeleteReview = function (user, reviewId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reviewsService.deleteReview(user.id, user.role, reviewId)];
                });
            });
        };
        ReviewsController_1.prototype.replyToReview = function (user, reviewId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reviewsService.addReviewReply(user.id, reviewId, dto.reply)];
                });
            });
        };
        return ReviewsController_1;
    }());
    __setFunctionName(_classThis, "ReviewsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createReview_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Create a review for a completed booking' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Review created', type: review_response_dto_1.ReviewResponseDto }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Booking not completed or already reviewed' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Not your booking' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' })];
        _canReview_decorators = [(0, common_1.Get)('check/:bookingId'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Check if user can review a booking' }), (0, swagger_1.ApiParam)({ name: 'bookingId', description: 'Booking UUID' })];
        _getMyReviews_decorators = [(0, common_1.Get)('my'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Get my reviews' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 })];
        _getReviewByBookingId_decorators = [(0, common_1.Get)('booking/:bookingId'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Get review by booking ID' }), (0, swagger_1.ApiParam)({ name: 'bookingId', description: 'Booking UUID' })];
        _updateReview_decorators = [(0, common_1.Put)(':reviewId'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Update my review (within 30 days)' }), (0, swagger_1.ApiParam)({ name: 'reviewId', description: 'Review UUID' })];
        _deleteReview_decorators = [(0, common_1.Delete)(':reviewId'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Delete my review' }), (0, swagger_1.ApiParam)({ name: 'reviewId', description: 'Review UUID' })];
        _getBusinessReviews_decorators = [(0, common_1.Get)('business/:businessId'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get all reviews for a business (public)' }), (0, swagger_1.ApiParam)({ name: 'businessId', description: 'Business UUID' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 }), (0, swagger_1.ApiQuery)({ name: 'rating', required: false, example: 5 }), (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, example: 'createdAt_desc' })];
        _getBusinessRatingSummary_decorators = [(0, common_1.Get)('business/:businessId/summary'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get rating summary for a business' }), (0, swagger_1.ApiParam)({ name: 'businessId', description: 'Business UUID' })];
        _getTopRatedBusinesses_decorators = [(0, common_1.Get)('top-rated'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get top rated businesses' }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 10 }), (0, swagger_1.ApiQuery)({ name: 'minReviews', required: false, example: 5 })];
        _getReviewById_decorators = [(0, common_1.Get)(':reviewId'), (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Get review by ID (admin/manager)' }), (0, swagger_1.ApiParam)({ name: 'reviewId', description: 'Review UUID' })];
        _adminDeleteReview_decorators = [(0, common_1.Delete)('admin/:reviewId'), (0, roles_decorator_1.Roles)('ADMIN'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Delete any review (admin only)' }), (0, swagger_1.ApiParam)({ name: 'reviewId', description: 'Review UUID' })];
        _replyToReview_decorators = [(0, common_1.Post)(':reviewId/reply'), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Reply to a review (manager only)' }), (0, swagger_1.ApiParam)({ name: 'reviewId', description: 'Review UUID' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Reply added/updated', type: review_response_dto_1.ReviewResponseDto })];
        __esDecorate(_classThis, null, _createReview_decorators, { kind: "method", name: "createReview", static: false, private: false, access: { has: function (obj) { return "createReview" in obj; }, get: function (obj) { return obj.createReview; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _canReview_decorators, { kind: "method", name: "canReview", static: false, private: false, access: { has: function (obj) { return "canReview" in obj; }, get: function (obj) { return obj.canReview; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyReviews_decorators, { kind: "method", name: "getMyReviews", static: false, private: false, access: { has: function (obj) { return "getMyReviews" in obj; }, get: function (obj) { return obj.getMyReviews; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getReviewByBookingId_decorators, { kind: "method", name: "getReviewByBookingId", static: false, private: false, access: { has: function (obj) { return "getReviewByBookingId" in obj; }, get: function (obj) { return obj.getReviewByBookingId; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateReview_decorators, { kind: "method", name: "updateReview", static: false, private: false, access: { has: function (obj) { return "updateReview" in obj; }, get: function (obj) { return obj.updateReview; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteReview_decorators, { kind: "method", name: "deleteReview", static: false, private: false, access: { has: function (obj) { return "deleteReview" in obj; }, get: function (obj) { return obj.deleteReview; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBusinessReviews_decorators, { kind: "method", name: "getBusinessReviews", static: false, private: false, access: { has: function (obj) { return "getBusinessReviews" in obj; }, get: function (obj) { return obj.getBusinessReviews; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBusinessRatingSummary_decorators, { kind: "method", name: "getBusinessRatingSummary", static: false, private: false, access: { has: function (obj) { return "getBusinessRatingSummary" in obj; }, get: function (obj) { return obj.getBusinessRatingSummary; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTopRatedBusinesses_decorators, { kind: "method", name: "getTopRatedBusinesses", static: false, private: false, access: { has: function (obj) { return "getTopRatedBusinesses" in obj; }, get: function (obj) { return obj.getTopRatedBusinesses; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getReviewById_decorators, { kind: "method", name: "getReviewById", static: false, private: false, access: { has: function (obj) { return "getReviewById" in obj; }, get: function (obj) { return obj.getReviewById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _adminDeleteReview_decorators, { kind: "method", name: "adminDeleteReview", static: false, private: false, access: { has: function (obj) { return "adminDeleteReview" in obj; }, get: function (obj) { return obj.adminDeleteReview; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _replyToReview_decorators, { kind: "method", name: "replyToReview", static: false, private: false, access: { has: function (obj) { return "replyToReview" in obj; }, get: function (obj) { return obj.replyToReview; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReviewsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReviewsController = _classThis;
}();
exports.ReviewsController = ReviewsController;
