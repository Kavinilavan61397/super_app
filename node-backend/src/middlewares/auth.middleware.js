const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Temporary demo token bypass for development
    if (token === 'demo-token') {
      req.user = {
        id: '000000000000000000000001', // Valid ObjectId for demo user
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'user'
      };
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key');

      // Get user from token
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to access this route'
        });
      }

      // Attach user to request object with role details
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        role_id: user.role_id
      }; // ✅ Plain object with role_id for permission checking
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in authentication',
      error: error.message
    });
  }
};

// Case-insensitive role check (backward compatibility)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.map(r => r.toLowerCase()).includes(req.user.role.toLowerCase())) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    next();
  };
};

// Category-specific permission check
exports.checkPermission = (resource, action, category) => {
  return async (req, res, next) => {
    try {
      // Super admin bypass
      if (req.user.role === 'admin') {
        return next();
      }

      // Check if user has role_id (new permission system)
      if (req.user.role_id) {
        const role = await Role.findById(req.user.role_id)
          .populate('permissions', 'resource action category');
        
        if (role && role.permissions) {
          const hasPermission = role.permissions.some(permission => 
            permission.resource === resource &&
            permission.action === action &&
            (permission.category === category || permission.category === 'all')
          );
          
          if (hasPermission) {
            return next();
          }
        }
      }

      // Fallback to legacy role check
      const permissionString = `${resource}:${action}:${category}`;
      const legacyPermissions = {
        'admin': ['*:*:*'],
        'ecommerce_admin': ['products:*:electronics', 'products:*:clothing', 'orders:*:electronics', 'orders:*:clothing'],
        'grocery_admin': ['products:*:groceries', 'orders:*:groceries'],
        'restaurant_admin': ['products:*:restaurants', 'orders:*:restaurants'],
        'hotel_admin': ['products:*:hotels', 'orders:*:hotels'],
        'taxi_admin': ['products:*:taxi', 'orders:*:taxi']
      };

      const userPermissions = legacyPermissions[req.user.role] || [];
      const hasLegacyPermission = userPermissions.some(perm => {
        if (perm === '*:*:*') return true;
        const [permResource, permAction, permCategory] = perm.split(':');
        return (permResource === '*' || permResource === resource) &&
               (permAction === '*' || permAction === action) &&
               (permCategory === '*' || permCategory === category);
      });

      if (hasLegacyPermission) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: `Access denied. Required permission: ${permissionString}`
      });
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking permissions'
      });
    }
  };
};

// Check if user has any permission for a resource
exports.hasResourcePermission = (resource) => {
  return async (req, res, next) => {
    try {
      if (req.user.role === 'admin') {
        return next();
      }

      if (req.user.role_id) {
        const role = await Role.findById(req.user.role_id)
          .populate('permissions', 'resource');
        
        if (role && role.permissions) {
          const hasPermission = role.permissions.some(permission => 
            permission.resource === resource
          );
          
          if (hasPermission) {
            return next();
          }
        }
      }

      // Legacy role check
      const resourceRoles = {
        'products': ['admin', 'ecommerce_admin', 'grocery_admin', 'restaurant_admin', 'hotel_admin', 'taxi_admin'],
        'orders': ['admin', 'ecommerce_admin', 'grocery_admin', 'restaurant_admin', 'hotel_admin', 'taxi_admin'],
        'categories': ['admin', 'ecommerce_admin', 'grocery_admin', 'restaurant_admin', 'hotel_admin', 'taxi_admin'],
        'users': ['admin'],
        'roles': ['admin'],
        'permissions': ['admin']
      };

      if (resourceRoles[resource] && resourceRoles[resource].includes(req.user.role)) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: `Access denied. Required resource permission: ${resource}`
      });
    } catch (error) {
      console.error('Resource permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking resource permissions'
      });
    }
  };
}; 