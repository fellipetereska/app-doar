import React from "react";
import { createContext, useState } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

	const [user, setUser] = useState(() => {
		const storage = localStorage.getItem('doar');
		const parsed = storage ? JSON.parse(storage) : null;
		return parsed?.usuario || null;
	});

	const [isAuthenticated, setIsAuthenticated] = useState(() => {
		const storage = localStorage.getItem('doar');
		const parsed = storage ? JSON.parse(storage) : null;
		return !!parsed?.usuario;
	});

	// Função de Login
	const signin = async (user) => {
		setUser(user);
		setIsAuthenticated(true);
	};

	// Função de Logout
	const signout = () => {
		localStorage.removeItem('doar');
		setUser(null);
		setIsAuthenticated(false);
	};

	const checkSignIn = async () => {
		const user = localStorage.getItem('user');
		if (user) {
			setUser(JSON.parse(user));
			setIsAuthenticated(true);
		}
	}

	return (
		<AuthContext.Provider value={{
			user, setUser,
			isAuthenticated, setIsAuthenticated,
			signin, signout,
			checkSignIn,
		}}>
			{children}
		</AuthContext.Provider>
	);
}