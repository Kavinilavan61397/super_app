const Policy = require('../models/Policy');

// Get all policies
const getAllPolicies = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    
    if (search) {
      whereClause = {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    if (status !== undefined && status !== 'all') {
      whereClause.status = status === 'true';
    }

    const policies = await Policy.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: policies.rows,
      total: policies.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(policies.count / limit)
    });
  } catch (error) {
    console.error('Error fetching policies:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get policy by ID
const getPolicyById = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await Policy.findByPk(id);
    
    if (!policy) {
      return res.status(404).json({ success: false, message: 'Policy not found' });
    }
    
    res.json({ success: true, data: policy });
  } catch (error) {
    console.error('Error fetching policy:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Create new policy
const createPolicy = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const policy = await Policy.create({
      title,
      description: description || null,
      status: true
    });

    res.status(201).json({ success: true, data: policy });
  } catch (error) {
    console.error('Error creating policy:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update policy
const updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    
    const policy = await Policy.findByPk(id);
    if (!policy) {
      return res.status(404).json({ success: false, message: 'Policy not found' });
    }

    await policy.update({
      title: title || policy.title,
      description: description !== undefined ? description : policy.description
    });

    res.json({ success: true, data: policy });
  } catch (error) {
    console.error('Error updating policy:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Toggle policy status
const togglePolicyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const policy = await Policy.findByPk(id);
    if (!policy) {
      return res.status(404).json({ success: false, message: 'Policy not found' });
    }

    await policy.update({ status: !policy.status });
    
    res.json({ success: true, data: policy });
  } catch (error) {
    console.error('Error toggling policy status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete policy
const deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    
    const policy = await Policy.findByPk(id);
    if (!policy) {
      return res.status(404).json({ success: false, message: 'Policy not found' });
    }

    await policy.destroy();
    
    res.json({ success: true, message: 'Policy deleted successfully' });
  } catch (error) {
    console.error('Error deleting policy:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getAllPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  togglePolicyStatus,
  deletePolicy
}; 