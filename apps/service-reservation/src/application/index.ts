import { Type } from '@nestjs/common';
import { InvokeMockApiUseCase } from './usecases';

export const usecases: Type<any>[] = [InvokeMockApiUseCase];
