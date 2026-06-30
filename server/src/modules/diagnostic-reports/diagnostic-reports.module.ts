import { Module } from '@nestjs/common';
import { DiagnosticReportsController } from './diagnostic-reports.controller';
import { DiagnosticReportsService } from './services/diagnostic-reports.service';
import { DiagnosticReportsRepository } from './repositories/diagnostic-reports.repository';
import { DiagnosticReportMapper } from './mappers/diagnostic-report.mapper';

@Module({
  controllers: [DiagnosticReportsController],
  providers: [
    DiagnosticReportsService,
    DiagnosticReportsRepository,
    DiagnosticReportMapper,
  ],
  exports: [DiagnosticReportsService],
})
export class DiagnosticReportsModule {}