const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();




const saucesCtrl = require('../controllers/sauces');


router.post('/', auth, saucesCtrl.createSauce);
router.put('/:id',auth, saucesCtrl.modifySauce);
router.delete('/:id',auth, saucesCtrl.deleteSauce);
router.get('/:id', auth,saucesCtrl.getOneSauce);
router.get('/',auth, saucesCtrl.getAllSauces);
 

module.exports = router;