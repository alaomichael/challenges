
import { Request, Response, NextFunction } from "express";

export default function authenticate(req: Request, res: Response, next: NextFunction) {
    const authenticated = false;

    if (!authenticated) {
        return next(new Error("Unauthorised access"));
    }

    next();
}