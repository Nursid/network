const express = require('express');
const router = express.Router();
const {
    createSalary,
    getAllSalaries,
    getSalaryById,
    updateSalary,
    approveSalary,
    downloadSalarySlip,
    deleteSalary,
    getSalaryStatistics
} = require('../../Controllers/SalaryControllers/SalaryController');


router.post('/create', createSalary);

router.get('/all', getAllSalaries);

router.get('/statistics', getSalaryStatistics);

router.get('/:id', getSalaryById);

router.put('/:id', updateSalary);

router.put('/:id/approve', approveSalary);

router.get('/:id/download', downloadSalarySlip);

router.delete('/:id', deleteSalary);

module.exports = router; 