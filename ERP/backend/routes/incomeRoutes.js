const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');
// POST - create
router.post('/', auth, isSchoolAdmin,  incomeController.createIncome);

// GET - all
router.get('/', auth, isSchoolAdmin,  incomeController.getAllIncomes);

// GET - by ID
router.get('/:id', auth, isSchoolAdmin,  incomeController.getIncomeById);

// PUT - update
router.put('/:id', auth, isSchoolAdmin,  incomeController.updateIncome);

// DELETE - remove
router.delete('/:id', auth, isSchoolAdmin,  incomeController.deleteIncome);

module.exports = router;
