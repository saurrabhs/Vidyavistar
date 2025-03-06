const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Initialize colleges.json if it doesn't exist
const COLLEGES_FILE = path.join(__dirname, '..', 'data', 'colleges.json');
if (!fs.existsSync(COLLEGES_FILE)) {
  fs.writeFileSync(COLLEGES_FILE, JSON.stringify([]));
}

// Helper functions for file-based storage
const readColleges = () => {
  try {
    return JSON.parse(fs.readFileSync(COLLEGES_FILE, 'utf8'));
  } catch (error) {
    return [];
  }
};

const writeColleges = (colleges) => {
  fs.writeFileSync(COLLEGES_FILE, JSON.stringify(colleges, null, 2));
};

// Search colleges based on criteria
router.post('/search', async (req, res) => {
  try {
    const { percentile, branch, category, location, collegeType } = req.body;
    
    // Get all colleges
    let colleges = readColleges();
    
    // Filter by branch if specified
    if (branch) {
      colleges = colleges.filter(college => 
        college.branches.some(b => b.branchName.toLowerCase() === branch.toLowerCase())
      );
    }

    // Filter by college type
    if (collegeType && collegeType !== 'All') {
      colleges = colleges.filter(college => 
        college.type.toLowerCase() === collegeType.toLowerCase()
      );
    }

    // Filter by location if specified
    if (location) {
      const locationRegex = new RegExp(location, 'i');
      colleges = colleges.filter(college => 
        locationRegex.test(college.location.city) || 
        locationRegex.test(college.location.district)
      );
    }

    // Filter by percentile and category
    if (percentile) {
      colleges = colleges.filter(college => {
        return college.branches.some(branch => {
          const cutoff = branch.cutoffs[category];
          return cutoff && parseFloat(percentile) >= cutoff;
        });
      });

      // Sort colleges by cutoff (highest to lowest)
      colleges.sort((a, b) => {
        const aMaxCutoff = Math.max(...a.branches.map(branch => branch.cutoffs[category] || 0));
        const bMaxCutoff = Math.max(...b.branches.map(branch => branch.cutoffs[category] || 0));
        return bMaxCutoff - aMaxCutoff;
      });
    }

    res.json(colleges);
  } catch (error) {
    console.error('College search error:', error);
    res.status(500).json({ error: 'Failed to search colleges' });
  }
});

// Get all colleges
router.get('/', async (req, res) => {
  try {
    const colleges = readColleges();
    res.json(colleges);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ error: 'Failed to fetch colleges' });
  }
});

// Get college details by ID
router.get('/:id', async (req, res) => {
  try {
    const colleges = readColleges();
    const college = colleges.find(c => c._id === req.params.id);
    
    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }
    
    res.json(college);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch college details' });
  }
});

// Import colleges
router.post('/import', async (req, res) => {
  try {
    const { colleges } = req.body;
    if (!Array.isArray(colleges)) {
      return res.status(400).json({ error: 'Invalid college data format' });
    }

    // Add IDs to colleges if they don't have them
    const collegesWithIds = colleges.map(college => ({
      ...college,
      _id: college._id || Date.now().toString()
    }));

    writeColleges(collegesWithIds);
    res.json({ message: 'Colleges imported successfully', count: collegesWithIds.length });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: 'Failed to import college data' });
  }
});

module.exports = router;
