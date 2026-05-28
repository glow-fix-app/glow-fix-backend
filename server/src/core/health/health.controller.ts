import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { HealthService } from './health.service';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('live')
  @Public()
  @ApiOperation({ summary: 'Liveness probe' })
  async liveness(): Promise<{ status: string; timestamp: string }> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('ready')
  @Public()
  @ApiOperation({ summary: 'Readiness probe' })
  async readiness(): Promise<{
    status: string;
    checks: Record<string, string>;
    timestamp: string;
  }> {
    const checks = await this.healthService.checkReadiness();
    const allHealthy = Object.values(checks).every((status) => status === 'ok');

    return {
      status: allHealthy ? 'ready' : 'degraded',
      checks,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('detailed')
  @ApiOperation({ summary: 'Detailed health check (admin only)' })
  async detailed(): Promise<Record<string, unknown>> {
    return this.healthService.getDetailedHealth();
  }
}