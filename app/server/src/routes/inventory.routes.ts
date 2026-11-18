import { Router, NextFunction } from "express";
import { prisma } from './lib/prisma';
import { validateBody } from '../middlewares/validate';
import { createInventorySchema } from '../validator/inventory.schema';

const router = Router();

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Inventory retrieved successfully",
        data: []
    });
});

router.get("/:id", (req, res) => {
    res.json({
        id: req.params.id,
        page: req.query.page
    });
});

router.post("/", validateBody(createInventorySchema), (req, res, next:NextFunction) => {
    try {
        const { name, email, password } = req.body;

        return res.status(201).json({
            success: true,
            message: "Inventory created successfully",
            data: {
                name,
                email
            }
        });

    } catch (error) {
      next(error);
    }
});

export default router;