const Router = require('express');
const { upload, controller } = require('../controller/productController.js');
const roleMiddleware = require('../middleware/roleMiddleware.js');

const router = new Router();

router.post('/', roleMiddleware(['ADMIN']), upload.array('images'), controller.addProduct);
router.delete('/:id', roleMiddleware(['ADMIN']), controller.deleteProduct);
router.put('/:id', roleMiddleware(['ADMIN']), controller.editProduct);
router.get('/:id', controller.getProduct);
router.get('/', controller.getProducts);

module.exports = router;

