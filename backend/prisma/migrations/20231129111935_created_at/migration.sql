-- AlterTable
ALTER TABLE `animes` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `quantidade_ep` INTEGER NOT NULL;
