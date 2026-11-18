// src/routes/product.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { validateBody } from '../middlewares/validate';
import {
  createProductSchema,
  updateProductSchema,
} from '../validator/product.schema';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;

    const products = await prisma.product.findMany({
      where: category
        ? { category: { equals: String(category), mode: 'insensitive' } }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  validateBody(createProductSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await prisma.product.create({
        data: req.body,
      });
      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          message: 'A product with this SKU already exists',
        });
      }
      next(error);
    }
  }
);

router.patch(
  '/:id',
  validateBody(updateProductSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
      }

      const product = await prisma.product.update({
        where: { id },
        data: req.body,
      });
      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: product,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          message: 'A product with this SKU already exists',
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
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    await prisma.product.delete({ where: { id } });
    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
  
    if (error.code === 'P2003') {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete product because inventory records still reference it',
      });
    }
    next(error);
  }
});

export default router;
