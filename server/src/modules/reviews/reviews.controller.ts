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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewResponseDto, ReviewWithUserDto, BusinessReviewsResponseDto, RatingSummaryDto } from './dto/review-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

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
    @CurrentUser() user: any,
    @Body() dto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.createReview(user.id, dto);
  }

  @Get('check/:bookingId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if user can review a booking' })
  @ApiParam({ name: 'bookingId', description: 'Booking UUID' })
  async canReview(
    @CurrentUser() user: any,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
  ): Promise<{ can_review: boolean; reason?: string }> {
    return this.reviewsService.canReview(user.id, bookingId);
  }

  @Get('my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my reviews' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async getMyReviews(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<{ data: ReviewWithUserDto[]; meta: any }> {
    return this.reviewsService.getUserReviews(user.id, page, limit);
  }

  @Get('booking/:bookingId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get review by booking ID' })
  @ApiParam({ name: 'bookingId', description: 'Booking UUID' })
  async getReviewByBookingId(
    @CurrentUser() user: any,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
  ): Promise<ReviewWithUserDto | null> {
    return this.reviewsService.getReviewByBookingId(bookingId, user.id, user.role);
  }

  @Put(':reviewId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my review (within 30 days)' })
  @ApiParam({ name: 'reviewId', description: 'Review UUID' })
  async updateReview(
    @CurrentUser() user: any,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @Body() dto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.updateReview(user.id, reviewId, dto);
  }

  @Delete(':reviewId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete my review' })
  @ApiParam({ name: 'reviewId', description: 'Review UUID' })
  async deleteReview(
    @CurrentUser() user: any,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
  ): Promise<{ message: string }> {
    return this.reviewsService.deleteReview(user.id, user.role, reviewId);
  }

  // ==================== PUBLIC ENDPOINTS ====================

  @Get('business/:businessId')
  @Public()
  @ApiOperation({ summary: 'Get all reviews for a business (public)' })
  @ApiParam({ name: 'businessId', description: 'Business UUID' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async getBusinessReviews(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<BusinessReviewsResponseDto> {
    return this.reviewsService.getBusinessReviews(businessId, page, limit);
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
    @CurrentUser() user: any,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
  ): Promise<ReviewWithUserDto> {
    return this.reviewsService.getReviewById(reviewId, user.id, user.role);
  }

  @Delete('admin/:reviewId')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete any review (admin only)' })
  @ApiParam({ name: 'reviewId', description: 'Review UUID' })
  async adminDeleteReview(
    @CurrentUser() user: any,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
  ): Promise<{ message: string }> {
    return this.reviewsService.deleteReview(user.id, user.role, reviewId);
  }
}