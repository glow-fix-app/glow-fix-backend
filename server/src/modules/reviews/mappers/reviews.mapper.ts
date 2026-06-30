import { Injectable } from '@nestjs/common';
import { Review } from '@prisma/client';
import { ReviewResponseDto, ReviewWithUserDto } from '../dto/response/review-response.dto';

@Injectable()
export class ReviewsMapper {
  toReviewResponseDto(review: Review): ReviewResponseDto {
    return {
      id: review.id,
      booking_id: review.bookingId,
      rating: review.rating,
      quality_rating: review.qualityRating ?? undefined,
      punctuality_rating: review.punctualityRating ?? undefined,
      communication_rating: review.communicationRating ?? undefined,
      comment: review.comment ?? undefined,
      reply: review.reply ?? undefined,
      replied_at: review.repliedAt ?? undefined,
      created_at: review.createdAt,
      updated_at: review.updatedAt,
    };
  }

  toReviewWithUserDto(
    review: Review,
    clientId: string,
    clientName: string,
    businessId: string,
    businessName: string,
  ): ReviewWithUserDto {
    const responseDto = this.toReviewResponseDto(review);
    return {
      ...responseDto,
      client_id: clientId,
      client_name: clientName,
      business_id: businessId,
      business_name: businessName,
    };
  }
}
