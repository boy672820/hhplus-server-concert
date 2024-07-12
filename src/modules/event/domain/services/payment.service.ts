import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repositories';
import Decimal from 'decimal.js';
import { Payment } from '../models';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async create(input: { reservationId: string; amount: Decimal }) {
    const payment = Payment.create({
      reservationId: input.reservationId,
      amount: input.amount,
    });
    await this.paymentRepository.save(payment);
    return payment;
  }
}
