// src/docs/openapi.ts
import { z } from 'zod';
import { createDocument } from 'zod-openapi';
import {
  createSupplierSchema,
  updateSupplierSchema,
  supplierResponseSchema,
  createProductSchema,
  updateProductSchema,
  productResponseSchema,
  createInventorySchema,
  updateInventorySchema,
  inventoryResponseSchema,
} from '../validator/inventory.schema';

const idParam = z.object({
  id: z.string().meta({ description: 'Record ID', example: '1' }),
});

export const openApiDocument = createDocument({
  openapi: '3.1.0',
  info: {
    title: 'Distribution Inventory API',
    version: '1.0.0',
    description: 'API for managing suppliers, products, and stock levels',
  },
  paths: {
    // --- SUPPLIERS ---
    '/api/suppliers': {
      get: {
        summary: 'List all suppliers',
        tags: ['Suppliers'],
        responses: {
          '200': {
            description: 'Suppliers retrieved',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  message: z.string(),
                  data: z.array(supplierResponseSchema),
                }),
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new supplier',
        tags: ['Suppliers'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: createSupplierSchema } },
        },
        responses: {
          '201': { description: 'Supplier created' },
          '409': { description: 'Duplicate supplier name' },
        },
      },
    },
    '/api/suppliers/{id}': {
      patch: {
        summary: 'Update a supplier',
        tags: ['Suppliers'],
        requestParams: { path: idParam },
        requestBody: {
          required: true,
          content: { 'application/json': { schema: updateSupplierSchema } },
        },
        responses: {
          '200': { description: 'Supplier updated' },
          '404': { description: 'Supplier not found' },
        },
      },
      delete: {
        summary: 'Delete a supplier (blocked if referenced by inventory)',
        tags: ['Suppliers'],
        requestParams: { path: idParam },
        responses: {
          '200': { description: 'Supplier deleted' },
          '409': { description: 'Supplier is referenced by inventory records' },
        },
      },
    },

    // --- PRODUCTS ---
    '/api/products': {
      get: {
        summary: 'List all products',
        tags: ['Products'],
        requestParams: {
          query: z.object({
            category: z.string().optional().meta({ example: 'Electronics' }),
          }),
        },
        responses: {
          '200': {
            description: 'Products retrieved',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  message: z.string(),
                  data: z.array(productResponseSchema),
                }),
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new product',
        tags: ['Products'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: createProductSchema } },
        },
        responses: {
          '201': { description: 'Product created' },
          '409': { description: 'Duplicate SKU' },
        },
      },
    },
    '/api/products/{id}': {
      patch: {
        summary: 'Update a product',
        tags: ['Products'],
        requestParams: { path: idParam },
        requestBody: {
          required: true,
          content: { 'application/json': { schema: updateProductSchema } },
        },
        responses: {
          '200': { description: 'Product updated' },
          '404': { description: 'Product not found' },
        },
      },
      delete: {
        summary: 'Delete a product (blocked if referenced by inventory)',
        tags: ['Products'],
        requestParams: { path: idParam },
        responses: {
          '200': { description: 'Product deleted' },
          '409': { description: 'Product is referenced by inventory records' },
        },
      },
    },

    // --- INVENTORY ---
    '/api/inventory': {
      get: {
        summary: 'Filter and view inventory records',
        tags: ['Inventory'],
        requestParams: {
          query: z.object({
            supplierId: z.string().optional().meta({ example: '1' }),
            category: z.string().optional().meta({ example: 'Electronics' }),
            lowStock: z.enum(['true', 'false']).optional(),
          }),
        },
        responses: {
          '200': {
            description: 'Inventory retrieved',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  message: z.string(),
                  data: z.array(inventoryResponseSchema),
                }),
              },
            },
          },
        },
      },
      post: {
        summary: 'Create or update stock for a supplier and product pair',
        tags: ['Inventory'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: createInventorySchema } },
        },
        responses: {
          '201': { description: 'Inventory saved' },
          '400': { description: 'Validation failed or invalid supplier/product ID' },
        },
      },
    },
    '/api/inventory/{id}': {
      get: {
        summary: 'Get a single inventory record',
        tags: ['Inventory'],
        requestParams: { path: idParam },
        responses: {
          '200': { description: 'Inventory record found' },
          '404': { description: 'Inventory record not found' },
        },
      },
      patch: {
        summary: 'Update stock quantity or reorder level',
        tags: ['Inventory'],
        requestParams: { path: idParam },
        requestBody: {
          required: true,
          content: { 'application/json': { schema: updateInventorySchema } },
        },
        responses: {
          '200': { description: 'Inventory updated' },
          '404': { description: 'Inventory record not found' },
        },
      },
    },
  },
});
