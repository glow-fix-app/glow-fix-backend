import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDateString, IsInt, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export enum TimeRange {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  THIS_WEEK = 'this_week',
  LAST_WEEK = 'last_week',
  THIS_MONTH = 'this_month',
  LAST_MONTH = 'last_month',
  THIS_QUARTER = 'this_quarter',
  THIS_YEAR = 'this_year',
  CUSTOM = 'custom',
}

export enum MetricType {
  REVENUE = 'revenue',
  BOOKINGS = 'bookings',
  USERS = 'users',
  BUSINESSES = 'businesses',
}

export class AnalyticsQueryDto {
  @ApiPropertyOptional({ enum: TimeRange, default: TimeRange.THIS_MONTH })
  @IsOptional()
  @IsEnum(TimeRange)
  range?: TimeRange = TimeRange.THIS_MONTH;

  @ApiPropertyOptional({ description: 'Start date for custom range (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ description: 'End date for custom range (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({ description: 'Business ID for manager view' })
  @IsOptional()
  @IsUUID()
  business_id?: string;

  @ApiPropertyOptional({ description: 'Group by interval: day, week, month, year' })
  @IsOptional()
  @IsString()
  group_by?: 'day' | 'week' | 'month' | 'year';
}

export class BusinessAnalyticsQueryDto extends AnalyticsQueryDto {
  @ApiProperty({ description: 'Business ID' })
  @IsUUID()
  business_id: string;
}

export class ExportReportDto {
  @ApiPropertyOptional({ description: 'Start date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ description: 'End date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({ description: 'Format: csv, pdf, excel' })
  @IsOptional()
  @IsString()
  format?: string = 'csv';
}