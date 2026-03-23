// Authentication and role management service

export const getUserRole = () => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  
  try {
    const userData = JSON.parse(user);
    return userData.role;
  } catch {
    return null;
  }
};

export const isAdmin = () => getUserRole() === 'admin';
export const isManager = () => getUserRole() === 'stock_manager';
export const isClient = () => getUserRole() === 'client';

export const getDashboardRoute = () => {
  const role = getUserRole();
  switch (role) {
    case 'admin':
      return '/app/admin/dashboard';
    case 'stock_manager':
      return '/app/manager/dashboard';
    case 'client':
      return '/app/client/dashboard';
    default:
      return '/login';
  }
};

export const hasPermission = (resource, action) => {
  const role = getUserRole();
  
  const permissions = {
    admin: {
      users: ['read', 'create', 'update', 'delete'],
      clients: ['read', 'update'],
      products: ['read', 'create', 'update', 'delete'],
      orders: ['read', 'update'],
      dashboard: ['read'],
      contacts: ['read', 'update', 'delete']
    },
    stock_manager: {
      products: ['read', 'create', 'update', 'delete'],
      orders: ['read', 'update'],
      dashboard: ['read'],
      alerts: ['read', 'update'],
      users: ['read', 'create', 'update', 'delete'] // only other managers
    },
    client: {
      products: ['read'],
      orders: ['read', 'create'],
      dashboard: ['read']
    }
  };
  
  return permissions[role]?.[resource]?.includes(action) || false;
};
