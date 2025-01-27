import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { UserModule } from '../src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeOrmEntity } from '../src/user/infra/database/typeorm/entities/user.entity';
import { CreateUserRequest } from '../src/user/infra/presentation/http/dto/create-user';
import { connectionSource } from '../ormconfig-test';
import { ConsentModule } from '../src/consent/consent.module';
import { UserConsentTypeOrmEntity } from '../src/consent/infra/database/typeorm/entities/user-consent.entity';
import { CreateUserConsentEventRequest } from '../src/consent/infra/presentation/http/dto/create-event';
import { TEST_METADATA } from './helpers';

describe('consents', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    await connectionSource.initialize();

    const moduleFixture: TestingModule =
      await Test.createTestingModule(TEST_METADATA).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await connectionSource.destroy();
  });

  afterEach(async () => {
    await connectionSource.query('DELETE FROM users');
    await connectionSource.query(`DELETE FROM "users-consents"`);
  });

  it('should be able to create a consent', async () => {
    const validUserBody: CreateUserRequest = {
      email: 'valid@email.com',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(validUserBody)
      .expect(201);

    const createConsentBody: CreateUserConsentEventRequest = {
      user: {
        id: (response.body as { id: string }).id,
      },
      consents: [
        {
          id: 'email_notifications',
          enabled: true,
        },
      ],
    };

    await request(app.getHttpServer())
      .post('/events')
      .send(createConsentBody)
      .expect(201);

    const userResponse = await request(app.getHttpServer())
      .get(`/users/${createConsentBody.user.id}`)
      .expect(200);

    const userResponseConsents: { id: string; enabled: boolean }[] = (
      userResponse.body as {
        id: string;
        email: string;
        consents: { id: string; enabled: boolean }[];
      }
    ).consents;

    expect(userResponseConsents).toHaveLength(1);
    expect(userResponseConsents[0].id).toBe('email_notifications');
    expect(userResponseConsents[0].enabled).toBe(true);

    const createConsentBody2: CreateUserConsentEventRequest = {
      user: {
        id: (response.body as { id: string }).id,
      },
      consents: [
        {
          id: 'email_notifications',
          enabled: false,
        },
        {
          id: 'sms_notifications',
          enabled: true,
        },
      ],
    };

    await request(app.getHttpServer())
      .post('/events')
      .send(createConsentBody2)
      .expect(201);

    const userResponse2 = await request(app.getHttpServer())
      .get(`/users/${createConsentBody.user.id}`)
      .expect(200);

    const userResponseConsents2: { id: string; enabled: boolean }[] = (
      userResponse2.body as {
        id: string;
        email: string;
        consents: { id: string; enabled: boolean }[];
      }
    ).consents;

    expect(userResponseConsents2).toHaveLength(2);
    expect(userResponseConsents2[0].id).toBe('email_notifications');
    expect(userResponseConsents2[0].enabled).toBe(false);
    expect(userResponseConsents2[1].id).toBe('sms_notifications');
    expect(userResponseConsents2[1].enabled).toBe(true);
  });

  it('should not be able to create a consent with an invalid user', async () => {
    const createConsentBody: CreateUserConsentEventRequest = {
      user: {
        id: 'invalid-id',
      },
      consents: [
        {
          id: 'email_notifications',
          enabled: true,
        },
      ],
    };

    await request(app.getHttpServer())
      .post('/events')
      .send(createConsentBody)
      .expect(404);
  });

  it('should not be able to create a consent with a user that does not exist', async () => {
    const createConsentBody: CreateUserConsentEventRequest = {
      user: {
        id: '00000000-0000-0000-0000-000000000000',
      },
      consents: [
        {
          id: 'email_notifications',
          enabled: true,
        },
      ],
    };

    await request(app.getHttpServer())
      .post('/events')
      .send(createConsentBody)
      .expect(404);
  });

  it('should not be able to create a consent with an invalid consent', async () => {
    const validUserBody: CreateUserRequest = {
      email: 'valid@email.com',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(validUserBody)
      .expect(201);

    const createConsentBody: CreateUserConsentEventRequest = {
      user: {
        id: (response.body as { id: string }).id,
      },
      consents: [
        {
          id: 'invalid-consent',
          enabled: true,
        },
      ],
    };

    await request(app.getHttpServer())
      .post('/events')
      .send(createConsentBody)
      .expect(422);
  });
});
