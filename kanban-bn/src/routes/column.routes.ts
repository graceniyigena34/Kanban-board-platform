import { Router } from "express";

import {
 create,
 getAll,
 update,
 remove
} from "../controllers/column.controller";

import { protect } from "../middleware/auth.middleware";


const router = Router();


router.post(
 "/",
 protect,
 create
);


router.get(
 "/project/:projectId",
 protect,
 getAll
);


router.put(
 "/:id",
 protect,
 update
);


router.delete(
 "/:id",
 protect,
 remove
);


export default router;