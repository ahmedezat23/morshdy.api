const express = require('express');
const { addAdmin, getAllAdmins, deleteAdmin, getStatistics, markStoreAsPaid } = require('../controllers/adminController');
const isAuth = require('../middleware/isAuth');
const router = express.Router();

router.post('/',isAuth,addAdmin)
router.get('/',isAuth,getAllAdmins)
router.delete('/:id',isAuth,deleteAdmin)
router.get('/statistics',isAuth, getStatistics);
router.put('/mark-store-paid/:orderId', isAuth, markStoreAsPaid);
module.exports = router;
