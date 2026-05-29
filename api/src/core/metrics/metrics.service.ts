import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService {
  private static defaultMetricsRegistered = false;

  // HTTP Metrics
  public httpRequestDuration: client.Histogram;
  public httpRequestTotal: client.Counter;
  public httpErrorTotal: client.Counter;

  // Business Metrics
  public activeUsers: client.Gauge;
  public bookingsCreated: client.Counter;
  public bookingsCompleted: client.Counter;
  public revenueTotal: client.Counter;
  public loyaltyPointsIssued: client.Counter;
  public queueLength: client.Gauge;
  public websocketConnections: client.Gauge;

  // System Metrics
  public dbQueryDuration: client.Histogram;
  public cacheHitRatio: client.Gauge;
  public jobQueueDepth: client.Gauge;

  constructor() {
    this.initializeMetrics();
    if (!MetricsService.defaultMetricsRegistered) {
      client.collectDefaultMetrics({ prefix: 'glowfix_' });
      MetricsService.defaultMetricsRegistered = true;
    }
  }

  async getMetrics(): Promise<string> {
    return client.register.metrics();
  }

  getContentType(): string {
    return client.register.contentType;
  }

  private initializeMetrics(): void {
    this.httpRequestDuration = this.getOrCreateHistogram(
      'glowfix_http_request_duration_seconds',
      'Duration of HTTP requests in seconds',
      ['method', 'route', 'status_code'],
      [0.01, 0.05, 0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10],
    );

    this.httpRequestTotal = this.getOrCreateCounter(
      'glowfix_http_requests_total',
      'Total number of HTTP requests',
      ['method', 'route', 'status_code'],
    );

    this.httpErrorTotal = this.getOrCreateCounter(
      'glowfix_http_errors_total',
      'Total number of HTTP errors',
      ['method', 'route', 'status_code', 'error_code'],
    );

    this.activeUsers = this.getOrCreateGauge(
      'glowfix_active_users_total',
      'Number of currently active users',
    );

    this.bookingsCreated = this.getOrCreateCounter(
      'glowfix_bookings_created_total',
      'Total number of bookings created',
      ['service_type', 'payment_method', 'car_wash'],
    );

    this.bookingsCompleted = this.getOrCreateCounter(
      'glowfix_bookings_completed_total',
      'Total number of bookings completed',
      ['service_type', 'car_wash'],
    );

    this.revenueTotal = this.getOrCreateCounter(
      'glowfix_revenue_cents_total',
      'Total revenue in cents',
      ['service_type', 'payment_method'],
    );

    this.loyaltyPointsIssued = this.getOrCreateCounter(
      'glowfix_loyalty_points_issued_total',
      'Total loyalty points issued',
      ['type'],
    );

    this.queueLength = this.getOrCreateGauge(
      'glowfix_queue_length',
      'Current queue length per car wash',
      ['car_wash'],
    );

    this.websocketConnections = this.getOrCreateGauge(
      'glowfix_websocket_connections_active',
      'Number of active WebSocket connections',
    );

    this.dbQueryDuration = this.getOrCreateHistogram(
      'glowfix_db_query_duration_seconds',
      'Duration of database queries in seconds',
      ['operation', 'model'],
      [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
    );

    this.cacheHitRatio = this.getOrCreateGauge(
      'glowfix_cache_hit_ratio',
      'Cache hit ratio (0-1)',
      ['cache_type'],
    );

    this.jobQueueDepth = this.getOrCreateGauge(
      'glowfix_job_queue_depth',
      'Number of jobs in BullMQ queue',
      ['queue_name', 'status'],
    );
  }

  private getOrCreateCounter(
    name: string,
    help: string,
    labelNames: string[] = [],
  ): client.Counter {
    const existing = client.register.getSingleMetric(name);
    if (existing) {
      return existing as client.Counter;
    }
    return new client.Counter({ name, help, labelNames });
  }

  private getOrCreateGauge(
    name: string,
    help: string,
    labelNames: string[] = [],
  ): client.Gauge {
    const existing = client.register.getSingleMetric(name);
    if (existing) {
      return existing as client.Gauge;
    }
    return new client.Gauge({ name, help, labelNames });
  }

  private getOrCreateHistogram(
    name: string,
    help: string,
    labelNames: string[],
    buckets: number[],
  ): client.Histogram {
    const existing = client.register.getSingleMetric(name);
    if (existing) {
      return existing as client.Histogram;
    }
    return new client.Histogram({ name, help, labelNames, buckets });
  }
}
