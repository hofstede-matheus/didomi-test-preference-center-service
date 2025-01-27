import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersConsentsTable1737970370736
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users-consents" (
        "id" uuid PRIMARY KEY,
        "consent_id" text,
        "enabled" boolean NOT NULL,
        "user_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "users-consents"
      ADD CONSTRAINT "FK_users-consents_user_id"
      FOREIGN KEY ("user_id")
      REFERENCES "users"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_users-consents_created_at"
      ON "users-consents"("created_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users-consents"
      DROP CONSTRAINT "FK_users-consents_user_id"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_users-consents_created_at"
    `);

    await queryRunner.query(`
        DROP TABLE "users-consents"
      `);
  }
}
