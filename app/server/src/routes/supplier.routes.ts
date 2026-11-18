// src/routes/supplier.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { validateBody } from '../middlewares/validate';
import {
  createSupplierSchema,
  updateSupplierSchema,
} from '../validator/supplier.schema';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: 'asc' },
    });
    return res.status(200).json({
      success: true,
      message: 'Suppliers retrieved successfully',
      data: suppliers,
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  validateBody(createSupplierSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const supplier = await prisma.supplier.create({
        data: req.body,
      });
      return res.status(201).json({
        success: true,
        message: 'Supplier created successfully',
        data: supplier,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          message: 'A supplier with this name already exists',
        });
      }
      next(error);
    }
  }
);

router.patch(
  '/:id',
  validateBody(updateSupplierSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid supplier ID' });
      }

      const supplier = await prisma.supplier.update({
        where: { id },
        data: req.body,
      });
      return res.status(200).json({
        success: true,
        message: 'Supplier updated successfully',
        data: supplier,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ success: false, message: 'Supplier not found' });
      }
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          message: 'A supplier with this name already exists',
        });
      }
      next(error);
    }
  }
);

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid supplier ID' });
    }

    await prisma.supplier.delete({ where: { id } });
    return res.status(200).json({
      success: true,
      message: 'Supplier deleted successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }
    // Enforces business rule: supplier cannot be deleted while inventory references it
    if (error.code === 'P2003') {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete supplier because inventory records still reference it',
      });
    }
    next(error);
  }
});

export default router;
