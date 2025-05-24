CREATE DATABASE fitlog_app;
USE fitlog_app;

CREATE TABLE users (
    `id` INT(11) AUTO_INCREMENT NOT NULL,
    `username` VARCHAR(20) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `psw` VARCHAR(255) NOT NULL,
    `refreshToken` VARCHAR(255),
    `verified` BOOLEAN NOT NULL DEFAULT FALSE,
    `config` INT(11) NOT NULL DEFAULT 1,
    `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

CREATE TABLE verifications (
    `id` INT(11) AUTO_INCREMENT NOT NULL,
    `userId` INT(11) NOT NULL,
    `code` VARCHAR(255) NOT NULL,
    `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`) REFERENCES users (`id`) ON DELETE CASCADE
);

CREATE TABLE exercises (
    `id` INT(11) AUTO_INCREMENT NOT NULL,
    `userId` INT(11) NOT NULL DEFAULT 0,
    `name` VARCHAR(255) NOT NULL,
    `type` ENUM("cardio", "pausa", "stretching", "corpo libero", "resistenza", "riscaldamento/defaticamento") NOT NULL,
    `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`) REFERENCES users (`id`) ON DELETE CASCADE
);

CREATE TABLE workoutPresets (
    `id` INT(11) AUTO_INCREMENT NOT NULL,
    `userId` INT(11) NOT NULL,
    `name` VARCHAR(255) NOT NULL DEFAULT 'MyWorkout',
    `description` TEXT NOT NULL,
    `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`) REFERENCES users (`id`) ON DELETE CASCADE
);

CREATE TABLE weights (
    `id` INT(11) AUTO_INCREMENT NOT NULL,
    `userId` INT(11) NOT NULL,
    `weight` FLOAT NOT NULL,
    `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`) REFERENCES users (`id`) ON DELETE CASCADE
);

CREATE TABLE workoutSessions (
    `id` INT(11) AUTO_INCREMENT NOT NULL,
    `userId` INT(11) NOT NULL,
    `presetId` INT(11) NOT NULL,
    `duration` FLOAT NOT NULL,
    `notes` TEXT NOT NULL,
    `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`) REFERENCES users (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`presetId`) REFERENCES workoutPresets (`id`) ON DELETE CASCADE
);

CREATE TABLE workoutComponents (
    `id` INT(11) AUTO_INCREMENT NOT NULL,
    `presetId` INT(11) NOT NULL,
    `exerciseId` INT(11) NOT NULL,
    `userId` INT(11) NOT NULL,
    `order` INT(11) NOT NULL,
    `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`presetId`) REFERENCES workoutPresets (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`exerciseId`) REFERENCES exercises (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`userId`) REFERENCES users (`id`) ON DELETE CASCADE
);

CREATE TABLE exerciseWeights (
    `id` INT(11) AUTO_INCREMENT NOT NULL,
    `exerciseId` INT(11) NOT NULL,
    `userId` INT(11) NOT NULL,
    `sessionId` INT(11) NOT NULL,
    `weight` FLOAT NOT NULL,
    `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`exerciseId`) REFERENCES exerciseWeights (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`sessionId`) REFERENCES workoutSessions (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`userId`) REFERENCES users (`id`) ON DELETE CASCADE
);

CREATE TABLE days (
    `id` INT(11) AUTO_INCREMENT NOT NULL,
    `userId` INT(11) NOT NULL,
    `notes` TEXT NOT NULL,
    `date` DATE NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`) REFERENCES users (`id`) ON DELETE CASCADE
);