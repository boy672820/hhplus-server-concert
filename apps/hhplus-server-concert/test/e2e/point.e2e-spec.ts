import { Test } from '@nestjs/testing';
import { PointModule } from '../../src/modules/point/point.module';
import { initializeApp, authRequest } from '../fixtures';

describe('PointController (e2e)', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PointModule],
    }).compile();

    await initializeApp(moduleRef);
  });

  describe('GET /point', () => {
    it('내 포인트를 조회합니다.', () =>
      authRequest({ get: '/point' }).expect(200));

    describe('포인트 조회 실패', () => {
      it('사용자가 로그인하지 않은 경우', () =>
        authRequest({ get: '/point', auth: false }).expect(401));

      it('사용자가 존재하지 않은 경우', () =>
        authRequest({ get: '/point', isWrongToken: true }).expect(403));
    });
  });

  describe('POST /point/charge', () => {
    it('포인트를 충전합니다.', () =>
      authRequest({ post: '/point/charge' }).expect(200));

    describe('포인트 충전 실패', () => {
      describe('잘못된 금액을 입력한 경우', () => {
        it('음수', () =>
          authRequest({ post: '/point/charge' })
            .send({ amount: -100 })
            .expect(400));

        it('숫자가 아닌 값', () =>
          authRequest({ post: '/point/charge' })
            .send({ amount: '백만원!' })
            .expect(400));

        it('빈 값', () =>
          authRequest({ post: '/point/charge' })
            .send({ amount: '' })
            .expect(400));
      });

      it('사용자가 로그인하지 않은 경우', () =>
        authRequest({ post: '/point/charge' }).expect(401));
    });
  });
});
