import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class BookingStateMachineService {
  private readonly TRANSITIONS: Record<string, string[]> = {
    PENDING: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
    ACCEPTED: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['VEHICLE_RECEIVED', 'IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'],
    VEHICLE_RECEIVED: ['IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'],
    DIAGNOSIS_SENT: ['IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'],
    DIAGNOSIS_ACCEPTED: ['IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'],
    DIAGNOSIS_REJECTED: ['CANCELLED', 'IN_PROGRESS'],
    IN_PROGRESS: ['READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'],
    READY_FOR_PICKUP: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: [],
    REJECTED: []
  };

  validateTransition(current: string, target: string): void {
    const allowed = this.TRANSITIONS[current] || [];
    if (!allowed.includes(target)) {
      throw new BadRequestException(`Invalid status transition from ${current} to ${target}`);
    }
  }

  getLatestStatusContext(statusHistory: any[]): string {
    if (!statusHistory || statusHistory.length === 0) return 'PENDING';
    return statusHistory[statusHistory.length - 1].status.context;
  }
}
