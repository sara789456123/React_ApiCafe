import React from 'react';
import { useLocation } from 'react-router-dom';

function AdminRoute({ children }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isAdmin = searchParams.get('admin') === '1';

  return children({ isAdmin });
}

export default AdminRoute;
