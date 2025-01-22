const Router = require('express');
const controller = require('../controller/orderController.js');
const authMiddleware = require('../middleware/authMiddleware.js')

const router = new Router();

router.post('/', authMiddleware, controller.createOrder);
router.get('/:id', authMiddleware, controller.getUserOrder);
router.get('/getone/:id', authMiddleware, controller.getOrderById);
router.post('/payment/:id', authMiddleware, controller.makePaymentById);

module.exports = router;