import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersConsentsTable1737970370736
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users-consents" (
        "id" text,
        "enabled" boolean NOT NULL,
        "userId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "users-consents"
      ADD CONSTRAINT "FK_users-consents_userId"
      FOREIGN KEY ("userId")
      REFERENCES "users"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_users-consents_createdAt"
      ON "users-consents"("createdAt")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users-consents"
      DROP CONSTRAINT "FK_users-consents_userId"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_users-consents_createdAt"
    `);

    await queryRunner.query(`
        DROP TABLE "users-consents"
      `);
  }
}
