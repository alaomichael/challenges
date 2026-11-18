// use prisma-8

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Supplier {
  id           Int               @id @default(autoincrement())
  name         String            @unique
  contactEmail String?
  createdAt    DateTime          @default(now())
  products     SupplierProduct[]
}

model Product {
  id        Int               @id @default(autoincrement())
  sku       String            @unique
  name      String            
  category  String            
  unitPrice Int               @default(0)
  createdAt DateTime          @default(now())
  suppliers SupplierProduct[]
}

model SupplierProduct {
  id           Int      @id @default(autoincrement())
  supplierId   Int
  productId    Int
  quantity     Int      @default(0)
  reorderLevel Int      @default(10)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  supplier Supplier @relation(fields: [supplierId], references: [id], onDelete: Restrict)
  product  Product  @relation(fields: [productId], references: [id], onDelete: Restrict)

  @@unique([supplierId, productId])
}
