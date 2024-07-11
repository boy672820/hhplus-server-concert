import { Type } from '@nestjs/common';
import { GenerateTokenUsecase } from './usecases/generate-token.usecase';

export const usecases: Type<any>[] = [GenerateTokenUsecase];
