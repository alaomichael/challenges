#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/ab482cbce0866a9f1cd2e08d9def43b641639eb02b7ac99792cdb58add776db3/contract';
import endContract from '../../snapshots/ab482cbce0866a9f1cd2e08d9def43b641639eb02b7ac99792cdb58add776db3/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Product',
        columns: [
          col('category', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sku', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('unitPrice', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Supplier',
        columns: [
          col('contactEmail', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'SupplierProduct',
        columns: [
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('productId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('quantity', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('reorderLevel', 'int4', {
            notNull: true,
            default: lit(10),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('supplierId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Product',
        constraint: 'Product_sku_key',
        columns: ['sku'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Supplier',
        constraint: 'Supplier_name_key',
        columns: ['name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'SupplierProduct',
        constraint: 'SupplierProduct_supplierId_productId_key',
        columns: ['supplierId', 'productId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SupplierProduct',
        index: 'SupplierProduct_productId_idx_5858600a',
        columns: ['productId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SupplierProduct',
        index: 'SupplierProduct_supplierId_idx_c4d9a8b9',
        columns: ['supplierId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'SupplierProduct',
        foreignKey: {
          name: 'SupplierProduct_supplierId_fkey',
          columns: ['supplierId'],
          references: { schema: 'public', table: 'Supplier', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'SupplierProduct',
        foreignKey: {
          name: 'SupplierProduct_productId_fkey',
          columns: ['productId'],
          references: { schema: 'public', table: 'Product', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
