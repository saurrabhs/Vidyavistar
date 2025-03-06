const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const COLLEGES_FILE = path.join(__dirname, '../data/colleges.json');
let collegesCache = null;
let lastCacheTime = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper function to read and cache colleges data
const readColleges = async () => {
  try {
    // Return cached data if valid
    if (collegesCache && lastCacheTime && (Date.now() - lastCacheTime < CACHE_TTL)) {
      return collegesCache;
    }

    const data = await fs.readFile(COLLEGES_FILE, 'utf8');
    collegesCache = JSON.parse(data);
    lastCacheTime = Date.now();
    return collegesCache;
  } catch (error) {
    console.error('Error reading colleges:', error);
    throw new Error('Failed to read college data');
  }
};

// Get unique cities
router.get('/cities', async (req, res) => {
  try {
    const colleges = await readColleges();
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
    const colleges = await readColleges();
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

// Search colleges
router.post('/search', async (req, res) => {
  try {
    const { percentile, branch, category, location, collegeType } = req.body;
    const colleges = await readColleges();
    
    let results = colleges.filter(college => {
      // Basic validation
      if (!college || !Array.isArray(college.branches)) {
        return false;
      }

      // Filter by college type
      if (collegeType && collegeType !== 'All' && college.type !== collegeType) {
        return false;
      }

      // Filter by location
      if (location && (!college.location?.city || college.location.city !== location)) {
        return false;
      }

      // Filter by branch and cutoff
      if (branch || percentile || category) {
        return college.branches.some(b => {
          // Skip invalid branch entries
          if (!b || typeof b !== 'object') return false;

          // Branch name check
          if (branch && b.branchName !== branch) return false;

          // Cutoff check
          if (percentile && b.cutoffs?.[category]) {
            const cutoff = parseFloat(b.cutoffs[category]);
            if (isNaN(cutoff) || cutoff > parseFloat(percentile)) return false;
          }

          return true;
        });
      }

      return true;
    });

    // Sort by cutoff percentile if available
    if (percentile && category) {
      results.sort((a, b) => {
        const aMax = Math.max(...a.branches.map(b => parseFloat(b.cutoffs?.[category]) || 0));
        const bMax = Math.max(...b.branches.map(b => parseFloat(b.cutoffs?.[category]) || 0));
        return bMax - aMax;
      });
    }

    // Limit results
    results = results.slice(0, 50);

    res.json(results);
  } catch (error) {
    console.error('Error searching colleges:', error);
    res.status(500).json({ error: 'Failed to search colleges' });
  }
});

// Get all colleges
router.get('/', async (req, res) => {
  try {
    const colleges = await readColleges();
    res.json(colleges);
  } catch (error) {
    console.error('Error fetching all colleges:', error);
    res.status(500).json({ error: 'Failed to fetch colleges' });
  }
});

// Get college details by ID
router.get('/:id', async (req, res) => {
  try {
    const colleges = await readColleges();
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

    await writeColleges(collegesWithIds);
    res.json({ message: 'Colleges imported successfully', count: collegesWithIds.length });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: 'Failed to import college data' });
  }
});

const writeColleges = async (colleges) => {
  await fs.writeFile(COLLEGES_FILE, JSON.stringify(colleges, null, 2));
  collegesCache = colleges;
  lastCacheTime = Date.now();
};

module.exports = router;
