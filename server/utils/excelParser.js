const XLSX = require('xlsx');
const College = require('../models/College');

async function parseExcelData(filePath) {
  try {
    // Read Excel file
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    // Process and structure the data
    const collegesMap = new Map();

    data.forEach(row => {
      const collegeCode = row.CollegeCode || row['College Code'];
      const branchName = row.Branch || row['Branch Name'];
      const cutoffs = {
        OPEN: parseFloat(row.OPEN) || 0,
        SC: parseFloat(row.SC) || 0,
        ST: parseFloat(row.ST) || 0,
        VJ: parseFloat(row.VJ) || 0,
        NT1: parseFloat(row.NT1) || 0,
        NT2: parseFloat(row.NT2) || 0,
        NT3: parseFloat(row.NT3) || 0,
        OBC: parseFloat(row.OBC) || 0,
        EWS: parseFloat(row.EWS) || 0,
        TFWS: parseFloat(row.TFWS) || 0
      };

      if (!collegesMap.has(collegeCode)) {
        collegesMap.set(collegeCode, {
          code: collegeCode,
          name: row.CollegeName || row['College Name'],
          location: {
            city: row.City || row.Location || '',
            district: row.District || '',
            state: 'Maharashtra'
          },
          type: row.Type || 'Private',
          autonomyStatus: row.AutonomyStatus || 'Non-Autonomous',
          branches: []
        });
      }

      const college = collegesMap.get(collegeCode);
      college.branches.push({
        branchName,
        cutoffs
      });
    });

    return Array.from(collegesMap.values());
  } catch (error) {
    console.error('Error parsing Excel:', error);
    throw error;
  }
}

async function importColleges(filePath) {
  try {
    const colleges = await parseExcelData(filePath);
    console.log(`Parsed ${colleges.length} colleges`);

    // Clear existing data
    await College.deleteMany({});

    // Insert new data
    const result = await College.insertMany(colleges);
    console.log(`Imported ${result.length} colleges successfully`);

    return { success: true, count: result.length };
  } catch (error) {
    console.error('Error importing colleges:', error);
    throw error;
  }
}

module.exports = {
  parseExcelData,
  importColleges
};
