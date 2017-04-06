-- MySQL Script generated by MySQL Workbench
-- Tue Feb 28 17:19:21 2017
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema matcha
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema matcha
-- -----------------------------------------------------

CREATE SCHEMA IF NOT EXISTS `matcha` DEFAULT CHARACTER SET utf8 ;
USE `matcha` ;

-- -----------------------------------------------------
-- Table `matcha`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `matcha`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NULL,
  `user_name` VARCHAR(255) NULL,
  `last_name` VARCHAR(255) NULL,
  `first_name` VARCHAR(255) NULL,
  `password` VARCHAR(255) NULL,
  `salt` VARCHAR(255) NULL,
  `score` INT NULL,
  `date_of_birth` DATETIME NULL,
  `gender` enum('man','woman') DEFAULT NULL,
  `date_creation` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `date_connexion` DATETIME NULL,
  `activated` TINYINT(1) NULL DEFAULT 0,
  `token` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `matcha`.`interets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `matcha`.`interets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tag` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `matcha`.`images`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `matcha`.`images` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `img` VARCHAR(45) NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_images_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_images_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `matcha`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `matcha`.`profil`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `matcha`.`profil` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sex_orientation` enum('bisexual','heterosexual','homosexual') DEFAULT NULL,
  `bio` MEDIUMTEXT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_profil_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_profil_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `matcha`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `matcha`.`user_interet`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `matcha`.`user_interet` (
  `interets_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`interets_id`, `user_id`),
  INDEX `fk_interets_has_user_user1_idx` (`user_id` ASC),
  INDEX `fk_interets_has_user_interets1_idx` (`interets_id` ASC),
  CONSTRAINT `fk_interets_has_user_interets1`
    FOREIGN KEY (`interets_id`)
    REFERENCES `matcha`.`interets` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_interets_has_user_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `matcha`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `matcha`.`like`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `matcha`.`like` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `like` TINYINT(1) NULL,
  `like_user_id` INT NOT NULL,
  `liked_user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_like_user1_idx` (`like_user_id` ASC),
  INDEX `fk_like_user2_idx` (`liked_user_id` ASC),
  CONSTRAINT `fk_like_user1`
    FOREIGN KEY (`like_user_id`)
    REFERENCES `matcha`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_like_user2`
    FOREIGN KEY (`liked_user_id`)
    REFERENCES `matcha`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `matcha`.`consult`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `matcha`.`consult` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `consult` TINYINT(1) NULL,
  `consult_user_id` INT NOT NULL,
  `consulted_user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_consult_user1_idx` (`consult_user_id` ASC),
  INDEX `fk_consult_user2_idx` (`consulted_user_id` ASC),
  CONSTRAINT `fk_consult_user1`
    FOREIGN KEY (`consult_user_id`)
    REFERENCES `matcha`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_consult_user2`
    FOREIGN KEY (`consulted_user_id`)
    REFERENCES `matcha`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `matcha`.`block`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `matcha`.`block` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `block` TINYINT(1) NULL,
  `block_user_id` INT NOT NULL,
  `blocked_user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_bloquer_user1_idx` (`block_user_id` ASC),
  INDEX `fk_bloquer_user2_idx` (`blocked_user_id` ASC),
  CONSTRAINT `fk_bloquer_user1`
    FOREIGN KEY (`block_user_id`)
    REFERENCES `matcha`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_bloquer_user2`
    FOREIGN KEY (`blocked_user_id`)
    REFERENCES `matcha`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `matcha`.`messages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `matcha`.`messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `message` MEDIUMTEXT NULL,
  `created_at` DATETIME NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_messages_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_messages_user1`
  FOREIGN KEY (`user_id`)
  REFERENCES `matcha`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
  ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
