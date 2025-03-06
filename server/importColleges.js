const { importColleges } = require('./utils/excelParser');
const path = require('path');

const excelPath = path.join(__dirname, 'uploads', 'clgcuttoff.xlsx');

async function runImport() {
    try {
        console.log('Starting import from:', excelPath);
        const result = await importColleges(excelPath);
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
