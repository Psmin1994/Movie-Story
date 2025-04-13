/*
  Warnings:

  - You are about to drop the column `movie_nm_en` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `nation` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `still_cut` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `movie` table. All the data in the column will be lost.
  - The primary key for the `oauth_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `oauth_user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[oauth_id]` on the table `oauth_user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `oauth_id` to the `oauth_user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `id_UNIQUE` ON `oauth_user`;

-- AlterTable
ALTER TABLE `movie` DROP COLUMN `movie_nm_en`,
    DROP COLUMN `nation`,
    DROP COLUMN `still_cut`,
    DROP COLUMN `summary`;

-- AlterTable
ALTER TABLE `oauth_user` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `oauth_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`oauth_id`);

-- AlterTable
ALTER TABLE `user_info` ADD PRIMARY KEY (`user_id`);

-- CreateTable
CREATE TABLE `movie_info` (
    `movie_id` INTEGER NOT NULL,
    `movie_nm_en` VARCHAR(100) NOT NULL,
    `nation` VARCHAR(45) NOT NULL,
    `summary` TEXT NULL,
    `still_cut` TEXT NULL,

    UNIQUE INDEX `movie_id_UNIQUE`(`movie_id`),
    INDEX `fk_movie_info_movie1_idx`(`movie_id`),
    PRIMARY KEY (`movie_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `oauth_id_UNIQUE` ON `oauth_user`(`oauth_id`);

-- AddForeignKey
ALTER TABLE `movie_info` ADD CONSTRAINT `fk_movie_info_movie1` FOREIGN KEY (`movie_id`) REFERENCES `movie`(`movie_id`) ON DELETE CASCADE ON UPDATE CASCADE;
