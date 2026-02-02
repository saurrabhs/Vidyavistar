// Small sample dataset used as a fallback when the backend or MongoDB is not available.
const sampleColleges = [
  {
    _id: 's1',
    name: 'Example Institute of Technology',
    location: { city: 'Pune', district: 'Pune', state: 'Maharashtra' },
    type: 'Private',
    autonomyStatus: 'Autonomous',
    accreditation: 'NAAC A',
    website: 'https://example.edu',
    branches: [
      {
        branchName: 'Computer Engineering',
        cutoffs: { OPEN: 90, SC: 70, ST: 50, VJ: 75, NT1: 70, NT2: 68, NT3: 65, OBC: 85, EWS: 80, TFWS: 60 }
      },
      {
        branchName: 'Information Technology',
        cutoffs: { OPEN: 88, SC: 68, ST: 48, VJ: 72, NT1: 67, NT2: 66, NT3: 64, OBC: 82, EWS: 78, TFWS: 58 }
      }
    ]
  },
  {
    _id: 's2',
    name: 'City Government Engineering College',
    location: { city: 'Nagpur', district: 'Nagpur', state: 'Maharashtra' },
    type: 'Government',
    autonomyStatus: 'Non-Autonomous',
    accreditation: 'NAAC B',
    branches: [
      {
        branchName: 'Civil Engineering',
        cutoffs: { OPEN: 65, SC: 45, ST: 30, VJ: 40, NT1: 42, NT2: 39, NT3: 35, OBC: 55, EWS: 50, TFWS: 40 }
      },
      {
        branchName: 'Mechanical Engineering',
        cutoffs: { OPEN: 70, SC: 50, ST: 35, VJ: 45, NT1: 48, NT2: 46, NT3: 42, OBC: 60, EWS: 55, TFWS: 45 }
      }
    ]
  },
  {
    _id: 's3',
    name: 'Regional College of Engineering',
    location: { city: 'Aurangabad', district: 'Aurangabad', state: 'Maharashtra' },
    type: 'Aided',
    autonomyStatus: 'Autonomous',
    accreditation: 'NBA',
    branches: [
      {
        branchName: 'Electronics Engineering',
        cutoffs: { OPEN: 78, SC: 60, ST: 40, VJ: 58, NT1: 55, NT2: 53, NT3: 50, OBC: 70, EWS: 65, TFWS: 55 }
      },
      {
        branchName: 'Electrical Engineering',
        cutoffs: { OPEN: 75, SC: 58, ST: 38, VJ: 56, NT1: 54, NT2: 52, NT3: 49, OBC: 68, EWS: 63, TFWS: 52 }
      }
    ]
  },
  {
    _id: 's4',
    name: 'Neighborhood Polytechnic',
    location: { city: 'Mumbai', district: 'Mumbai', state: 'Maharashtra' },
    type: 'Private',
    autonomyStatus: 'Non-Autonomous',
    accreditation: null,
    branches: [
      {
        branchName: 'Automobile Engineering',
        cutoffs: { OPEN: 55, SC: 35, ST: 20, VJ: 30, NT1: 28, NT2: 25, NT3: 22, OBC: 45, EWS: 40, TFWS: 30 }
      }
    ]
  },
  {
    _id: 's5',
    name: 'State Institute of Technology',
    location: { city: 'Nashik', district: 'Nashik', state: 'Maharashtra' },
    type: 'Government',
    autonomyStatus: 'Autonomous',
    accreditation: 'NAAC A+',
    branches: [
      {
        branchName: 'Chemical Engineering',
        cutoffs: { OPEN: 72, SC: 55, ST: 38, VJ: 50, NT1: 48, NT2: 46, NT3: 44, OBC: 65, EWS: 60, TFWS: 50 }
      }
    ]
  }
];

export default sampleColleges;
