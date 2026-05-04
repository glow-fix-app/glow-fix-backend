import { Injectable, OnModuleInit } from '@nestjs/common';
import * as client from 'prom-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MetricsService implements OnModuleInit {
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

  constructor(private readonly configService: ConfigService) {
    // Initialize all metrics in constructor
    this.httpRequestDuration = new client.Histogram({
      name: 'glowfix_http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10],
    });

    this.httpRequestTotal = new client.Counter({
      name: 'glowfix_http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    this.httpErrorTotal = new client.Counter({
      name: 'glowfix_http_errors_total',
      help: 'Total number of HTTP errors',
      labelNames: ['method', 'route', 'status_code', 'error_code'],
    });

    // Business Metrics
    this.activeUsers = new client.Gauge({
      name: 'glowfix_active_users_total',
      help: 'Number of currently active users',
    });

    this.bookingsCreated = new client.Counter({
      name: 'glowfix_bookings_created_total',
      help: 'Total number of bookings created',
      labelNames: ['service_type', 'payment_method', 'car_wash'],
    });

    this.bookingsCompleted = new client.Counter({
      name: 'glowfix_bookings_completed_total',
      help: 'Total number of bookings completed',
      labelNames: ['service_type', 'car_wash'],
    });

    this.revenueTotal = new client.Counter({
      name: 'glowfix_revenue_cents_total',
      help: 'Total revenue in cents',
      labelNames: ['service_type', 'payment_method'],
    });

    this.loyaltyPointsIssued = new client.Counter({
      name: 'glowfix_loyalty_points_issued_total',
      help: 'Total loyalty points issued',
      labelNames: ['type'],
    });

    this.queueLength = new client.Gauge({
      name: 'glowfix_queue_length',
      help: 'Current queue length per car wash',
      labelNames: ['car_wash'],
    });

    this.websocketConnections = new client.Gauge({
      name: 'glowfix_websocket_connections_active',
      help: 'Number of active WebSocket connections',
    });

    // System Metrics
    this.dbQueryDuration = new client.Histogram({
      name: 'glowfix_db_query_duration_seconds',
      help: 'Duration of database queries in seconds',
      labelNames: ['operation', 'model'],
      buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
    });

    this.cacheHitRatio = new client.Gauge({
      name: 'glowfix_cache_hit_ratio',
      help: 'Cache hit ratio (0-1)',
      labelNames: ['cache_type'],
    });

    this.jobQueueDepth = new client.Gauge({
      name: 'glowfix_job_queue_depth',
      help: 'Number of jobs in BullMQ queue',
      labelNames: ['queue_name', 'status'],
    });
  }

  onModuleInit(): void {
    // Collect default metrics (CPU, memory, event loop, etc.)
    client.collectDefaultMetrics({
      prefix: 'glowfix_',
    });

    // ─── HTTP Metrics ───
    this.httpRequestDuration = new client.Histogram({
      name: 'glowfix_http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10],
    });

    this.httpRequestTotal = new client.Counter({
      name: 'glowfix_http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    this.httpErrorTotal = new client.Counter({
      name: 'glowfix_http_errors_total',
      help: 'Total number of HTTP errors',
      labelNames: ['method', 'route', 'status_code', 'error_code'],
    });

    // ─── Business Metrics ───
    this.activeUsers = new client.Gauge({
      name: 'glowfix_active_users_total',
      help: 'Number of currently active users',
    });

    this.bookingsCreated = new client.Counter({
      name: 'glowfix_bookings_created_total',
      help: 'Total number of bookings created',
      labelNames: ['service_type', 'payment_method', 'car_wash'],
    });

    this.bookingsCompleted = new client.Counter({
      name: 'glowfix_bookings_completed_total',
      help: 'Total number of bookings completed',
      labelNames: ['service_type', 'car_wash'],
    });

    this.revenueTotal = new client.Counter({
      name: 'glowfix_revenue_cents_total',
      help: 'Total revenue in cents',
      labelNames: ['service_type', 'payment_method'],
    });

    this.loyaltyPointsIssued = new client.Counter({
      name: 'glowfix_loyalty_points_issued_total',
      help: 'Total loyalty points issued',
      labelNames: ['type'],
    });

    this.queueLength = new client.Gauge({
      name: 'glowfix_queue_length',
      help: 'Current queue length per car wash',
      labelNames: ['car_wash'],
    });

    this.websocketConnections = new client.Gauge({
      name: 'glowfix_websocket_connections_active',
      help: 'Number of active WebSocket connections',
    });

    // ─── System Metrics ───
    this.dbQueryDuration = new client.Histogram({
      name: 'glowfix_db_query_duration_seconds',
      help: 'Duration of database queries in seconds',
      labelNames: ['operation', 'model'],
      buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
    });

    this.cacheHitRatio = new client.Gauge({
      name: 'glowfix_cache_hit_ratio',
      help: 'Cache hit ratio (0-1)',
      labelNames: ['cache_type'],
    });

    this.jobQueueDepth = new client.Gauge({
      name: 'glowfix_job_queue_depth',
      help: 'Number of jobs in BullMQ queue',
      labelNames: ['queue_name', 'status'],
    });
  }

  async getMetrics(): Promise<string> {
    return client.register.metrics();
  }

  getContentType(): string {
    return client.register.contentType;
  }
}