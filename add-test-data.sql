-- Add test order data for キャンプマスター user
-- First, find the user ID
-- INSERT test order and order items

-- This script adds test order data for the キャンプマスター user
-- Run this in Prisma Studio or using: npx prisma db execute --file add-test-data.sql --schema prisma/schema.prisma

-- Note: Replace 'USER_ID_HERE' with the actual user ID from the User table

INSERT INTO "Order" (id, "userId", "totalAmount", status, "createdAt", "updatedAt")
VALUES 
  ('test-order-001', (SELECT id FROM "User" WHERE email = 'camp@example.com' LIMIT 1), 5000, 'COMPLETED', NOW(), NOW()),
  ('test-order-002', (SELECT id FROM "User" WHERE email = 'camp@example.com' LIMIT 1), 3500, 'COMPLETED', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
  ('test-order-003', (SELECT id FROM "User" WHERE email = 'camp@example.com' LIMIT 1), 4200, 'COMPLETED', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days');

-- Add order items for test-order-001
INSERT INTO "OrderItem" (id, "orderId", shape, width, height, depth, diameter, quantity, price, "createdAt", "updatedAt")
VALUES
  ('test-item-001', 'test-order-001', 'SQUARE', 30, 40, NULL, NULL, 2, 2500, NOW(), NOW());

-- Add order items for test-order-002  
INSERT INTO "OrderItem" (id, "orderId", shape, width, height, depth, diameter, quantity, price, "createdAt", "updatedAt")
VALUES
  ('test-item-002', 'test-order-002', 'CYLINDER', NULL, 25, NULL, 10, 1, 3500, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');

-- Add order items for test-order-003
INSERT INTO "OrderItem" (id, "orderId", shape, width, height, depth, diameter, quantity, price, "createdAt", "updatedAt")
VALUES
  ('test-item-003', 'test-order-003', 'CUBE', 20, 20, 20, NULL, 1, 4200, NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days');
