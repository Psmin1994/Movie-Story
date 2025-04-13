/*
  Warnings:

  - You are about to drop the `movie_and_genre` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `genre` to the `movie` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `movie_and_genre` DROP FOREIGN KEY `fk-movie-genre-1`;

-- DropForeignKey
ALTER TABLE `movie_and_genre` DROP FOREIGN KEY `fk-movie-genre-2`;

-- AlterTable
ALTER TABLE `movie` ADD COLUMN `genre` VARCHAR(100) NOT NULL;

-- DropTable
DROP TABLE `movie_and_genre`;
