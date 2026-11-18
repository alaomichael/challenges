import { z } from 'zod';
import 'zod-openapi';

export const createSupplierSchema = z
  .object({
    name: z
      .string({ error: 'Supplier name must be a string' })
      .trim()
      .min(1, 'Supplier name is required')
      .meta({ description: 'Unique name of the supplier', example: 'Acme Logistics' }),
    contactEmail: z
      .email('Invalid email address format')
      .trim()
      .optional()
      .or(z.literal('').transform(() => undefined))
      .meta({ description: 'Optional supplier contact email', example: 'orders@acmelogistics.com' }),
  })
  .meta({ id: 'CreateSupplierInput' });

export const updateSupplierSchema = createSupplierSchema
  .partial()
  .meta({ id: 'UpdateSupplierInput' });

export const supplierResponseSchema = z
  .object({
    id: z.number().int().meta({ example: 1 }),
    name: z.string().meta({ example: 'Acme Logistics' }),
    contactEmail: z.string().nullable().meta({ example: 'orders@acmelogistics.com' }),
    createdAt: z.iso.datetime(),
  })
  .meta({ id: 'Supplier' });


export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;

