import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { WinstonLoggerService } from '../../../common/logger/winston-logger.service';
import { reverseGeocodeCity } from '../../../utils/geocode';
import { UpdateLocationDto } from '../dto/request/update-location.dto';
import { ClientLocationResponseDto } from '../dto/response/user-response.dto';
import { UsersRepository } from '../users.repository';
import { ClientProfileNotFoundException } from '../exceptions/user.exceptions';

@Injectable()
export class LocationService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: WinstonLoggerService,
        private readonly repository: UsersRepository,
    ) { }

    async getClientLocation(userId: string): Promise<ClientLocationResponseDto | null> {
        const client = await this.repository.findClientById(userId);
        if (!client) {
            return null;
        }

        const locationResult = await this.repository.getClientLocation(userId);
        if (!locationResult) {
            return null;
        }

        let city = locationResult.city;
        if (!city) {
            city = await this.resolveCity(locationResult.latitude, locationResult.longitude, userId);
        }

        return {
            latitude: locationResult.latitude,
            longitude: locationResult.longitude,
            city: city ?? undefined,
        };
    }

    async updateClientLocation(userId: string, dto: UpdateLocationDto): Promise<void> {
        const client = await this.repository.findClientById(userId);
        if (!client) {
            throw new ClientProfileNotFoundException();
        }

        let city: string | null = dto.city ?? null;
        if (!city) {
            city = await reverseGeocodeCity(dto.latitude, dto.longitude) ?? null;
        }

        await this.prisma.$executeRaw`
            UPDATE clients 
            SET 
                location = ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326),
                city = ${city}
            WHERE user_id = ${userId}::uuid
        `;

        this.logger.log('Client location updated', 'LocationService', {
            userId,
            latitude: dto.latitude,
            longitude: dto.longitude,
            city,
        });
    }

    async resolveCity(latitude: number, longitude: number, userId: string): Promise<string | null> {
        try {
            const city = await reverseGeocodeCity(latitude, longitude);
            if (city) {
                await this.prisma.$executeRaw`UPDATE clients SET city = ${city} WHERE user_id = ${userId}::uuid`;
                return city;
            }
        } catch (err) {
            this.logger.warn(`Failed to auto-geocode client location: ${err}`);
        }
        return null;
    }
}