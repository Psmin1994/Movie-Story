-- CreateTable
CREATE TABLE `actor` (
    `actor_id` INTEGER NOT NULL AUTO_INCREMENT,
    `profile` VARCHAR(300) NOT NULL,
    `name` VARCHAR(45) NOT NULL,

    UNIQUE INDEX `actor_id_UNIQUE`(`actor_id`),
    PRIMARY KEY (`actor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `director` (
    `director_id` INTEGER NOT NULL AUTO_INCREMENT,
    `profile` VARCHAR(300) NOT NULL,
    `name` VARCHAR(45) NOT NULL,

    UNIQUE INDEX `director_id_UNIQUE`(`director_id`),
    PRIMARY KEY (`director_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `genre` (
    `genre_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `count` SMALLINT NOT NULL DEFAULT 0,

    UNIQUE INDEX `genre_id_UNIQUE`(`genre_id`),
    UNIQUE INDEX `name_UNIQUE`(`name`),
    PRIMARY KEY (`genre_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movie` (
    `movie_id` INTEGER NOT NULL AUTO_INCREMENT,
    `movie_nm` VARCHAR(45) NOT NULL,
    `open_date` DATE NOT NULL,
    `reopen_date` DATE NULL,
    `genre` VARCHAR(100) NOT NULL,
    `poster` VARCHAR(300) NOT NULL,

    UNIQUE INDEX `movie_id_UNIQUE`(`movie_id`),
    UNIQUE INDEX `movie_nm_UNIQUE`(`movie_nm`),
    PRIMARY KEY (`movie_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movie_info` (
    `movie_id` INTEGER NOT NULL,
    `movie_nm_en` VARCHAR(100) NOT NULL,
    `nation` VARCHAR(45) NOT NULL,
    `showtime` SMALLINT NOT NULL,
    `summary` TEXT NULL,
    `still_cut` TEXT NULL,

    UNIQUE INDEX `movie_id_UNIQUE`(`movie_id`),
    INDEX `fk_movie_info_movie1_idx`(`movie_id`),
    PRIMARY KEY (`movie_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movie_and_actor` (
    `movie_id` INTEGER NOT NULL,
    `actor_id` INTEGER NOT NULL,

    INDEX `fk-actor_id_idx`(`actor_id`),
    PRIMARY KEY (`movie_id`, `actor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movie_and_director` (
    `movie_id` INTEGER NOT NULL,
    `director_id` INTEGER NOT NULL,

    INDEX `fk-movie_idx`(`director_id`),
    PRIMARY KEY (`movie_id`, `director_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_user` (
    `oauth_id` INTEGER NOT NULL AUTO_INCREMENT,
    `provider` VARCHAR(45) NOT NULL,
    `provider_user_id` VARCHAR(255) NOT NULL,
    `nickname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `access_token` TEXT NULL,
    `refresh_token` TEXT NULL,

    UNIQUE INDEX `oauth_id_UNIQUE`(`oauth_id`),
    UNIQUE INDEX `provider_user_id_UNIQUE`(`provider_user_id`),
    PRIMARY KEY (`oauth_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `id` VARCHAR(45) NOT NULL,
    `password` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `user_id_UNIQUE`(`user_id`),
    UNIQUE INDEX `id_UNIQUE`(`id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_info` (
    `user_id` INTEGER NOT NULL,
    `nickname` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `user_id_UNIQUE`(`user_id`),
    INDEX `fk_user_info_user1_idx`(`user_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `movie_info` ADD CONSTRAINT `fk_movie_info_movie1` FOREIGN KEY (`movie_id`) REFERENCES `movie`(`movie_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movie_and_actor` ADD CONSTRAINT `fk-movie-actor-1` FOREIGN KEY (`movie_id`) REFERENCES `movie`(`movie_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movie_and_actor` ADD CONSTRAINT `fk-movie-actor-2` FOREIGN KEY (`actor_id`) REFERENCES `actor`(`actor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movie_and_director` ADD CONSTRAINT `fk-movie-director-1` FOREIGN KEY (`movie_id`) REFERENCES `movie`(`movie_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movie_and_director` ADD CONSTRAINT `fk-movie-director-2` FOREIGN KEY (`director_id`) REFERENCES `director`(`director_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_info` ADD CONSTRAINT `fk_user_info_user1` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
