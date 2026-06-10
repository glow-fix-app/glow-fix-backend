// diagnostic-reports.module.ts
import { Module } from '@nestjs/common';
import { DiagnosticReportsController } from './diagnostic-reports.controller';
import { DiagnosticReportsService } from './diagnostic-reports.service';

@Module({
  controllers: [DiagnosticReportsController],
  providers: [DiagnosticReportsService],
  exports: [DiagnosticReportsService],
})
export class DiagnosticReportsModule {}