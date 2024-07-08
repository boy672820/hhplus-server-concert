import { app } from './initializeApp';
import { Test } from 'supertest';
import * as supertest from 'supertest';

interface Options {
  get?: string;
  post?: string;
  put?: string;
  patch?: string;
  delete?: string;
  auth?: boolean;
  isWrongToken?: boolean;
}

export const authRequest = (
  options: Options = {
    auth: true,
    isWrongToken: false,
  },
): Test => {
  if (!app) {
    throw new Error('테스트 앱이 초기화되지 않았습니다.');
  }

  if (
    !options.get &&
    !options.post &&
    !options.put &&
    !options.patch &&
    !options.delete
  ) {
    throw new Error(
      '옵션으로 get, post, put, patch, delete 중 하나를 선택해야 합니다.',
    );
  }

  const method = options?.get
    ? 'get'
    : options?.post
      ? 'post'
      : options?.put
        ? 'put'
        : options?.patch
          ? 'patch'
          : 'delete';
  const path = (options.get ||
    options.post ||
    options.put ||
    options.patch ||
    options.delete) as string;

  if (!options.auth) {
    return supertest(app.getHttpServer())[method](path);
  }

  const token = options.isWrongToken
    ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMUoyODFSU1ZaSkZLRVMxWjBQTTk3RDZLWSIsImlhdCI6MTUxNjIzOTAyMn0.OralVfQoRHqjnE-zpTxPiLXk_yNi5h0n2pvZaS1WxRw' // userId: 01J281RSVZJFKES1Z0PM97D6KY
    : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMUoyODFUMkNDQjhTNEVKSEE3OTFHTkNUSCIsImlhdCI6MTUxNjIzOTAyMn0.Qdrvqhxt7yrzlpJKAOyNKKssZDjJGigXlOM9vMnfFHg'; // userId: 01J281T2CCB8S4EJHA791GNCTH

  // return supertest(app.getHttpServer()).auth(token, { type: 'bearer' });
  const agent = supertest(app.getHttpServer())
    [method](path)
    .auth(token, { type: 'bearer' });

  return agent;
};
