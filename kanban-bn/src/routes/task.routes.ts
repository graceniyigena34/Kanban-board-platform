import {Router} from "express";

import {
 create,
 getByColumn,
 getOne,
 update,
 move,
 remove
} from "../controllers/task.controller";


import {protect} from "../middleware/auth.middleware";


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, columnId, projectId]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Fix login bug
 *               description:
 *                 type: string
 *                 example: The login button is broken
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *                 example: HIGH
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-31
 *               columnId:
 *                 type: string
 *                 example: col123
 *               projectId:
 *                 type: string
 *                 example: proj123
 *     responses:
 *       201:
 *         description: Task created
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
 * /api/tasks/column/{id}:
 *   get:
 *     summary: Get all tasks in a column
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: col123
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get(
 "/column/:id",
 protect,
 getByColumn
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a single task by ID
 *     tags: [Tasks]
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
 *         description: Task found
 *       404:
 *         description: Task not found
 */
router.get(
 "/:id",
 protect,
 getOne
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Task updated
 */
router.put(
 "/:id",
 protect,
 update
);

/**
 * @swagger
 * /api/tasks/{id}/move:
 *   put:
 *     summary: Move a task to a different column
 *     tags: [Tasks]
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
 *             required: [columnId]
 *             properties:
 *               columnId:
 *                 type: string
 *                 example: col456
 *     responses:
 *       200:
 *         description: Task moved
 */
router.put(
 "/:id/move",
 protect,
 move
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
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
 *         description: Task deleted
 */
router.delete(
 "/:id",
 protect,
 remove
);


export default router;