const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const excelPath = path.resolve(__dirname, 'uploads', 'clgcuttoff.xlsx');
const COLLEGES_FILE = path.resolve(__dirname, 'data', 'colleges.json');

// Helper function to extract college code and name
function parseCollegeName(fullName) {
    const match = fullName.match(/^(\d+)\s*-\s*(.+)$/);
    if (match) {
        return {
            code: match[1],
            name: match[2].trim()
        };
    }
    return null;
}

// Helper function to extract branch code and name
function parseBranchName(fullName) {
    const match = fullName.match(/^(\d+)\s*-\s*(.+)$/);
    if (match) {
        return match[2].trim();
    }
    return fullName;
}

// Helper function to clean numeric values
function cleanNumericValue(value) {
    if (typeof value === 'number') return value;
    if (!value || value === -1) return 0;
    if (typeof value === 'string') {
        const cleaned = value.replace(/[^\d.]/g, '');
        return cleaned ? parseFloat(cleaned) : 0;
    }
    return 0;
}

// Helper function to convert rank to percentile
function rankToPercentile(rank) {
    if (!rank || rank === -1) return 0;
    // Assuming max rank is 150000, convert rank to percentile
    const maxRank = 150000;
    return Math.max(0, Math.min(100, ((maxRank - rank) / maxRank) * 100));
}

async function readExcel() {
    try {
        console.log('Reading Excel file:', excelPath);
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(excelPath);

        const worksheet = workbook.getWorksheet(1);
        console.log('Total rows:', worksheet.rowCount);

        const collegesMap = new Map();

        // Start from row 5 (after headers)
        for (let rowNumber = 5; rowNumber <= worksheet.rowCount; rowNumber++) {
            const row = worksheet.getRow(rowNumber);
            const values = [];
            row.eachCell((cell) => {
                values.push(cell.value);
            });

            if (values.length < 5) continue;

            const collegeInfo = parseCollegeName(values[1]);
            if (!collegeInfo) continue;

            const branchName = parseBranchName(values[2]);
            const status = values[3];

            // Get cutoffs from the row
            const cutoffs = {
                OPEN: rankToPercentile(values[5]), // GOPENS Rank
                SC: rankToPercentile(values[7]), // GSCS Rank
                ST: rankToPercentile(values[9]), // GSTS Rank
                VJ: rankToPercentile(values[11]), // GVJS Rank
                NT1: rankToPercentile(values[13]), // GNT1S Rank
                NT2: rankToPercentile(values[15]), // GNT2S Rank
                NT3: rankToPercentile(values[17]), // GNT3S Rank
                OBC: rankToPercentile(values[19]), // GOBCS Rank
                EWS: rankToPercentile(values[39]), // EWS Rank
                TFWS: rankToPercentile(values[37]) // TFWS Rank
            };

            // Create or update college
            if (!collegesMap.has(collegeInfo.code)) {
                collegesMap.set(collegeInfo.code, {
                    _id: collegeInfo.code,
                    code: collegeInfo.code,
                    name: collegeInfo.name,
                    location: {
                        city: collegeInfo.name.split(',')[1]?.trim() || '',
                        district: collegeInfo.name.split(',')[1]?.trim() || '',
                        state: 'Maharashtra'
                    },
                    type: status.includes('Government') ? 'Government' : 
                          status.includes('Aided') ? 'Government Aided' : 'Private',
                    autonomyStatus: status.includes('Autonomous') ? 'Autonomous' : 'Non-Autonomous',
                    branches: []
                });
            }

            const college = collegesMap.get(collegeInfo.code);
            
            // Add branch if not exists
            const existingBranch = college.branches.find(b => b.branchName === branchName);
            if (!existingBranch) {
                college.branches.push({
                    branchName,
                    cutoffs
                });
            }

            if (rowNumber % 100 === 0) {
                console.log(`Processed ${rowNumber} rows...`);
            }
        }

        const colleges = Array.from(collegesMap.values());
        console.log(`Processed ${colleges.length} unique colleges`);

        // Save to file
        fs.writeFileSync(COLLEGES_FILE, JSON.stringify(colleges, null, 2));
        console.log('Data saved to:', COLLEGES_FILE);

        // Print first college as sample
        if (colleges.length > 0) {
            console.log('\nSample college data:');
            console.log(JSON.stringify(colleges[0], null, 2));
        }

    } catch (error) {
        console.error('Error reading Excel:', error);
    }
}

readExcel();
