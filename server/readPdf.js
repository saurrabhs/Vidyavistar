const fs = require('fs');
const pdf = require('pdf-parse');

const pdfPath = './uploads/mhtcet_colleges.pdf';

async function readPDF() {
    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = await pdf(dataBuffer);
        console.log('PDF Content:', data.text);
    } catch (error) {
        console.error('Error reading PDF:', error);
    }
}

readPDF();
