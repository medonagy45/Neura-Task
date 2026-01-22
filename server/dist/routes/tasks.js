"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tasks_1 = require("../controllers/tasks");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Protect all task routes
router.use(auth_1.authenticateToken);
router.get("/", tasks_1.getTasks);
router.post("/", tasks_1.createTask);
router.put("/:id", tasks_1.updateTask);
router.delete("/:id", tasks_1.deleteTask);
exports.default = router;
