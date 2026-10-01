const StudyGroup = require('../models/StudyGroup');

// Helper to populate group members & creator details
const populateGroupQuery = (query) => {
  return query
    .populate('creator', 'name email department semester')
    .populate('members.user', 'name email department semester');
};

// @desc    Get all study groups with optional search and filters
// @route   GET /api/groups
// @access  Public
exports.getGroups = async (req, res, next) => {
  try {
    const { search, subject, status } = req.query;
    const filter = {};

    // Subject filtering
    if (subject && subject.trim() !== '' && subject.toLowerCase() !== 'all') {
      filter.subject = { $regex: new RegExp(`^${subject.trim()}$`, 'i') };
    }

    // Status filtering ('Open' or 'Full')
    if (status && ['Open', 'Full'].includes(status)) {
      filter.status = status;
    }

    // Search query matching groupName, subject, or description
    if (search && search.trim() !== '') {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      filter.$or = [
        { groupName: searchRegex },
        { subject: searchRegex },
        { description: searchRegex }
      ];
    }

    const groups = await populateGroupQuery(
      StudyGroup.find(filter).sort({ createdAt: -1 })
    );

    // Get unique subjects for quick filter tabs on frontend
    const subjects = await StudyGroup.distinct('subject');

    return res.status(200).json({
      success: true,
      count: groups.length,
      availableSubjects: subjects,
      groups
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single study group by ID
// @route   GET /api/groups/:id
// @access  Public
exports.getGroupById = async (req, res, next) => {
  try {
    const group = await populateGroupQuery(StudyGroup.findById(req.params.id));

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Study group not found.'
      });
    }

    return res.status(200).json({
      success: true,
      group
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new study group
// @route   POST /api/groups
// @access  Private (Authenticated students only)
exports.createGroup = async (req, res, next) => {
  try {
    const { groupName, subject, description, meetingInfo, maxMembers } = req.body;

    // Validation
    if (!groupName || !subject || !description || !meetingInfo || maxMembers === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: groupName, subject, description, meetingInfo, maxMembers.'
      });
    }

    const parsedMaxMembers = parseInt(maxMembers, 10);
    if (isNaN(parsedMaxMembers) || parsedMaxMembers < 2) {
      return res.status(400).json({
        success: false,
        message: 'Maximum members must be a valid number and at least 2.'
      });
    }

    // Create group with authenticated student as Creator and initial member
    const newGroup = new StudyGroup({
      groupName: groupName.trim(),
      subject: subject.trim(),
      description: description.trim(),
      meetingInfo: meetingInfo.trim(),
      maxMembers: parsedMaxMembers,
      creator: req.user._id,
      members: [
        {
          user: req.user._id,
          role: 'Creator',
          joinedAt: new Date()
        }
      ],
      sharedNotes: `Welcome to ${groupName.trim()}! Use this collaborative note area for key topics, lecture summaries, reference links, and assignment checklists.`,
      status: 'Open'
    });

    await newGroup.save();

    const populatedGroup = await populateGroupQuery(StudyGroup.findById(newGroup._id));

    return res.status(201).json({
      success: true,
      message: 'Study group created successfully!',
      group: populatedGroup
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join an open study group
// @route   POST /api/groups/:id/join
// @access  Private (Authenticated students only)
exports.joinGroup = async (req, res, next) => {
  try {
    const groupId = req.params.id;
    const userId = req.user._id;

    const group = await StudyGroup.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Study group not found.'
      });
    }

    // Check if student is already a member
    const isAlreadyMember = group.members.some(
      (member) => member.user.toString() === userId.toString()
    );

    if (isAlreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this group.'
      });
    }

    // Check capacity limit
    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'Group is full'
      });
    }

    // Add new member
    group.members.push({
      user: userId,
      role: 'Member',
      joinedAt: new Date()
    });

    // Update status if capacity reached
    if (group.members.length >= group.maxMembers) {
      group.status = 'Full';
    }

    await group.save();

    const updatedGroup = await populateGroupQuery(StudyGroup.findById(group._id));

    return res.status(200).json({
      success: true,
      message: `Successfully joined ${group.groupName}!`,
      group: updatedGroup
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update shared study notes
// @route   PUT /api/groups/:id/notes
// @access  Private (Group creator or members)
exports.updateNotes = async (req, res, next) => {
  try {
    const { sharedNotes } = req.body;
    const groupId = req.params.id;
    const userId = req.user._id;

    const group = await StudyGroup.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Study group not found.'
      });
    }

    // Ensure the requester is a member or creator of the group
    const isMember = group.members.some(
      (member) => member.user.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Only members of this study group can view or edit notes.'
      });
    }

    group.sharedNotes = sharedNotes !== undefined ? sharedNotes : '';
    await group.save();

    const updatedGroup = await populateGroupQuery(StudyGroup.findById(group._id));

    return res.status(200).json({
      success: true,
      message: 'Study notes updated successfully!',
      sharedNotes: updatedGroup.sharedNotes,
      group: updatedGroup
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave a study group (members only, creators must delete)
// @route   POST /api/groups/:id/leave
// @access  Private
exports.leaveGroup = async (req, res, next) => {
  try {
    const groupId = req.params.id;
    const userId = req.user._id;

    const group = await StudyGroup.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Study group not found.'
      });
    }

    // Check if user is the creator
    if (group.creator.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Group creators cannot leave the group. You can delete the group if you wish to dismantle it.'
      });
    }

    const memberIndex = group.members.findIndex(
      (member) => member.user.toString() === userId.toString()
    );

    if (memberIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not a member of this study group.'
      });
    }

    group.members.splice(memberIndex, 1);

    // Update status if space opened
    if (group.members.length < group.maxMembers) {
      group.status = 'Open';
    }

    await group.save();

    const updatedGroup = await populateGroupQuery(StudyGroup.findById(group._id));

    return res.status(200).json({
      success: true,
      message: 'You have left the study group.',
      group: updatedGroup
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a study group
// @route   DELETE /api/groups/:id
// @access  Private (Creator only)
exports.deleteGroup = async (req, res, next) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Study group not found.'
      });
    }

    if (group.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the creator of this group has permission to delete it.'
      });
    }

    await StudyGroup.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Study group deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
