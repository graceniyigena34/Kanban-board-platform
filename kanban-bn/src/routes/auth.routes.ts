import { Router } from "express";
import { register, login } from "../controllers/auth.controller";

const router = Router();


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Grace
 *               email:
 *                 type: string
 *                 example: grace@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post(
 "/register",
 register
);



/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 */
router.post(
 "/login",
 login
);


export default router;