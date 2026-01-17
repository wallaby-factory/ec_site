-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN "depth" INTEGER;
ALTER TABLE "OrderItem" ADD COLUMN "diameter" INTEGER;

-- AlterTable
ALTER TABLE "PublicOrder" ADD COLUMN "depth" INTEGER;
ALTER TABLE "PublicOrder" ADD COLUMN "diameter" INTEGER;
