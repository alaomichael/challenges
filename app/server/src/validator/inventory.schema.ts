// src/validators/inventory.schema.ts
import { z } from 'zod';
import 'zod-openapi';

export const createInventorySchema = z
  .object({
    supplierId: z
      .number({ error: 'Supplier ID must be a number' })
      .int('Supplier ID must be a whole number')
      .positive('Supplier ID must be greater than 0')
      .meta({ description: 'ID of the supplier', example: 1 }),
    productId: z
      .number({ error: 'Product ID must be a number' })
      .int('Product ID must be a whole number')
      .positive('Product ID must be greater than 0')
      .meta({ description: 'ID of the product', example: 1 }),
    quantity: z
      .number({ error: 'Quantity must be a number' })
      .int('Quantity must be a whole number')
      .min(0, 'Quantity must be 0 or greater')
      .default(0)
      .meta({ description: 'Current stock quantity', example: 25 }),
    reorderLevel: z
      .number({ error: 'Reorder level must be a number' })
      .int('Reorder level must be a whole number')
      .min(0, 'Reorder level must be 0 or greater')
      .default(10)
      .meta({ description: 'Low-stock threshold', example: 10 }),
  })
  .meta({ id: 'CreateInventoryInput' });

export const updateInventorySchema = z
  .object({
    quantity: z
      .number({ error: 'Quantity must be a number' })
      .int('Quantity must be a whole number')
      .min(0, 'Quantity must be 0 or greater')
      .optional()
      .meta({ description: 'Updated stock quantity', example: 50 }),
    reorderLevel: z
      .number({ error: 'Reorder level must be a number' })
      .int('Reorder level must be a whole number')
      .min(0, 'Reorder level must be 0 or greater')
      .optional()
      .meta({ description: 'Updated low-stock threshold', example: 15 }),
  })
  .meta({ id: 'UpdateInventoryInput' });

export const inventoryResponseSchema = z
  .object({
    id: z.number().int().meta({ example: 1 }),
    supplierId: z.number().int().meta({ example: 1 }),
    productId: z.number().int().meta({ example: 1 }),
    quantity: z.number().int().meta({ example: 25 }),
    reorderLevel: z.number().int().meta({ example: 10 }),
    isLowStock: z.boolean().meta({ example: false }),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .meta({ id: 'InventoryRecord' });

export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;

