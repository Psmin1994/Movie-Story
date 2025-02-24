/*
  Warnings:

  - You are about to drop the column `showtime` on the `movie` table. All the data in the column will be lost.
  - Added the required column `showtime` to the `movie_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `movie` DROP COLUMN `showtime`;

-- AlterTable
ALTER TABLE `movie_info` ADD COLUMN `showtime` SMALLINT NOT NULL;
