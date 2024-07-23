import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1721718164020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createDatabase('concert', true);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS event (
        id CHAR(26) NOT NULL,
        title VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        startDate DATETIME NOT NULL,
        endDate DATETIME NOT NULL,
        createdDate DATETIME NOT NULL,
        updatedDate DATETIME NOT NULL,
        PRIMARY KEY (id))
      ENGINE = InnoDB
      DEFAULT CHARACTER SET = utf8mb4
      COLLATE = utf8mb4_general_ci;
      `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS concert.schedule (
        id CHAR(26) NOT NULL,
        startDate DATETIME NOT NULL,
        endDate DATETIME NOT NULL,
        eventId CHAR(26) NOT NULL,
        PRIMARY KEY (id),
        INDEX FK_24150cc10b6ec1f56829c362b46 (eventId ASC),
        INDEX IDX_5fc73a87edfad0d82850464611 (startDate ASC, endDate ASC),
        CONSTRAINT FK_24150cc10b6ec1f56829c362b46
          FOREIGN KEY (eventId)
          REFERENCES concert.event (id))
      ENGINE = InnoDB
      DEFAULT CHARACTER SET = utf8mb4
      COLLATE = utf8mb4_general_ci;`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS concert.seat (
        id CHAR(26) NOT NULL,
        number INT NOT NULL,
        status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
        scheduleId CHAR(26) NOT NULL,
        eventId CHAR(26) NOT NULL,
        price DECIMAL(10,2) NOT NULL DEFAULT '0.00',
        PRIMARY KEY (id),
        INDEX FK_7956670f0e3782428086a60fc01 (scheduleId ASC),
        CONSTRAINT FK_7956670f0e3782428086a60fc01
          FOREIGN KEY (scheduleId)
          REFERENCES concert.schedule (id))
      ENGINE = InnoDB
      DEFAULT CHARACTER SET = utf8mb4
      COLLATE = utf8mb4_general_ci;`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS concert.reservationDetail (
        id CHAR(26) NOT NULL,
        eventTitle VARCHAR(255) NOT NULL,
        eventAddress TEXT NOT NULL,
        eventStartDate DATETIME NOT NULL,
        eventEndDate DATETIME NOT NULL,
        PRIMARY KEY (id))
      ENGINE = InnoDB
      DEFAULT CHARACTER SET = utf8mb4
      COLLATE = utf8mb4_general_ci;`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS concert.reservation (
        id CHAR(26) NOT NULL,
        userId CHAR(26) NOT NULL,
        seatNumber INT NOT NULL,
        status ENUM('TEMP_ASSIGNED', 'PAID') NOT NULL,
        scheduleStartDate DATETIME NOT NULL,
        scheduleEndDate DATETIME NOT NULL,
        createdDate DATETIME NOT NULL,
        expiresDate DATETIME NULL DEFAULT NULL,
        seatId CHAR(26) NOT NULL,
        reservationDetailId CHAR(26) NOT NULL,
        eventId CHAR(26) NOT NULL,
        price DECIMAL(10,2) NOT NULL DEFAULT '0.00',
        PRIMARY KEY (id),
        UNIQUE INDEX REL_70ef2f828ce6c1caa4646cf480 (seatId ASC),
        UNIQUE INDEX REL_e273fb848b2d590bdd2b30c99c (reservationDetailId ASC),
        CONSTRAINT FK_70ef2f828ce6c1caa4646cf4801
          FOREIGN KEY (seatId)
          REFERENCES concert.seat (id),
        CONSTRAINT FK_e273fb848b2d590bdd2b30c99c1
          FOREIGN KEY (reservationDetailId)
          REFERENCES concert.reservationDetail (id))
      ENGINE = InnoDB
      DEFAULT CHARACTER SET = utf8mb4
      COLLATE = utf8mb4_general_ci;`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS concert.payment (
        reservationId CHAR(26) NOT NULL,
        amount DECIMAL(10,2) NOT NULL DEFAULT '0.00',
        createdDate DATETIME NOT NULL,
        PRIMARY KEY (reservationId),
        CONSTRAINT FK_6bb61cbede7c869adde5587f345
          FOREIGN KEY (reservationId)
          REFERENCES concert.reservation (id))
      ENGINE = InnoDB
      DEFAULT CHARACTER SET = utf8mb4
      COLLATE = utf8mb4_general_ci;`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS concert.point (
        userId CHAR(26) NOT NULL,
        balance DECIMAL(10,2) NOT NULL DEFAULT '0.00',
        updatedDate DATETIME NOT NULL,
        PRIMARY KEY (userId))
      ENGINE = InnoDB
      DEFAULT CHARACTER SET = utf8mb4
      COLLATE = utf8mb4_general_ci;`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS concert.queue (
        sequence INT NOT NULL AUTO_INCREMENT,
        userId CHAR(26) NOT NULL,
        status ENUM('ACTIVE', 'WAITING', 'EXPIRED') NOT NULL DEFAULT 'WAITING',
        expiresDate DATETIME NOT NULL,
        PRIMARY KEY (sequence),
        INDEX IDX_7e5f7e3c1d4063b548f9673a79 (userId ASC))
      ENGINE = InnoDB
      DEFAULT CHARACTER SET = utf8mb4
      COLLATE = utf8mb4_general_ci;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropDatabase('concert');
  }
}
