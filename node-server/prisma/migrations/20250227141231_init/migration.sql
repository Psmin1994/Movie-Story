/*
  Warnings:

  - Made the column `nickname` on table `oauth_user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `oauth_user` MODIFY `nickname` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `password` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `user_info` MODIFY `nickname` VARCHAR(255) NOT NULL;
