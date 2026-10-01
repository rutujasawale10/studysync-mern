const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const StudyGroup = require('../models/StudyGroup');

dotenv.config();

const sampleUsers = [
  {
    name: 'Aarav Sharma',
    email: 'aarav@college.edu',
    password: 'password123',
    department: 'Computer Science & Engineering',
    semester: '6th Semester'
  },
  {
    name: 'Priya Patel',
    email: 'priya@college.edu',
    password: 'password123',
    department: 'Information Technology',
    semester: '6th Semester'
  },
  {
    name: 'Rohan Verma',
    email: 'rohan@college.edu',
    password: 'password123',
    department: 'Artificial Intelligence & Data Science',
    semester: '4th Semester'
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya@college.edu',
    password: 'password123',
    department: 'Electronics & Communication',
    semester: '4th Semester'
  },
  {
    name: 'Dev Malhotra',
    email: 'dev@college.edu',
    password: 'password123',
    department: 'Computer Science & Engineering',
    semester: '8th Semester'
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studysync';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB database...');

    // Clear existing data
    await User.deleteMany({});
    await StudyGroup.deleteMany({});
    console.log('[Seed] Cleared existing Users and StudyGroups.');

    // Insert users (triggers pre-save password hashing)
    const createdUsers = [];
    for (const u of sampleUsers) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`[Seed] Created ${createdUsers.length} demo students.`);

    // Sample Groups
    const sampleGroups = [
      {
        groupName: 'MERN Stack & Full-Stack Mastery',
        subject: 'Web Development',
        description: 'Deep dive into React 18, Express REST APIs, MongoDB Aggregations, JWT auth, and practical lab assignments for semester finals.',
        meetingInfo: 'Mon & Thu @ 6:00 PM IST | Google Meet: meet.google.com/mern-sync',
        maxMembers: 5,
        creator: createdUsers[0]._id,
        members: [
          { user: createdUsers[0]._id, role: 'Creator', joinedAt: new Date(Date.now() - 86400000 * 4) },
          { user: createdUsers[1]._id, role: 'Member', joinedAt: new Date(Date.now() - 86400000 * 3) },
          { user: createdUsers[2]._id, role: 'Member', joinedAt: new Date(Date.now() - 86400000 * 2) }
        ],
        sharedNotes: `### Full-Stack Exam Topics & Cheatsheet:
1. **JWT Authentication**: Header.Payload.Signature; verify tokens on protected routes.
2. **MongoDB Indexing**: Compound vs Single field indexes for fast search.
3. **React Hooks**: useEffect dependency array rules and state lifting.
4. **REST Standards**: Proper use of HTTP Status Codes (200, 201, 400, 401, 403, 404, 500).`,
        status: 'Open'
      },
      {
        groupName: 'Algorithms & Dynamic Programming Sprint',
        subject: 'Data Structures & Algorithms',
        description: 'Focusing on Graph algorithms (Dijkstra, Bellman-Ford, Kruskal) and 2D DP problems for placement coding rounds and university tests.',
        meetingInfo: 'Wed & Sat @ 7:30 PM IST | Discord Room #algos-hub',
        maxMembers: 4,
        creator: createdUsers[1]._id,
        members: [
          { user: createdUsers[1]._id, role: 'Creator', joinedAt: new Date(Date.now() - 86400000 * 5) },
          { user: createdUsers[0]._id, role: 'Member', joinedAt: new Date(Date.now() - 86400000 * 3) }
        ],
        sharedNotes: `### Core Algorithms Checklist:
- **BFS / DFS**: Connected components & shortest path in unweighted graphs.
- **Topological Sorting**: Kahn's algorithm using in-degrees.
- **DP Patterns**: 0/1 Knapsack, Longest Common Subsequence, Matrix Chain Multiplication.`,
        status: 'Open'
      },
      {
        groupName: 'Deep Learning & Neural Networks Cohort',
        subject: 'Machine Learning',
        description: 'Hands-on practice with PyTorch, Convolutional Neural Networks for Computer Vision, and Transformer architectures.',
        meetingInfo: 'Sundays @ 11:00 AM IST | Zoom: zoom.us/j/dl-sync-2026',
        maxMembers: 3,
        creator: createdUsers[2]._id,
        members: [
          { user: createdUsers[2]._id, role: 'Creator', joinedAt: new Date(Date.now() - 86400000 * 6) },
          { user: createdUsers[3]._id, role: 'Member', joinedAt: new Date(Date.now() - 86400000 * 4) },
          { user: createdUsers[4]._id, role: 'Member', joinedAt: new Date(Date.now() - 86400000 * 1) }
        ],
        sharedNotes: `### Neural Networks Lab Notes:
- Activation functions: ReLU, LeakyReLU, GELU comparisons.
- Loss functions: CrossEntropyLoss with LogSoftmax stability.
- Optimizer: AdamW with weight decay 1e-2.`,
        status: 'Full' // 3/3 capacity -> Demonstrates Full status and disabled Join
      },
      {
        groupName: 'Database Systems & SQL Optimization Lab',
        subject: 'Database Management',
        description: 'Relational algebra, B+ Tree indexing, normalization up to BCNF, ACID transactions, and NoSQL comparison study.',
        meetingInfo: 'Tuesdays @ 5:00 PM IST | Library Study Room 302',
        maxMembers: 6,
        creator: createdUsers[3]._id,
        members: [
          { user: createdUsers[3]._id, role: 'Creator', joinedAt: new Date(Date.now() - 86400000 * 2) }
        ],
        sharedNotes: `### Normalization Reference:
- **1NF**: Atomic attributes.
- **2NF**: 1NF + No partial dependencies on candidate key.
- **3NF**: 2NF + No transitive dependencies.
- **BCNF**: For every functional dependency X -> Y, X must be a super key.`,
        status: 'Open'
      }
    ];

    for (const groupData of sampleGroups) {
      const group = new StudyGroup(groupData);
      await group.save();
    }

    console.log(`[Seed] Created ${sampleGroups.length} sample study groups.`);
    console.log('\n==========================================');
    console.log(' Demo Accounts Created (Password: password123):');
    sampleUsers.forEach((u) => {
      console.log(` - ${u.name} | ${u.email} | ${u.department} (${u.semester})`);
    });
    console.log('==========================================\n');

    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedDatabase();
