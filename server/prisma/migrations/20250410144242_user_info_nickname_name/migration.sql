/*
  Warnings:

  - You are about to drop the column `nickname` on the `user_info` table. All the data in the column will be lost.
  - Added the required column `name` to the `user_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_info` DROP COLUMN `nickname`,
    ADD COLUMN `name` VARCHAR(255) NOT NULL;
