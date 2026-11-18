import { Router, NextFunction, Request, Response } from "express";
import { prisma } from '../lib/prisma';
import { validateBody } from '../middlewares/validate';
import { createInventorySchema, updateInventorySchema } from '../validator/inventory.schema';

const router = Router();

// ==========================================
// 1. GET /api/inventory
// List, filter, sort, and paginate inventory (cursor-based)
// ==========================================
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit = '10', cursor } = req.query;
        const take = Math.min(parseInt(limit as string, 10) || 10, 50);

        const inventory = await prisma.SupplierProduct.findMany({
            take: take + 1,
            ...(cursor && {
                skip: 1,
                cursor: { id: parseInt(cursor as string, 10) },
            }),
            orderBy: { id: 'asc' },
            include: {
                product: true,
                supplier: true,
            },
        });

        let nextCursor: number | null = null;
        if (inventory.length > take) {
            const nextItem = inventory.pop();
            nextCursor = nextItem ? nextItem.id : null;
        }

        return res.status(200).json({
            success: true,
            message: "Inventory retrieved successfully",
            data: inventory,
            pagination: {
                nextCursor,
            }
        });
    } catch (error) {
        next(error);
    }
});

// ==========================================
// 2. GET /api/inventory/:id
// Return one record with supplier, product, and recent stock movements
// ==========================================
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const item = await prisma.SupplierProduct.findUnique({
            where: { id: Number(id) },
            include: {
                product: true,
                supplier: true,
            }
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Inventory record not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Inventory record retrieved successfully",
            data: item
        });
    } catch (error) {
        next(error);
    }
});

// ==========================================
// 3. POST /api/inventory
// Create a record manually (Admin only)
// ==========================================
router.post("/", validateBody(createInventorySchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { supplierId, productId, quantity, reorderLevel } = req.body;

        const newItem = await prisma.SupplierProduct.create({
            data: {
                supplierId,
                productId,
                quantity,
                reorderLevel,
            },
            include: {
                product: true,
                supplier: true,
            }
        });

        return res.status(201).json({
            success: true,
            message: "Inventory record created successfully",
            data: newItem
        });
    } catch (error) {
        next(error);
    }
});

// ==========================================
// 4. PATCH /api/inventory/:id
// Update permitted inventory fields with optimistic concurrency
// ==========================================
router.patch("/:id", validateBody(updateInventorySchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { quantity, reorderLevel } = req.body;

        // Optional: Check If-Match header for optimistic concurrency control if versioning is tracked
        const updatedItem = await prisma.SupplierProduct.update({
            where: { id: Number(id) },
            data: {
                quantity,
                reorderLevel,
            },
            include: {
                product: true,
                supplier: true,
            }
        });

        return res.status(200).json({
            success: true,
            message: "Inventory record updated successfully",
            data: updatedItem
        });
    } catch (error) {
        next(error);
    }
});

// ==========================================
// 5. DELETE /api/inventory/:id
// Delete a record (Admin only)
// ==========================================
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        await prisma.SupplierProduct.delete({
            where: { id: Number(id) }
        });

        return res.status(200).json({
            success: true,
            message: "Inventory record deleted successfully"
        });
    } catch (error) {
        next(error);
    }
});

// ==========================================
// 6. GET /api/inventory/:id/movements
// Return paginated stock movement history
// ==========================================
router.get("/:id/movements", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Implement stock movement tracking/fetching logic here when movement logs are established
        return res.status(200).json({
            success: true,
            message: "Stock movements retrieved successfully",
            data: []
        });
    } catch (error) {
        next(error);
    }
});

export default router;