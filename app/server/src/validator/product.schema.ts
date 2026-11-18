// src/validators/inventory.schema.ts
import { z } from 'zod';
import 'zod-openapi';

export const createProductSchema = z
  .object({
    sku: z
      .string({ error: 'SKU must be a string' })
      .trim()
      .regex(
        /^[a-zA-Z0-9-]{3,20}$/,
        'SKU must be 3–20 characters containing only letters, digits, or hyphens'
      )
      .meta({ description: 'Unique SKU (3–20 alphanumeric or hyphens)', example: 'ELEC-1001' }),
    name: z
      .string({ error: 'Product name must be a string' })
      .trim()
      .min(1, 'Product name is required')
      .meta({ description: 'Name of the product', example: 'Industrial Barcode Scanner' }),
    category: z
      .string({ error: 'Category must be a string' })
      .trim()
      .min(1, 'Category is required')
      .meta({ description: 'Product category', example: 'Electronics' }),
    unitPrice: z
      .number({ error: 'Unit price must be a number' })
      .min(0, 'Unit price must be 0 or greater')
      .default(0)
      .meta({ description: 'Unit price (0 or greater)', example: 15000 }),
  })
  .meta({ id: 'CreateProductInput' });

export const updateProductSchema = createProductSchema
  .partial()
  .meta({ id: 'UpdateProductInput' });

export const productResponseSchema = z
  .object({
    id: z.number().int().meta({ example: 1 }),
    sku: z.string().meta({ example: 'ELEC-1001' }),
    name: z.string().meta({ example: 'Industrial Barcode Scanner' }),
    category: z.string().meta({ example: 'Electronics' }),
    unitPrice: z.number().meta({ example: 15000 }),
    createdAt: z.iso.datetime(),
  })
  .meta({ id: 'Product' });

export type CreateProductInput = z.infer<typeof createProductSchema>;

