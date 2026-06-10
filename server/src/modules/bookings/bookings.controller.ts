import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtPayload, UserRole } from '@glow-fix/types';
import { BookingsService } from './bookings.service';
import { BookingsPresenter } from './bookings.presenter';
import {
  QueryManagerBookingsDto,
  UpdateBookingStatusDto,
  UpdateExpectedDeliveryDto,
  CreateBookingNoteDto,
  CreateDiagnosticReportDto,
  CreateReportFindingDto,
  CreateRecommendedRepairDto,
} from './dto';
import {
  BookingEntity,
  BookingNoteEntity,
  DiagnosticReportEntity,
  ReportFindingEntity,
  RecommendedRepairEntity,
  PaginatedBookingsEntity,
} from './entities';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Manager Bookings')
@Controller({ path: 'manager/bookings', version: '1' })
@ApiBearerAuth('access-token')
@Roles(UserRole.MANAGER)
@UseGuards(RolesGuard)
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly bookingsPresenter: BookingsPresenter,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get all bookings for the manager's business (paginated)" })
  @ApiResponse({
    status: 200,
    description: 'List of bookings with metadata.',
    type: PaginatedBookingsEntity,
  })
  async listBookings(
    @CurrentUser() user: JwtPayload,
    @Query() query: QueryManagerBookingsDto,
  ): Promise<PaginatedBookingsEntity> {
    const managerId = user.sub;
    const { bookings, total } = await this.bookingsService.listBookings(managerId, query);
    return this.bookingsPresenter.toPaginatedBookingsEntity(
      bookings,
      total,
      query.page || 1,
      query.limit || 10,
    );
  }

  @Get(':bookingId')
  @ApiOperation({ summary: 'Get full details of a specific booking' })
  @ApiParam({ name: 'bookingId', description: 'Booking UUID' })
  @ApiResponse({
    status: 200,
    description: 'Booking detailed view.',
    type: BookingEntity,
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async getBookingDetails(
    @CurrentUser() user: JwtPayload,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
  ): Promise<BookingEntity> {
    const managerId = user.sub;
    const booking = await this.bookingsService.getBookingDetails(managerId, bookingId);
    return this.bookingsPresenter.toBookingEntity(booking)!;
  }

  @Patch(':bookingId/status')
  @ApiOperation({ summary: 'Transition and update a booking status (append-only)' })
  @ApiParam({ name: 'bookingId', description: 'Booking UUID' })
  @ApiResponse({
    status: 200,
    description: 'Status successfully updated.',
    type: BookingEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid transition or booking already closed.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async updateBookingStatus(
    @CurrentUser() user: JwtPayload,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Body() dto: UpdateBookingStatusDto,
  ): Promise<BookingEntity> {
    const managerId = user.sub;
    const booking = await this.bookingsService.updateBookingStatus(managerId, bookingId, dto);
    return this.bookingsPresenter.toBookingEntity(booking)!;
  }

  @Patch(':bookingId/expected-delivery')
  @ApiOperation({ summary: 'Update expected delivery date for a booking' })
  @ApiParam({ name: 'bookingId', description: 'Booking UUID' })
  @ApiResponse({
    status: 200,
    description: 'Expected delivery timestamp updated.',
    type: BookingEntity,
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async updateExpectedDelivery(
    @CurrentUser() user: JwtPayload,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Body() dto: UpdateExpectedDeliveryDto,
  ): Promise<BookingEntity> {
    const managerId = user.sub;
    const booking = await this.bookingsService.updateExpectedDelivery(managerId, bookingId, dto);
    return this.bookingsPresenter.toBookingEntity(booking)!;
  }

  @Get(':bookingId/notes')
  @ApiOperation({ summary: 'Retrieve all notes associated with a booking' })
  @ApiParam({ name: 'bookingId', description: 'Booking UUID' })
  @ApiResponse({
    status: 200,
    description: 'List of booking notes.',
    type: [BookingNoteEntity],
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async getBookingNotes(
    @CurrentUser() user: JwtPayload,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
  ): Promise<BookingNoteEntity[]> {
    const managerId = user.sub;
    const notes = await this.bookingsService.getBookingNotes(managerId, bookingId);
    return this.bookingsPresenter.toBookingNoteEntityList(notes);
  }

  @Post(':bookingId/notes')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new internal note to a booking' })
  @ApiParam({ name: 'bookingId', description: 'Booking UUID' })
  @ApiResponse({
    status: 201,
    description: 'Note successfully added.',
    type: BookingNoteEntity,
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async createBookingNote(
    @CurrentUser() user: JwtPayload,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Body() dto: CreateBookingNoteDto,
  ): Promise<BookingNoteEntity> {
    const managerId = user.sub;
    const note = await this.bookingsService.createBookingNote(managerId, bookingId, dto);
    return this.bookingsPresenter.toBookingNoteEntity(note)!;
  }

  @Post(':bookingId/diagnostic-report')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a diagnostic report with optional findings and recommended repairs' })
  @ApiParam({ name: 'bookingId', description: 'Booking UUID' })
  @ApiResponse({
    status: 201,
    description: 'Diagnostic report created successfully.',
    type: DiagnosticReportEntity,
  })
  @ApiResponse({ status: 409, description: 'Report already exists.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async createDiagnosticReport(
    @CurrentUser() user: JwtPayload,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Body() dto: CreateDiagnosticReportDto,
  ): Promise<DiagnosticReportEntity> {
    const managerId = user.sub;
    const report = await this.bookingsService.createDiagnosticReport(managerId, bookingId, dto);
    return this.bookingsPresenter.toDiagnosticReportEntity(report)!;
  }

  @Get(':bookingId/diagnostic-report')
  @ApiOperation({ summary: 'Get diagnostic report details for a booking' })
  @ApiParam({ name: 'bookingId', description: 'Booking UUID' })
  @ApiResponse({
    status: 200,
    description: 'Diagnostic report details.',
    type: DiagnosticReportEntity,
  })
  @ApiResponse({ status: 404, description: 'Report or booking not found.' })
  async getDiagnosticReport(
    @CurrentUser() user: JwtPayload,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
  ): Promise<DiagnosticReportEntity> {
    const managerId = user.sub;
    const report = await this.bookingsService.getDiagnosticReport(managerId, bookingId);
    return this.bookingsPresenter.toDiagnosticReportEntity(report)!;
  }

  @Post(':bookingId/diagnostic-report/findings')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add an individual finding to the diagnostic report' })
  @ApiParam({ name: 'bookingId', description: 'Booking UUID' })
  @ApiResponse({
    status: 201,
    description: 'Finding added.',
    type: ReportFindingEntity,
  })
  @ApiResponse({ status: 404, description: 'Report or booking not found.' })
  async addReportFinding(
    @CurrentUser() user: JwtPayload,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Body() dto: CreateReportFindingDto,
  ): Promise<ReportFindingEntity> {
    const managerId = user.sub;
    const finding = await this.bookingsService.addReportFinding(managerId, bookingId, dto);
    return this.bookingsPresenter.toReportFindingEntity(finding)!;
  }

  @Post(':bookingId/diagnostic-report/recommended-repairs')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Recommend a catalog service repair for a diagnostic report' })
  @ApiParam({ name: 'bookingId', description: 'Booking UUID' })
  @ApiResponse({
    status: 201,
    description: 'Recommended repair added.',
    type: RecommendedRepairEntity,
  })
  @ApiResponse({ status: 404, description: 'Report or booking not found.' })
  async addRecommendedRepair(
    @CurrentUser() user: JwtPayload,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Body() dto: CreateRecommendedRepairDto,
  ): Promise<RecommendedRepairEntity> {
    const managerId = user.sub;
    const repair = await this.bookingsService.addRecommendedRepair(managerId, bookingId, dto);
    return this.bookingsPresenter.toRecommendedRepairEntity(repair)!;
  }

  @Delete(':bookingId/diagnostic-report/recommended-repairs/:repairId')
  @ApiOperation({ summary: 'Delete a recommended repair from a diagnostic report' })
  @ApiParam({ name: 'bookingId', description: 'Booking UUID' })
  @ApiParam({ name: 'repairId', description: 'Recommended Repair UUID' })
  @ApiResponse({
    status: 200,
    description: 'Recommended repair deleted.',
  })
  @ApiResponse({ status: 404, description: 'Recommended repair or report not found.' })
  async deleteRecommendedRepair(
    @CurrentUser() user: JwtPayload,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Param('repairId', ParseUUIDPipe) repairId: string,
  ): Promise<{ success: boolean; message: string }> {
    const managerId = user.sub;
    return this.bookingsService.deleteRecommendedRepair(managerId, bookingId, repairId);
  }
}
