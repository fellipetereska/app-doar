import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, requiredPermission }) {
	const { isAuthenticated, user } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to="/" replace />;
	}
	
	if (user?.role !== requiredPermission) {
		const path = user?.role === 'instituicao' ? '/instituicao' : '/';
		return <Navigate to={path} replace />;
	}

	return children;
}

export default PrivateRoute;
