const Router = require("express");
const router = new Router();
const controller = require("../controller/authController.js");
const { check } = require("express-validator");
const roleMiddleware = require('../middleware/roleMiddleware.js')

router.post(
    "/register",
    [
        check("username", "Имя пользователя не должно быть пустым").notEmpty(),
        check("password", "Пароль должен быть длиной от 4 до 12 символов")
            .isLength({ min: 4, max: 12 })
            .notEmpty(),
    ],
    controller.registration
);
router.post("/auth", controller.login);
router.get("/users", roleMiddleware(['ADMIN', 'USER']), controller.getUsers);
router.get("/user", roleMiddleware(['ADMIN', 'USER']), controller.getUserById);

module.exports = router;



