import { Router } from "express";

import {
 create,
 getAll,
 getOne,
 update,
 remove
} from "../controllers/project.controller";

import { protect } from "../middleware/auth.middleware";


const router = Router();


router.post(
 "/",
 protect,
 create
);


router.get(
 "/",
 protect,
 getAll
);


router.get(
 "/:id",
 protect,
 getOne
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