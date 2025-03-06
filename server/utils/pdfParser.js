const fs = require('fs');
const pdf = require('pdf-parse');
const College = require('../models/College');

async function parsePDFData(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    
    // Parse the text content into structured data
    const lines = data.text.split('\n').filter(line => line.trim());
    const colleges = [];
    let currentCollege = null;

    for (const line of lines) {
      // Add parsing logic based on your PDF structure
      // This is a placeholder - we'll need to adjust based on actual PDF format
      if (line.includes('College Code:')) {
        if (currentCollege) {
          colleges.push(currentCollege);
        }
        currentCollege = {
          code: line.split('College Code:')[1].trim(),
          branches: []
        };
      } else if (currentCollege) {
        // Parse branch and cutoff information
        // Adjust this based on your PDF format
        const branchMatch = parseBranchLine(line);
        if (branchMatch) {
          currentCollege.branches.push(branchMatch);
        }
      }
    }

    if (currentCollege) {
      colleges.push(currentCollege);
    }

    return colleges;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw error;
  }
}

function parseBranchLine(line) {
  // Add custom parsing logic based on your PDF format
  // This is a placeholder - adjust based on actual PDF structure
  const branchPattern = /your-pattern-here/;
  const match = line.match(branchPattern);
  
  if (match) {
    return {
      branchName: match[1],
      cutoffs: {
        OPEN: parseFloat(match[2]),
        SC: parseFloat(match[3]),
        ST: parseFloat(match[4]),
        // Add other categories based on PDF
      }
    };
  }
  return null;
}

async function importColleges(pdfPath) {
  try {
    const colleges = await parsePDFData(pdfPath);
    
    // Save to MongoDB
    for (const college of colleges) {
      await College.findOneAndUpdate(
        { code: college.code },
        college,
        { upsert: true, new: true }
      );
    }
    
    return { success: true, count: colleges.length };
  } catch (error) {
    console.error('Error importing colleges:', error);
    throw error;
  }
}

module.exports = {
  parsePDFData,
  importColleges
};
