import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PaymentRepository } from '../../domain/repositories';
import { Payment } from '../../domain/models';
import { PaymentMapper } from '../mappers/payment.mapper';

@Injectable()
export class PaymentRepositoryImpl implements PaymentRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async save(payment: Payment): Promise<void> {
    const entity = PaymentMapper.toEntity(payment);
    await this.dataSource.manager.save(entity);
  }
}
