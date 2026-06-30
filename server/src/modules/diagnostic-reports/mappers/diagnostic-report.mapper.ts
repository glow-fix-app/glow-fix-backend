import { Injectable } from '@nestjs/common';
import { DiagnosticReportResponseDto, ReportSummaryDto } from '../dto/response/report-response.dto';
import { FindingPriority } from '../constants/diagnostic-report.constants';

@Injectable()
export class DiagnosticReportMapper {
  
  toResponseDto(report: any): DiagnosticReportResponseDto {
    const totalCost = report.recommendedRepairs.reduce(
      (sum: number, r: any) => sum + (r.price ? Number(r.price) : 0),
      0,
    );

    return {
      id: report.id,
      booking_id: report.bookingId,
      booking_code: `BK-${report.bookingId.slice(0, 8).toUpperCase()}`,
      summary: report.summary,
      valid_until: report.validUntil || undefined,
      estimated_duration: report.estimatedDuration || undefined,
      client_action: report.clientAction || undefined,
      client_action_at: report.clientActionAt || undefined,
      findings: report.findings.map((f: any) => ({
        id: f.id,
        title: f.title,
        description: f.description || undefined,
        priority: f.priority,
      })),
      recommended_repairs: report.recommendedRepairs.map((r: any) => ({
        id: r.id,
        business_service_id: r.businessServiceId,
        title: r.title || 'Repair Service',
        description: r.description || undefined,
        price: r.price ? Number(r.price) : 0,
        duration_minutes: r.durationMinutes || 60,
        is_selected: r.isSelected || false,
      })),
      total_repair_cost: totalCost,
      created_at: report.createdAt,
      updated_at: report.updatedAt,
    };
  }

  toSummaryDto(report: any): ReportSummaryDto {
    const { criticalCount, warningCount, infoCount } = this.countFindingsByPriority(report.findings);

    const totalCost = report.recommendedRepairs.reduce(
      (sum: number, r: any) => sum + (r.price ? Number(r.price) : 0),
      0,
    );

    return {
      report_id: report.id,
      booking_id: report.bookingId,
      booking_code: `BK-${report.bookingId.slice(0, 8).toUpperCase()}`,
      summary: report.summary,
      critical_count: criticalCount,
      warning_count: warningCount,
      info_count: infoCount,
      total_repairs: report.recommendedRepairs.length,
      total_cost: totalCost,
      client_action: report.clientAction || undefined,
      created_at: report.createdAt,
    };
  }

  private countFindingsByPriority(findings: any[]) {
    return findings.reduce(
      (counts, f) => {
        if (f.priority === FindingPriority.CRITICAL) counts.criticalCount++;
        else if (f.priority === FindingPriority.WARNING) counts.warningCount++;
        else if (f.priority === FindingPriority.INFO) counts.infoCount++;
        return counts;
      },
      { criticalCount: 0, warningCount: 0, infoCount: 0 }
    );
  }
}
