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
import { GetUserRequest } from '../src/user/infra/presentation/http/dto/get-user';
import { v4 as uuidv4 } from 'uuid';

describe('users', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    await connectionSource.initialize();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          migrations: ['src/core/database/typeorm/migrations/*.ts'],
          migrationsRun: true,
          entities: [UserTypeOrmEntity],
          logging: process.env.DATABASE_LOGGING === 'true',
        }),
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await connectionSource.destroy();
  });

  afterEach(async () => {
    await connectionSource.query('DELETE FROM users');
  });

  it('should be able to create a user with valid email', () => {
    const validUserBody: CreateUserRequest = {
      email: 'valid@email.com',
    };

    return request(app.getHttpServer())
      .post('/users')
      .send(validUserBody)
      .expect(201);
  });

  it('should not be able to create a user with invalid email', () => {
    const invalidUserBody: CreateUserRequest = {
      email: 'invalid-email',
    };

    return request(app.getHttpServer())
      .post('/users')
      .send(invalidUserBody)
      .expect(422);
  });

  it('should not be able to create a user with an already registered email', async () => {
    const validUserBody: CreateUserRequest = {
      email: 'valid@email.com',
    };

    await request(app.getHttpServer())
      .post('/users')
      .send(validUserBody)
      .expect(201);

    return request(app.getHttpServer())
      .post('/users')
      .send(validUserBody)
      .expect(422);
  });

  it('should be able to get a user', async () => {
    const validUserBody: CreateUserRequest = {
      email: 'valid@email.com',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(validUserBody)
      .expect(201);

    const getUserBody: GetUserRequest = {
      id: (response.body as { id: string }).id,
    };

    return request(app.getHttpServer())
      .get(`/users/${getUserBody.id}`)
      .expect(200);
  });

  it('should not be able to get a user with invalid id', () => {
    const invalidUserBody: GetUserRequest = {
      id: 'invalid-id',
    };

    return request(app.getHttpServer())
      .get(`/users/${invalidUserBody.id}`)
      .expect(404);
  });

  it('should not be able to get a user that does not exist', () => {
    const invalidUserBody: GetUserRequest = {
      id: uuidv4(),
    };

    return request(app.getHttpServer())
      .get(`/users/${invalidUserBody.id}`)
      .expect(404);
  });

  it('should be able to delete a user', async () => {
    const validUserBody: CreateUserRequest = {
      email: 'valid@email.com',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(validUserBody)
      .expect(201);

    const deleteUserBody: GetUserRequest = {
      id: (response.body as { id: string }).id,
    };

    return request(app.getHttpServer())
      .delete(`/users/${deleteUserBody.id}`)
      .expect(200);
  });

  it('should not be able to delete a user with invalid id', () => {
    const invalidUserBody: GetUserRequest = {
      id: 'invalid-id',
    };

    return request(app.getHttpServer())
      .delete(`/users/${invalidUserBody.id}`)
      .expect(200);
  });

  it('should not be able to delete a user that does not exist', () => {
    const invalidUserBody: GetUserRequest = {
      id: uuidv4(),
    };

    return request(app.getHttpServer())
      .delete(`/users/${invalidUserBody.id}`)
      .expect(200);
  });
});
