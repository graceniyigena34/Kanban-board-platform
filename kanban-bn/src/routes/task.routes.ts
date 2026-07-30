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


router.post(
 "/",
 protect,
 create
);


router.get(
 "/column/:id",
 protect,
 getByColumn
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


router.put(
 "/:id/move",
 protect,
 move
);


router.delete(
 "/:id",
 protect,
 remove
);


export default router;