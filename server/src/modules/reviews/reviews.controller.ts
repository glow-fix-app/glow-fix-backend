import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ReviewsService } from './services/reviews.service';
import { CreateReviewDto } from './dto/request/create-review.dto';
import { UpdateReviewDto } from './dto/request/update-review.dto';
import { ReplyReviewDto } from './dto/request/reply-review.dto';
import { ReviewResponseDto, ReviewWithUserDto, BusinessReviewsResponseDto, RatingSummaryDto } from './dto/response/review-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtPayload } from '@glow-fix/types';

@ApiTags('Reviews')
@Controller({ path: 'reviews', version: '1' })
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // ==================== CLIENT ENDPOINTS ====================

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review for a completed booking' })
  @ApiResponse({ status: 201, description: 'Review created', type: ReviewResponseDto })
  @ApiResponse({ status: 400, description: 'Booking not completed or already reviewed' })
  @ApiResponse({ status: 403, description: 'Not your booking' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async createReview(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.createReview(user.sub, dto);
  }

  @Get('check/:bookingId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if user can review a booking' })
  @ApiParam({ name: 'bookingId', description: 'Booking UUID' })
  async canReview(
    @CurrentUser() user: JwtPayload,
    @Param('bookingId') bookingId: string,
  ): Promise<{ can_review: boolean; reason?: string }> {
    return this.reviewsService.canReview(user.sub, bookingId);
  }

  @Get('my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my reviews' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async getMyReviews(
    @CurrentUser() user: JwtPayload,
    @Query('page') pageParam?: string,
    @Query('limit') limitParam?: string,
  ): Promise<{ data: ReviewWithUserDto[]; meta: any }> {
    const page = pageParam && !isNaN(Number(pageParam)) ? Number(pageParam) : 1;
    const limit = limitParam && !isNaN(Number(limitParam)) ? Number(limitParam) : 20;
    return this.reviewsService.getUserReviews(user.sub, page, limit);
  }

  @Get('booking/:bookingId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get review by booking ID' })
  @ApiParam({ name: 'bookingId', description: 'Booking UUID' })
  async getReviewByBookingId(
    @CurrentUser() user: JwtPayload,
    @Param('bookingId') bookingId: string,
  ): Promise<ReviewWithUserDto | null> {
    return this.reviewsService.getReviewByBookingId(bookingId, user.sub, user.role);
  }

  @Put(':reviewId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my review (within 30 days)' })
  @ApiParam({ name: 'reviewId', description: 'Review UUID' })
  async updateReview(
    @CurrentUser() user: JwtPayload,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @Body() dto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.updateReview(user.sub, reviewId, dto);
  }

  @Delete(':reviewId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete my review' })
  @ApiParam({ name: 'reviewId', description: 'Review UUID' })
  async deleteReview(
    @CurrentUser() user: JwtPayload,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
  ): Promise<{ message: string }> {
    return this.reviewsService.deleteReview(user.sub, user.role, reviewId);
  }

  // ==================== PUBLIC ENDPOINTS ====================

  @Get('business/:businessId')
  @Public()
  @ApiOperation({ summary: 'Get all reviews for a business (public)' })
  @ApiParam({ name: 'businessId', description: 'Business UUID' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'rating', required: false, example: 5 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt_desc' })
  async getBusinessReviews(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query('page') pageParam?: string,
    @Query('limit') limitParam?: string,
    @Query('rating') ratingParam?: string,
    @Query('sortBy') sortBy?: string,
  ): Promise<BusinessReviewsResponseDto> {
    const page = pageParam && !isNaN(Number(pageParam)) ? Number(pageParam) : 1;
    const limit = limitParam && !isNaN(Number(limitParam)) ? Number(limitParam) : 20;
    const rating = ratingParam && !isNaN(Number(ratingParam)) ? Number(ratingParam) : undefined;
    return this.reviewsService.getBusinessReviews(businessId, page, limit, rating, sortBy);
  }

  @Get('business/:businessId/summary')
  @Public()
  @ApiOperation({ summary: 'Get rating summary for a business' })
  @ApiParam({ name: 'businessId', description: 'Business UUID' })
  async getBusinessRatingSummary(
    @Param('businessId', ParseUUIDPipe) businessId: string,
  ): Promise<RatingSummaryDto> {
    return this.reviewsService.getBusinessRatingSummary(businessId);
  }

  @Get('top-rated')
  @Public()
  @ApiOperation({ summary: 'Get top rated businesses' })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'minReviews', required: false, example: 5 })
  async getTopRatedBusinesses(
    @Query('limit') limit: number = 10,
    @Query('minReviews') minReviews: number = 5,
  ): Promise<Array<{
    business_id: string;
    business_name: string;
    average_rating: number;
    total_reviews: number;
    address: string;
  }>> {
    return this.reviewsService.getTopRatedBusinesses(limit, minReviews);
  }

  // ==================== ADMIN/MANAGER ENDPOINTS ====================

  @Get(':reviewId')
  @Roles('ADMIN', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get review by ID (admin/manager)' })
  @ApiParam({ name: 'reviewId', description: 'Review UUID' })
  async getReviewById(
    @CurrentUser() user: JwtPayload,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
  ): Promise<ReviewWithUserDto> {
    return this.reviewsService.getReviewById(reviewId, user.sub, user.role);
  }

  @Delete('admin/:reviewId')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete any review (admin only)' })
  @ApiParam({ name: 'reviewId', description: 'Review UUID' })
  async adminDeleteReview(
    @CurrentUser() user: JwtPayload,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
  ): Promise<{ message: string }> {
    return this.reviewsService.deleteReview(user.sub, user.role, reviewId);
  }

  @Post(':reviewId/reply')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reply to a review (manager only)' })
  @ApiParam({ name: 'reviewId', description: 'Review UUID' })
  @ApiResponse({ status: 201, description: 'Reply added/updated', type: ReviewResponseDto })
  async replyToReview(
    @CurrentUser() user: JwtPayload,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @Body() dto: ReplyReviewDto,
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.addReviewReply(user.sub, reviewId, dto.reply);
  }
}