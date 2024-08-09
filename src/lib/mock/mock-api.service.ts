import { Injectable } from '@nestjs/common';

@Injectable()
export class MockApiService {
  send = (...args: any[]): Promise<void> =>
    new Promise((resolve) =>
      setTimeout(
        () => {
          console.log('Mock API: send', args);
          resolve();
        },
        Math.random() * 1000 + 5000,
      ),
    );
}
