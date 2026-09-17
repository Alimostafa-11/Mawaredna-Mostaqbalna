import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, STATES } from 'mongoose';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  /**
   * Shape kept flat and cheap: this is what the ALB / App Runner health check
   * polls, so it must not touch application collections.
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Liveness and database connectivity' })
  check() {
    const state = STATES[this.connection.readyState] ?? 'unknown';
    const isUp = this.connection.readyState === STATES.connected;

    return {
      status: isUp ? 'ok' : 'degraded',
      database: state,
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}
