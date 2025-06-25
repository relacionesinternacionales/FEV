-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema dbfev
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema dbfev
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `dbfev` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `dbfev` ;

-- -----------------------------------------------------
-- Table `dbfev`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbfev`.`users` (
  `enable` BIT(1) NULL DEFAULT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `password` VARCHAR(255) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `UKr43af9ap4edm43mmtq01oddj6` (`username` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 10
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `dbfev`.`empresa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbfev`.`empresa` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `codigo_pais1` VARCHAR(5) NOT NULL,
  `codigo_pais2` VARCHAR(5) NOT NULL,
  `telefono1` VARCHAR(15) NOT NULL,
  `telefono2` VARCHAR(15) NULL DEFAULT NULL,
  `cedula` VARCHAR(50) NOT NULL,
  `correo` VARCHAR(255) NOT NULL,
  `imagen_tipo` VARCHAR(255) NULL DEFAULT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `web` VARCHAR(255) NOT NULL,
  `descripcion` LONGTEXT NULL DEFAULT NULL,
  `imagen` LONGBLOB NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `UKm56nh8chy2qftx7r5iomoeqwt` (`user_id` ASC) VISIBLE,
  UNIQUE INDEX `UK8tlodlqqwl39tj72dig12r10h` (`cedula` ASC) VISIBLE,
  UNIQUE INDEX `UK4f2t9lu83jswq6rh8l1ljv8ry` (`correo` ASC) VISIBLE,
  CONSTRAINT `FKsyoafeocyo4qv58nj08p0tcy5`
    FOREIGN KEY (`user_id`)
    REFERENCES `dbfev`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `dbfev`.`feria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbfev`.`feria` (
  `fin` DATE NOT NULL,
  `id` INT NOT NULL,
  `inicio` DATE NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `estado` TINYTEXT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `dbfev`.`feria_empresa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbfev`.`feria_empresa` (
  `empresa_id` INT NULL DEFAULT NULL,
  `feria_id` INT NULL DEFAULT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  INDEX `FK7bosomxffv972cxxb2i6opmjk` (`empresa_id` ASC) VISIBLE,
  INDEX `FKftrr246w8ydk6gmqngrsosarj` (`feria_id` ASC) VISIBLE,
  CONSTRAINT `FK7bosomxffv972cxxb2i6opmjk`
    FOREIGN KEY (`empresa_id`)
    REFERENCES `dbfev`.`empresa` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `FKftrr246w8ydk6gmqngrsosarj`
    FOREIGN KEY (`feria_id`)
    REFERENCES `dbfev`.`feria` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `dbfev`.`puesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbfev`.`puesto` (
  `empresa_id` INT NOT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `estado` VARCHAR(255) NOT NULL,
  `imagen_tipo` VARCHAR(255) NULL DEFAULT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NULL DEFAULT NULL,
  `descripcion` LONGTEXT NULL DEFAULT NULL,
  `imagen` LONGBLOB NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKn5jgwg4anw6yj1lrv2ii7es0a` (`empresa_id` ASC) VISIBLE,
  CONSTRAINT `FKn5jgwg4anw6yj1lrv2ii7es0a`
    FOREIGN KEY (`empresa_id`)
    REFERENCES `dbfev`.`empresa` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `dbfev`.`roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbfev`.`roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `UKofx66keruapi6vyqpv6f2or37` (`name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `dbfev`.`users_roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbfev`.`users_roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `roles_id` INT NULL DEFAULT NULL,
  `users_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `UKt9fte92iw5ng1h59algoqdmh2` (`users_id` ASC, `roles_id` ASC) VISIBLE,
  INDEX `FKa62j07k5mhgifpp955h37ponj` (`roles_id` ASC) VISIBLE,
  CONSTRAINT `FKa62j07k5mhgifpp955h37ponj`
    FOREIGN KEY (`roles_id`)
    REFERENCES `dbfev`.`roles` (`id`),
  CONSTRAINT `FKml90kef4w2jy7oxyqv742tsfc`
    FOREIGN KEY (`users_id`)
    REFERENCES `dbfev`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
