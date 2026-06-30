import { Injectable, Logger } from '@nestjs/common';
import { LoyaltyRepository } from '../repositories/loyalty.repository';
import { LoyaltyMapper } from '../mappers/loyalty.mapper';
import { UpdateLoyaltyConfigDto } from '../dto/request/update-loyalty-config.dto';
import { LoyaltyConfigResponseDto } from '../dto/response/loyalty-config-response.dto';
import { LoyaltyConfig } from '../interfaces/loyalty-config.interface';
import {
  DEFAULT_POINTS_PER_100_EGP,
  DEFAULT_EGP_PER_POINT,
  DEFAULT_MAX_REDEEM_PCT,
  DEFAULT_MIN_POINTS_TO_REDEEM,
  CONFIG_CACHE_TTL_MS,
} from '../constants/loyalty.constants';

@Injectable()
export class LoyaltyConfigService {
  private readonly logger = new Logger(LoyaltyConfigService.name);
  private cachedConfig: LoyaltyConfig | null = null;
  private configCacheTime: Date | null = null;

  constructor(
    private readonly repository: LoyaltyRepository,
    private readonly mapper: LoyaltyMapper,
  ) {}

  async getConfig(): Promise<LoyaltyConfig> {
    if (
      this.cachedConfig &&
      this.configCacheTime &&
      Date.now() - this.configCacheTime.getTime() < CONFIG_CACHE_TTL_MS
    ) {
      return this.cachedConfig;
    }

    let config = await this.repository.findActiveConfig();

    if (!config) {
      config = await this.repository.createConfig({
        pointsPer100Egp: DEFAULT_POINTS_PER_100_EGP,
        egpPerPoint: DEFAULT_EGP_PER_POINT,
        maxRedeemPct: DEFAULT_MAX_REDEEM_PCT,
        isActive: true,
      });
    }

    this.cachedConfig = {
      id: config.id,
      points_per_100_egp: config.pointsPer100Egp,
      egp_per_point: Number(config.egpPerPoint),
      max_redeem_pct: config.maxRedeemPct,
      min_points_to_redeem: DEFAULT_MIN_POINTS_TO_REDEEM,
      points_expiry_days: null,
      is_active: config.isActive,
    };
    this.configCacheTime = new Date();

    return this.cachedConfig;
  }

  async updateConfig(
    adminId: string,
    dto: UpdateLoyaltyConfigDto,
  ): Promise<LoyaltyConfigResponseDto> {
    const config = await this.repository.findConfig();

    if (!config) {
      const newConfig = await this.repository.createConfig({
        pointsPer100Egp: dto.points_per_100_egp ?? DEFAULT_POINTS_PER_100_EGP,
        egpPerPoint: dto.egp_per_point ?? DEFAULT_EGP_PER_POINT,
        maxRedeemPct: dto.max_redeem_pct ?? DEFAULT_MAX_REDEEM_PCT,
        isActive: dto.is_active ?? true,
      });

      this.cachedConfig = null;
      this.logger.log(`Loyalty config created by admin ${adminId}`);

      return this.mapper.toConfigResponse(newConfig);
    }

    const updated = await this.repository.updateConfig(config.id, {
      pointsPer100Egp: dto.points_per_100_egp,
      egpPerPoint: dto.egp_per_point,
      maxRedeemPct: dto.max_redeem_pct,
      isActive: dto.is_active,
    });

    this.cachedConfig = null; // Invalidate cache
    this.logger.log(`Loyalty config updated by admin ${adminId}`);

    return this.mapper.toConfigResponse(updated);
  }
}
