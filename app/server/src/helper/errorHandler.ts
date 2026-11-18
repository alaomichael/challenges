import { Request, Response, NextFunction } from "express";

export default function errorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Your implementation
     console.error("Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
}