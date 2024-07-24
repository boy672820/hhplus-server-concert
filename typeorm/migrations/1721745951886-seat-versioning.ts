import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeatVersioning1721745951886 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE seat
      ADD COLUMN version INT NOT NULL
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE seat
      DROP COLUMN version
      `);
  }
}
