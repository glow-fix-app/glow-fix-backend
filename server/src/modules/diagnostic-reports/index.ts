export { DiagnosticReportsModule } from './diagnostic-reports.module';
export { DiagnosticReportsController } from './diagnostic-reports.controller';

// Services
export { DiagnosticReportsService } from './services/diagnostic-reports.service';

// Constants
export { FindingPriority, ClientAction, DIAGNOSTIC_EVENTS } from './constants/diagnostic-report.constants';

// Request DTOs
export { CreateDiagnosticReportDto, CreateFindingDto, CreateRepairDto } from './dto/request/create-report.dto';
export { UpdateDiagnosticReportDto } from './dto/request/update-report.dto';
export { ClientActionDto } from './dto/request/client-action.dto';

// Response DTOs
export { DiagnosticReportResponseDto, ReportSummaryDto, FindingResponseDto, RepairResponseDto } from './dto/response/report-response.dto';
