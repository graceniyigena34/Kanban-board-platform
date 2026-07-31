import { Router } from "express";

import {
 create,
 getAll,
 update,
 remove
} from "../controllers/column.controller";

import { protect } from "../middleware/auth.middleware";


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Columns
 *   description: Kanban column management
 */

/**
 * @swagger
 * /api/columns:
 *   post:
 *     summary: Create a new column
 *     tags: [Columns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, projectId, order]
 *             properties:
 *               name:
 *                 type: string
 *                 example: To Do
 *               projectId:
 *                 type: string
 *                 example: abc123
 *               order:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Column created
 *       401:
 *         description: Unauthorized
 */
router.post(
 "/",
 protect,
 create
);

/**
 * @swagger
 * /api/columns/project/{projectId}:
 *   get:
 *     summary: Get all columns for a project
 *     tags: [Columns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         example: abc123
 *     responses:
 *       200:
 *         description: List of columns
 *       401:
 *         description: Unauthorized
 */
router.get(
 "/project/:projectId",
 protect,
 getAll
);

/**
 * @swagger
 * /api/columns/{id}:
 *   put:
 *     summary: Update a column
 *     tags: [Columns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Column updated
 */
router.put(
 "/:id",
 protect,
 update
);

/**
 * @swagger
 * /api/columns/{id}:
 *   delete:
 *     summary: Delete a column
 *     tags: [Columns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Column deleted
 */
router.delete(
 "/:id",
 protect,
 remove
);


export default router;