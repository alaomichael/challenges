
import { Request, Response, NextFunction } from "express";

export default function validateUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { name, email, password } = req.body;

    // 1. Check that all required fields are provided
    if (
        name === undefined ||
        email === undefined ||
        password === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required: name, email and password."
        });
    }

    // 2. Validate data types
    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        return res.status(400).json({
            success: false,
            message: "Name, email and password must be strings."
        });
    }

    // 3. Remove unnecessary whitespace from name and email
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    // 4. Validate name length
    if (trimmedName.length < 2 || trimmedName.length > 50) {
        return res.status(400).json({
            success: false,
            message: "Name must be between 2 and 50 characters."
        });
    }

    // 5. Validate email length and format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        trimmedEmail.length > 254 ||
        !emailRegex.test(trimmedEmail)
    ) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address."
        });
    }

    // 6. Validate password length
    if (password.length < 8 || password.length > 64) {
        return res.status(400).json({
            success: false,
            message: "Password must be between 8 and 64 characters."
        });
    }

    // 7. Validate password strength
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);

    if (
        !hasUppercase ||
        !hasLowercase ||
        !hasNumber ||
        !hasSpecialCharacter
    ) {
        return res.status(400).json({
            success: false,
            message: "Password must contain uppercase, lowercase, number and special character."
        });
    }

    // 8. Pass validated and normalised values to the controller
    req.body.name = trimmedName;
    req.body.email = trimmedEmail.toLowerCase();

    next();
}
