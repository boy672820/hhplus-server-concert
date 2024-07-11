import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class TokenResponse {
  @Exclude()
  private readonly _token: string;

  @ApiProperty({
    description: '대기열 토큰',
    example: 'eyJhbGci',
  })
  @Expose()
  get token(): string {
    return this._token;
  }

  constructor({ token }: { token: string }) {
    this._token = token;
  }

  static of = (token: string): TokenResponse => new TokenResponse({ token });
}
