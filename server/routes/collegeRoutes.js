const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const COLLEGES_FILE = path.join(__dirname, '../data/colleges.json');

// Get all colleges (paginated)
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(COLLEGES_FILE, 'utf8');
    const colleges = JSON.parse(data);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const results = colleges.slice(startIndex, endIndex);
    const totalPages = Math.ceil(colleges.length / limit);
    
    res.json({
      results,
      totalPages,
      currentPage: page,
      totalResults: colleges.length
    });
  } catch (error) {
    console.error('Error reading colleges:', error);
    res.status(500).json({ error: 'Failed to read college data' });
  }
});

// Search colleges
router.post('/search', async (req, res) => {
  try {
    const { percentile, branch, category, location, collegeType } = req.body;
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;

    const data = await fs.readFile(COLLEGES_FILE, 'utf8');
    let colleges = JSON.parse(data);

    // Apply filters
    if (colleges && colleges.length > 0) {
      if (location && location !== '') {
        colleges = colleges.filter(college => 
          college.location && college.location.city && 
          college.location.city.toLowerCase() === location.toLowerCase()
        );
      }

      if (collegeType && collegeType !== '' && collegeType !== 'All') {
        colleges = colleges.filter(college => college.type === collegeType);
      }

      if (branch && branch !== '') {
        colleges = colleges.filter(college =>
          college.branches && college.branches.some(b => b.branchName === branch)
        );
      }

      if (percentile && category) {
        colleges = colleges.filter(college =>
          college.branches && college.branches.some(b => {
            const cutoff = parseFloat(b.cutoffs?.[category]) || 0;
            return parseFloat(percentile) >= cutoff;
          })
        );
      }
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const results = colleges.slice(startIndex, endIndex);
    const totalPages = Math.ceil(colleges.length / limit);

    res.json({
      results,
      totalPages,
      currentPage: page,
      totalResults: colleges.length
    });
  } catch (error) {
    console.error('Error searching colleges:', error);
    res.status(500).json({ error: 'Failed to search colleges' });
  }
});

// Get unique cities
router.get('/cities', async (req, res) => {
  try {
    const data = await fs.readFile(COLLEGES_FILE, 'utf8');
    const colleges = JSON.parse(data);
    const cities = new Set();
    
    colleges.forEach(college => {
      if (college.location?.city && typeof college.location.city === 'string') {
        cities.add(college.location.city.trim());
      }
    });

    const sortedCities = Array.from(cities).sort();
    res.json(sortedCities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// Get unique branches
router.get('/branches', async (req, res) => {
  try {
    const data = await fs.readFile(COLLEGES_FILE, 'utf8');
    const colleges = JSON.parse(data);
    const branches = new Set();
    
    colleges.forEach(college => {
      if (Array.isArray(college.branches)) {
        college.branches.forEach(branch => {
          if (branch?.branchName && typeof branch.branchName === 'string') {
            branches.add(branch.branchName.trim());
          }
        });
      }
    });

    const sortedBranches = Array.from(branches).sort();
    res.json(sortedBranches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

// Get college details by ID
router.get('/:id', async (req, res) => {
  try {
    const data = await fs.readFile(COLLEGES_FILE, 'utf8');
    const colleges = JSON.parse(data);
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

    await fs.writeFile(COLLEGES_FILE, JSON.stringify(collegesWithIds, null, 2));
    res.json({ message: 'Colleges imported successfully', count: collegesWithIds.length });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: 'Failed to import college data' });
  }
});

module.exports = router;
