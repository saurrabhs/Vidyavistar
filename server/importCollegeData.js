const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

// Path to Excel file and output JSON file
const excelPath = path.resolve(__dirname, 'uploads', 'clgcuttoff.xlsx');
const COLLEGES_FILE = path.resolve(__dirname, 'data', 'colleges.json');

console.log('Excel file path:', excelPath);
console.log('Output file path:', COLLEGES_FILE);

// Create data directory if it doesn't exist
const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Helper function to clean numeric values
function cleanNumericValue(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^\d.]/g, '');
    return cleaned ? parseFloat(cleaned) : 0;
  }
  return 0;
}

// Helper function to parse Excel data
async function parseExcelData(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Excel file not found at: ${filePath}`);
    }

    console.log('Reading Excel file from:', filePath);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    const worksheet = workbook.worksheets[0];
    console.log('Sheet name:', worksheet.name);
    
    // Get headers
    const headers = {};
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      headers[colNumber] = cell.value;
    });
    console.log('Headers:', headers);

    const collegesMap = new Map();
    let rowCount = 0;

    // Process each row
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      rowCount++;

      if (rowCount % 100 === 0) {
        console.log(`Processing row ${rowCount}`);
      }

      const rowData = {};
      row.eachCell((cell, colNumber) => {
        rowData[headers[colNumber]] = cell.value;
      });

      const collegeCode = rowData['College Code'] || '';
      const branchName = rowData['Branch'] || '';
      
      if (!collegeCode || !branchName) {
        console.log('Skipping row due to missing code or branch:', rowData);
        return;
      }

      const cutoffs = {
        OPEN: cleanNumericValue(rowData['OPEN'] || 0),
        SC: cleanNumericValue(rowData['SC'] || 0),
        ST: cleanNumericValue(rowData['ST'] || 0),
        VJ: cleanNumericValue(rowData['VJ'] || 0),
        NT1: cleanNumericValue(rowData['NT1'] || 0),
        NT2: cleanNumericValue(rowData['NT2'] || 0),
        NT3: cleanNumericValue(rowData['NT3'] || 0),
        OBC: cleanNumericValue(rowData['OBC'] || 0),
        EWS: cleanNumericValue(rowData['EWS'] || 0),
        TFWS: cleanNumericValue(rowData['TFWS'] || 0)
      };

      if (!collegesMap.has(collegeCode)) {
        collegesMap.set(collegeCode, {
          _id: collegeCode,
          code: collegeCode,
          name: rowData['College Name'] || '',
          location: {
            city: rowData['City'] || '',
            district: rowData['District'] || '',
            state: 'Maharashtra'
          },
          type: rowData['Type'] || 'Private',
          autonomyStatus: rowData['Autonomy Status'] || 'Non-Autonomous',
          branches: []
        });
      }

      const college = collegesMap.get(collegeCode);
      
      // Check if branch already exists
      const existingBranch = college.branches.find(b => b.branchName === branchName);
      if (!existingBranch) {
        college.branches.push({
          branchName,
          cutoffs
        });
      }
    });

    const colleges = Array.from(collegesMap.values());
    console.log(`Processed ${colleges.length} unique colleges`);
    return colleges;
  } catch (error) {
    console.error('Error parsing Excel:', error);
    throw error;
  }
}

// Import colleges
async function importColleges() {
  try {
    console.log('Starting import from:', excelPath);
    const colleges = await parseExcelData(excelPath);
    console.log(`Parsed ${colleges.length} colleges`);

    // Save to JSON file
    fs.writeFileSync(COLLEGES_FILE, JSON.stringify(colleges, null, 2));
    console.log(`Successfully imported ${colleges.length} colleges to ${COLLEGES_FILE}`);

    // Print first college as sample
    if (colleges.length > 0) {
      console.log('\nSample college data:');
      console.log(JSON.stringify(colleges[0], null, 2));
    }
  } catch (error) {
    console.error('Error importing colleges:', error);
  }
}

// Run the import
importColleges();
