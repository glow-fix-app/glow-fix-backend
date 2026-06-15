import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import Redis from 'ioredis';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter> | undefined;
  private readonly logger = new Logger(RedisIoAdapter.name);

  constructor(private app: any, private readonly configService: ConfigService) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const host = this.configService.get<string>('redis.host');
    const port = this.configService.get<number>('redis.port');
    const password = this.configService.get<string>('redis.password');
    const tlsConfig = this.configService.get<string | boolean>('redis.tls');
    const tlsEnabled = tlsConfig === true || tlsConfig === 'true';

    const options: any = {
      host,
      port,
      password,
      tls: tlsEnabled ? {} : undefined,
    };

    const pubClient = new Redis(options);
    const subClient = pubClient.duplicate();

    await Promise.all([
      new Promise<void>((resolve, reject) => {
        pubClient.on('ready', () => {
          this.logger.log('Redis pubClient connected successfully');
          resolve();
        });
        pubClient.on('error', (err) => {
          this.logger.error('Redis pubClient connection failed', err);
          reject(err);
        });
      }),
      new Promise<void>((resolve, reject) => {
        subClient.on('ready', () => {
          this.logger.log('Redis subClient connected successfully');
          resolve();
        });
        subClient.on('error', (err) => {
          this.logger.error('Redis subClient connection failed', err);
          reject(err);
        });
      }),
    ]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    if (this.adapterConstructor) {
      server.adapter(this.adapterConstructor);
    } else {
      this.logger.warn('Redis adapter was not initialized properly. Falling back to default adapter.');
    }
    return server;
  }
}
