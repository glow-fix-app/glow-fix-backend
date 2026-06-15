"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.ReviewsService = void 0;
var common_1 = require("@nestjs/common");
var ReviewsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ReviewsService = _classThis = /** @class */ (function () {
        function ReviewsService_1(prisma, eventEmitter, notificationsService) {
            this.prisma = prisma;
            this.eventEmitter = eventEmitter;
            this.notificationsService = notificationsService;
            this.logger = new common_1.Logger(ReviewsService.name);
        }
        /**
         * Create a review for a completed booking
         */
        ReviewsService_1.prototype.createReview = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, latestStatus, existingReview, review;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                return __generator(this, function (_m) {
                    switch (_m.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findUnique({
                                where: { id: dto.booking_id },
                                include: {
                                    vehicle: {
                                        include: {
                                            client: { include: { user: true } },
                                        },
                                    },
                                    business: true,
                                    statusHistory: {
                                        include: { status: true },
                                        orderBy: { createdAt: 'desc' },
                                        take: 1,
                                    },
                                },
                            })];
                        case 1:
                            booking = _m.sent();
                            if (!booking) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            // Verify user owns this booking
                            if (booking.vehicle.client.userId !== userId) {
                                throw new common_1.ForbiddenException('You can only review your own bookings');
                            }
                            latestStatus = (_b = (_a = booking.statusHistory[0]) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.context;
                            if (latestStatus !== 'COMPLETED') {
                                throw new common_1.BadRequestException('You can only review completed bookings. Current status: ' + latestStatus);
                            }
                            return [4 /*yield*/, this.prisma.review.findUnique({
                                    where: { bookingId: dto.booking_id },
                                })];
                        case 2:
                            existingReview = _m.sent();
                            if (existingReview) {
                                throw new common_1.ConflictException('A review already exists for this booking');
                            }
                            return [4 /*yield*/, this.prisma.review.create({
                                    data: {
                                        bookingId: dto.booking_id,
                                        rating: dto.rating,
                                        qualityRating: (_c = dto.quality_rating) !== null && _c !== void 0 ? _c : undefined,
                                        punctualityRating: (_d = dto.punctuality_rating) !== null && _d !== void 0 ? _d : undefined,
                                        communicationRating: (_e = dto.communication_rating) !== null && _e !== void 0 ? _e : undefined,
                                        comment: dto.comment,
                                    },
                                })];
                        case 3:
                            review = _m.sent();
                            this.logger.log("Review created for booking ".concat(dto.booking_id, " by user ").concat(userId));
                            // Send event
                            this.eventEmitter.emit('review.created', {
                                bookingId: dto.booking_id,
                                businessId: booking.businessId,
                                businessName: booking.business.businessName,
                                rating: dto.rating,
                            });
                            if (!booking.business.managerId) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.notificationsService.createNotification({
                                    recipientUserId: booking.business.managerId,
                                    actorUserId: userId,
                                    typeCode: 'NEW_REVIEW',
                                    title: 'New Review Received',
                                    body: "You received a ".concat(dto.rating, "-star review for a completed booking."),
                                    actionUrl: '/provider/reviews',
                                })];
                        case 4:
                            _m.sent();
                            _m.label = 5;
                        case 5: return [2 /*return*/, {
                                id: review.id,
                                booking_id: review.bookingId,
                                rating: review.rating,
                                quality_rating: (_f = review.qualityRating) !== null && _f !== void 0 ? _f : undefined,
                                punctuality_rating: (_g = review.punctualityRating) !== null && _g !== void 0 ? _g : undefined,
                                communication_rating: (_h = review.communicationRating) !== null && _h !== void 0 ? _h : undefined,
                                comment: (_j = review.comment) !== null && _j !== void 0 ? _j : undefined,
                                reply: (_k = review.reply) !== null && _k !== void 0 ? _k : undefined,
                                replied_at: (_l = review.repliedAt) !== null && _l !== void 0 ? _l : undefined,
                                created_at: review.createdAt,
                                updated_at: review.updatedAt,
                            }];
                    }
                });
            });
        };
        /**
         * Get review by booking ID
         */
        ReviewsService_1.prototype.getReviewByBookingId = function (bookingId, userId, userRole) {
            return __awaiter(this, void 0, void 0, function () {
                var review, isClient, isBusinessManager, isAdmin;
                var _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4 /*yield*/, this.prisma.review.findUnique({
                                where: { bookingId: bookingId },
                                include: {
                                    booking: {
                                        include: {
                                            vehicle: {
                                                include: {
                                                    client: { include: { user: true } },
                                                },
                                            },
                                            business: true,
                                        },
                                    },
                                },
                            })];
                        case 1:
                            review = _g.sent();
                            if (!review) {
                                return [2 /*return*/, null];
                            }
                            isClient = review.booking.vehicle.client.userId === userId;
                            isBusinessManager = review.booking.business.managerId === userId;
                            isAdmin = userRole === 'ADMIN';
                            if (!isClient && !isBusinessManager && !isAdmin) {
                                throw new common_1.ForbiddenException('You do not have access to this review');
                            }
                            return [2 /*return*/, {
                                    id: review.id,
                                    booking_id: review.bookingId,
                                    rating: review.rating,
                                    quality_rating: (_a = review.qualityRating) !== null && _a !== void 0 ? _a : undefined,
                                    punctuality_rating: (_b = review.punctualityRating) !== null && _b !== void 0 ? _b : undefined,
                                    communication_rating: (_c = review.communicationRating) !== null && _c !== void 0 ? _c : undefined,
                                    comment: (_d = review.comment) !== null && _d !== void 0 ? _d : undefined,
                                    reply: (_e = review.reply) !== null && _e !== void 0 ? _e : undefined,
                                    replied_at: (_f = review.repliedAt) !== null && _f !== void 0 ? _f : undefined,
                                    created_at: review.createdAt,
                                    updated_at: review.updatedAt,
                                    client_id: review.booking.vehicle.client.userId,
                                    client_name: review.booking.vehicle.client.user.fullName,
                                    business_id: review.booking.businessId,
                                    business_name: review.booking.business.businessName,
                                }];
                    }
                });
            });
        };
        /**
         * Get review by ID
         */
        ReviewsService_1.prototype.getReviewById = function (reviewId, userId, userRole) {
            return __awaiter(this, void 0, void 0, function () {
                var review, isClient, isBusinessManager, isAdmin;
                var _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4 /*yield*/, this.prisma.review.findUnique({
                                where: { id: reviewId },
                                include: {
                                    booking: {
                                        include: {
                                            vehicle: {
                                                include: {
                                                    client: { include: { user: true } },
                                                },
                                            },
                                            business: true,
                                        },
                                    },
                                },
                            })];
                        case 1:
                            review = _g.sent();
                            if (!review) {
                                throw new common_1.NotFoundException('Review not found');
                            }
                            isClient = review.booking.vehicle.client.userId === userId;
                            isBusinessManager = review.booking.business.managerId === userId;
                            isAdmin = userRole === 'ADMIN';
                            if (!isClient && !isBusinessManager && !isAdmin) {
                                throw new common_1.ForbiddenException('You do not have access to this review');
                            }
                            return [2 /*return*/, {
                                    id: review.id,
                                    booking_id: review.bookingId,
                                    rating: review.rating,
                                    quality_rating: (_a = review.qualityRating) !== null && _a !== void 0 ? _a : undefined,
                                    punctuality_rating: (_b = review.punctualityRating) !== null && _b !== void 0 ? _b : undefined,
                                    communication_rating: (_c = review.communicationRating) !== null && _c !== void 0 ? _c : undefined,
                                    comment: (_d = review.comment) !== null && _d !== void 0 ? _d : undefined,
                                    reply: (_e = review.reply) !== null && _e !== void 0 ? _e : undefined,
                                    replied_at: (_f = review.repliedAt) !== null && _f !== void 0 ? _f : undefined,
                                    created_at: review.createdAt,
                                    updated_at: review.updatedAt,
                                    client_id: review.booking.vehicle.client.userId,
                                    client_name: review.booking.vehicle.client.user.fullName,
                                    business_id: review.booking.businessId,
                                    business_name: review.booking.business.businessName,
                                }];
                    }
                });
            });
        };
        /**
         * Get all reviews for a business (public)
         */
        ReviewsService_1.prototype.getBusinessReviews = function (businessId_1) {
            return __awaiter(this, arguments, void 0, function (businessId, page, limit, rating, sortBy) {
                var business, skip, take, where, orderBy, _a, reviews, totalReviews, ratingSummary, formattedReviews;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.business.findUnique({
                                where: { id: businessId },
                            })];
                        case 1:
                            business = _b.sent();
                            if (!business) {
                                throw new common_1.NotFoundException('Business not found');
                            }
                            skip = (page - 1) * limit;
                            take = Math.min(limit, 50);
                            where = {
                                booking: { businessId: businessId },
                            };
                            if (rating !== undefined) {
                                where.rating = rating;
                            }
                            orderBy = { createdAt: 'desc' };
                            if (sortBy === 'rating_desc') {
                                orderBy = { rating: 'desc' };
                            }
                            else if (sortBy === 'rating_asc') {
                                orderBy = { rating: 'asc' };
                            }
                            else if (sortBy === 'createdAt_asc') {
                                orderBy = { createdAt: 'asc' };
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.review.findMany({
                                        where: where,
                                        include: {
                                            booking: {
                                                include: {
                                                    vehicle: {
                                                        include: {
                                                            client: {
                                                                include: { user: true },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        orderBy: orderBy,
                                        skip: skip,
                                        take: take,
                                    }),
                                    this.prisma.review.count({
                                        where: where,
                                    }),
                                    this.getBusinessRatingSummary(businessId),
                                ])];
                        case 2:
                            _a = _b.sent(), reviews = _a[0], totalReviews = _a[1], ratingSummary = _a[2];
                            formattedReviews = reviews.map(function (review) {
                                var _a, _b, _c, _d, _e, _f;
                                return ({
                                    id: review.id,
                                    booking_id: review.bookingId,
                                    rating: review.rating,
                                    quality_rating: (_a = review.qualityRating) !== null && _a !== void 0 ? _a : undefined,
                                    punctuality_rating: (_b = review.punctualityRating) !== null && _b !== void 0 ? _b : undefined,
                                    communication_rating: (_c = review.communicationRating) !== null && _c !== void 0 ? _c : undefined,
                                    comment: (_d = review.comment) !== null && _d !== void 0 ? _d : undefined,
                                    reply: (_e = review.reply) !== null && _e !== void 0 ? _e : undefined,
                                    replied_at: (_f = review.repliedAt) !== null && _f !== void 0 ? _f : undefined,
                                    created_at: review.createdAt,
                                    updated_at: review.updatedAt,
                                    client_id: review.booking.vehicle.client.userId,
                                    client_name: review.booking.vehicle.client.user.fullName,
                                    business_id: businessId,
                                    business_name: business.businessName,
                                });
                            });
                            return [2 /*return*/, {
                                    business_id: businessId,
                                    business_name: business.businessName,
                                    average_rating: ratingSummary.average_rating,
                                    total_reviews: totalReviews,
                                    reviews: formattedReviews,
                                }];
                    }
                });
            });
        };
        /**
         * Get rating summary for a business
         */
        ReviewsService_1.prototype.getBusinessRatingSummary = function (businessId) {
            return __awaiter(this, void 0, void 0, function () {
                var business, reviews, totalRating, averageRating, distribution, _i, reviews_1, review, qualityRatings, punctualityRatings, communicationRatings, result, avgQuality, avgPunctuality, avgCommunication;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.business.findUnique({
                                where: { id: businessId },
                            })];
                        case 1:
                            business = _a.sent();
                            if (!business) {
                                throw new common_1.NotFoundException('Business not found');
                            }
                            return [4 /*yield*/, this.prisma.review.findMany({
                                    where: {
                                        booking: { businessId: businessId },
                                    },
                                    select: {
                                        rating: true,
                                        qualityRating: true,
                                        punctualityRating: true,
                                        communicationRating: true,
                                    },
                                })];
                        case 2:
                            reviews = _a.sent();
                            if (reviews.length === 0) {
                                return [2 /*return*/, {
                                        average_rating: 0,
                                        total_reviews: 0,
                                        rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                                    }];
                            }
                            totalRating = reviews.reduce(function (sum, r) { return sum + r.rating; }, 0);
                            averageRating = totalRating / reviews.length;
                            distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                            for (_i = 0, reviews_1 = reviews; _i < reviews_1.length; _i++) {
                                review = reviews_1[_i];
                                if (review.rating >= 1 && review.rating <= 5) {
                                    distribution[review.rating]++;
                                }
                            }
                            qualityRatings = reviews.filter(function (r) { return r.qualityRating !== null; });
                            punctualityRatings = reviews.filter(function (r) { return r.punctualityRating !== null; });
                            communicationRatings = reviews.filter(function (r) { return r.communicationRating !== null; });
                            result = {
                                average_rating: Math.round(averageRating * 10) / 10,
                                total_reviews: reviews.length,
                                rating_distribution: distribution,
                            };
                            if (qualityRatings.length > 0) {
                                avgQuality = qualityRatings.reduce(function (sum, r) { return sum + r.qualityRating; }, 0) / qualityRatings.length;
                                result.average_quality = Math.round(avgQuality * 10) / 10;
                            }
                            if (punctualityRatings.length > 0) {
                                avgPunctuality = punctualityRatings.reduce(function (sum, r) { return sum + r.punctualityRating; }, 0) / punctualityRatings.length;
                                result.average_punctuality = Math.round(avgPunctuality * 10) / 10;
                            }
                            if (communicationRatings.length > 0) {
                                avgCommunication = communicationRatings.reduce(function (sum, r) { return sum + r.communicationRating; }, 0) / communicationRatings.length;
                                result.average_communication = Math.round(avgCommunication * 10) / 10;
                            }
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        /**
         * Get user's reviews (all reviews by client)
         */
        ReviewsService_1.prototype.getUserReviews = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, page, limit) {
                var skip, take, _a, reviews, total, formattedReviews;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            skip = (page - 1) * limit;
                            take = Math.min(limit, 50);
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.review.findMany({
                                        where: {
                                            booking: {
                                                vehicle: {
                                                    client: { userId: userId },
                                                },
                                            },
                                        },
                                        include: {
                                            booking: {
                                                include: {
                                                    vehicle: {
                                                        include: {
                                                            client: { include: { user: true } },
                                                        },
                                                    },
                                                    business: true,
                                                },
                                            },
                                        },
                                        orderBy: { createdAt: 'desc' },
                                        skip: skip,
                                        take: take,
                                    }),
                                    this.prisma.review.count({
                                        where: {
                                            booking: {
                                                vehicle: {
                                                    client: { userId: userId },
                                                },
                                            },
                                        },
                                    }),
                                ])];
                        case 1:
                            _a = _b.sent(), reviews = _a[0], total = _a[1];
                            formattedReviews = reviews.map(function (review) {
                                var _a, _b, _c, _d, _e, _f;
                                return ({
                                    id: review.id,
                                    booking_id: review.bookingId,
                                    rating: review.rating,
                                    quality_rating: (_a = review.qualityRating) !== null && _a !== void 0 ? _a : undefined,
                                    punctuality_rating: (_b = review.punctualityRating) !== null && _b !== void 0 ? _b : undefined,
                                    communication_rating: (_c = review.communicationRating) !== null && _c !== void 0 ? _c : undefined,
                                    comment: (_d = review.comment) !== null && _d !== void 0 ? _d : undefined,
                                    reply: (_e = review.reply) !== null && _e !== void 0 ? _e : undefined,
                                    replied_at: (_f = review.repliedAt) !== null && _f !== void 0 ? _f : undefined,
                                    created_at: review.createdAt,
                                    updated_at: review.updatedAt,
                                    client_id: review.booking.vehicle.client.userId,
                                    client_name: review.booking.vehicle.client.user.fullName,
                                    business_id: review.booking.businessId,
                                    business_name: review.booking.business.businessName,
                                });
                            });
                            return [2 /*return*/, {
                                    data: formattedReviews,
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
        /**
         * Update a review (client only, within 30 days)
         */
        ReviewsService_1.prototype.updateReview = function (userId, reviewId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var review, thirtyDaysAgo, updatedReview;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0: return [4 /*yield*/, this.prisma.review.findUnique({
                                where: { id: reviewId },
                                include: {
                                    booking: {
                                        include: {
                                            vehicle: {
                                                include: { client: { include: { user: true } } },
                                            },
                                        },
                                    },
                                },
                            })];
                        case 1:
                            review = _k.sent();
                            if (!review) {
                                throw new common_1.NotFoundException('Review not found');
                            }
                            // Verify ownership
                            if (review.booking.vehicle.client.userId !== userId) {
                                throw new common_1.ForbiddenException('You can only update your own reviews');
                            }
                            thirtyDaysAgo = new Date();
                            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                            if (review.createdAt < thirtyDaysAgo) {
                                throw new common_1.BadRequestException('Reviews can only be updated within 30 days of creation');
                            }
                            return [4 /*yield*/, this.prisma.review.update({
                                    where: { id: reviewId },
                                    data: {
                                        rating: dto.rating,
                                        qualityRating: (_a = dto.quality_rating) !== null && _a !== void 0 ? _a : undefined,
                                        punctualityRating: (_b = dto.punctuality_rating) !== null && _b !== void 0 ? _b : undefined,
                                        communicationRating: (_c = dto.communication_rating) !== null && _c !== void 0 ? _c : undefined,
                                        comment: dto.comment,
                                        updatedAt: new Date(),
                                    },
                                })];
                        case 2:
                            updatedReview = _k.sent();
                            this.logger.log("Review ".concat(reviewId, " updated by user ").concat(userId));
                            return [2 /*return*/, {
                                    id: updatedReview.id,
                                    booking_id: updatedReview.bookingId,
                                    rating: updatedReview.rating,
                                    quality_rating: (_d = updatedReview.qualityRating) !== null && _d !== void 0 ? _d : undefined,
                                    punctuality_rating: (_e = updatedReview.punctualityRating) !== null && _e !== void 0 ? _e : undefined,
                                    communication_rating: (_f = updatedReview.communicationRating) !== null && _f !== void 0 ? _f : undefined,
                                    comment: (_g = updatedReview.comment) !== null && _g !== void 0 ? _g : undefined,
                                    reply: (_h = updatedReview.reply) !== null && _h !== void 0 ? _h : undefined,
                                    replied_at: (_j = updatedReview.repliedAt) !== null && _j !== void 0 ? _j : undefined,
                                    created_at: updatedReview.createdAt,
                                    updated_at: updatedReview.updatedAt,
                                }];
                    }
                });
            });
        };
        /**
         * Delete a review (client or admin)
         */
        ReviewsService_1.prototype.deleteReview = function (userId, userRole, reviewId) {
            return __awaiter(this, void 0, void 0, function () {
                var review, isOwner, isAdmin;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.review.findUnique({
                                where: { id: reviewId },
                                include: {
                                    booking: {
                                        include: {
                                            vehicle: {
                                                include: { client: { include: { user: true } } },
                                            },
                                        },
                                    },
                                },
                            })];
                        case 1:
                            review = _a.sent();
                            if (!review) {
                                throw new common_1.NotFoundException('Review not found');
                            }
                            isOwner = review.booking.vehicle.client.userId === userId;
                            isAdmin = userRole === 'ADMIN';
                            if (!isOwner && !isAdmin) {
                                throw new common_1.ForbiddenException('You are not authorized to delete this review');
                            }
                            return [4 /*yield*/, this.prisma.review.delete({
                                    where: { id: reviewId },
                                })];
                        case 2:
                            _a.sent();
                            this.logger.log("Review ".concat(reviewId, " deleted by user ").concat(userId));
                            this.eventEmitter.emit('review.deleted', {
                                reviewId: reviewId,
                                businessId: review.booking.businessId,
                            });
                            return [2 /*return*/, { message: 'Review deleted successfully' }];
                    }
                });
            });
        };
        /**
         * Get top rated businesses (for discovery)
         */
        ReviewsService_1.prototype.getTopRatedBusinesses = function () {
            return __awaiter(this, arguments, void 0, function (limit, minReviews) {
                var results;
                if (limit === void 0) { limit = 10; }
                if (minReviews === void 0) { minReviews = 5; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      SELECT \n        b.id as business_id,\n        b.business_name,\n        b.address,\n        COALESCE(AVG(r.rating), 0) as average_rating,\n        COUNT(r.id) as total_reviews\n      FROM businesses b\n      LEFT JOIN bookings bk ON b.id = bk.business_id\n      LEFT JOIN reviews r ON bk.id = r.booking_id\n      WHERE EXISTS (\n        SELECT 1 FROM business_status bs \n        WHERE bs.business_id = b.id \n          AND bs.status_id = (SELECT id FROM statuses WHERE context = 'APPROVED')\n      )\n      GROUP BY b.id\n      HAVING COUNT(r.id) >= ", "\n      ORDER BY average_rating DESC, total_reviews DESC\n      LIMIT ", "\n    "], ["\n      SELECT \n        b.id as business_id,\n        b.business_name,\n        b.address,\n        COALESCE(AVG(r.rating), 0) as average_rating,\n        COUNT(r.id) as total_reviews\n      FROM businesses b\n      LEFT JOIN bookings bk ON b.id = bk.business_id\n      LEFT JOIN reviews r ON bk.id = r.booking_id\n      WHERE EXISTS (\n        SELECT 1 FROM business_status bs \n        WHERE bs.business_id = b.id \n          AND bs.status_id = (SELECT id FROM statuses WHERE context = 'APPROVED')\n      )\n      GROUP BY b.id\n      HAVING COUNT(r.id) >= ", "\n      ORDER BY average_rating DESC, total_reviews DESC\n      LIMIT ", "\n    "])), minReviews, limit)];
                        case 1:
                            results = _a.sent();
                            return [2 /*return*/, results.map(function (r) { return ({
                                    business_id: r.business_id,
                                    business_name: r.business_name,
                                    average_rating: Math.round(parseFloat(r.average_rating) * 10) / 10,
                                    total_reviews: parseInt(r.total_reviews, 10),
                                    address: r.address,
                                }); })];
                    }
                });
            });
        };
        /**
         * Check if user can review a booking
         */
        ReviewsService_1.prototype.canReview = function (userId, bookingId) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, latestStatus;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findUnique({
                                where: { id: bookingId },
                                include: {
                                    vehicle: {
                                        include: { client: { include: { user: true } } },
                                    },
                                    statusHistory: {
                                        include: { status: true },
                                        orderBy: { createdAt: 'desc' },
                                        take: 1,
                                    },
                                    review: true,
                                },
                            })];
                        case 1:
                            booking = _c.sent();
                            if (!booking) {
                                return [2 /*return*/, { can_review: false, reason: 'Booking not found' }];
                            }
                            if (booking.vehicle.client.userId !== userId) {
                                return [2 /*return*/, { can_review: false, reason: 'You can only review your own bookings' }];
                            }
                            latestStatus = (_b = (_a = booking.statusHistory[0]) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.context;
                            if (latestStatus !== 'COMPLETED') {
                                return [2 /*return*/, { can_review: false, reason: 'Only completed bookings can be reviewed' }];
                            }
                            if (booking.review) {
                                return [2 /*return*/, { can_review: false, reason: 'You have already reviewed this booking' }];
                            }
                            return [2 /*return*/, { can_review: true }];
                    }
                });
            });
        };
        /**
         * Add or update a reply to a review (manager only)
         */
        ReviewsService_1.prototype.addReviewReply = function (managerUserId, reviewId, replyText) {
            return __awaiter(this, void 0, void 0, function () {
                var review, updatedReview, recipientUserId, err_1;
                var _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4 /*yield*/, this.prisma.review.findUnique({
                                where: { id: reviewId },
                                include: {
                                    booking: {
                                        include: {
                                            business: true,
                                            vehicle: {
                                                include: {
                                                    client: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            })];
                        case 1:
                            review = _g.sent();
                            if (!review) {
                                throw new common_1.NotFoundException('Review not found');
                            }
                            // Verify ownership: the manager must own the business that received this review
                            if (review.booking.business.managerId !== managerUserId) {
                                throw new common_1.ForbiddenException('You can only reply to reviews for bookings on your own business');
                            }
                            return [4 /*yield*/, this.prisma.review.update({
                                    where: { id: reviewId },
                                    data: {
                                        reply: replyText,
                                        repliedAt: new Date(),
                                        updatedAt: new Date(),
                                    },
                                })];
                        case 2:
                            updatedReview = _g.sent();
                            this.logger.log("Manager ".concat(managerUserId, " replied to review ").concat(reviewId));
                            _g.label = 3;
                        case 3:
                            _g.trys.push([3, 6, , 7]);
                            recipientUserId = review.booking.vehicle.client.userId;
                            // Ensure the notification type exists in the database
                            return [4 /*yield*/, this.prisma.notificationType.upsert({
                                    where: { code: 'NEW_REVIEW_REPLY' },
                                    update: {},
                                    create: {
                                        code: 'NEW_REVIEW_REPLY',
                                        label: 'Manager Replied to Review',
                                    },
                                })];
                        case 4:
                            // Ensure the notification type exists in the database
                            _g.sent();
                            return [4 /*yield*/, this.notificationsService.createNotification({
                                    recipientUserId: recipientUserId,
                                    actorUserId: managerUserId,
                                    typeCode: 'NEW_REVIEW_REPLY',
                                    title: 'New reply to your review',
                                    body: "".concat(review.booking.business.businessName, " replied: \"").concat(replyText, "\""),
                                    actionUrl: "/client/bookings/".concat(review.bookingId),
                                })];
                        case 5:
                            _g.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            err_1 = _g.sent();
                            this.logger.error("Failed to send review reply notification: ".concat(err_1.message));
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/, {
                                id: updatedReview.id,
                                booking_id: updatedReview.bookingId,
                                rating: updatedReview.rating,
                                quality_rating: (_a = updatedReview.qualityRating) !== null && _a !== void 0 ? _a : undefined,
                                punctuality_rating: (_b = updatedReview.punctualityRating) !== null && _b !== void 0 ? _b : undefined,
                                communication_rating: (_c = updatedReview.communicationRating) !== null && _c !== void 0 ? _c : undefined,
                                comment: (_d = updatedReview.comment) !== null && _d !== void 0 ? _d : undefined,
                                reply: (_e = updatedReview.reply) !== null && _e !== void 0 ? _e : undefined,
                                replied_at: (_f = updatedReview.repliedAt) !== null && _f !== void 0 ? _f : undefined,
                                created_at: updatedReview.createdAt,
                                updated_at: updatedReview.updatedAt,
                            }];
                    }
                });
            });
        };
        return ReviewsService_1;
    }());
    __setFunctionName(_classThis, "ReviewsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReviewsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReviewsService = _classThis;
}();
exports.ReviewsService = ReviewsService;
var templateObject_1;
