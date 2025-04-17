import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
    return useContext(AuthContext);
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Verificar si hay un token al cargar la aplicación
    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    // Configurar axios para usar el token
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    // Opcionalmente, puedes validar el token con tu backend
                    // const response = await axios.get('/api/v1/user/validate-token');

                    // Por ahora, simplemente asumimos que es válido
                    const username = localStorage.getItem('username');
                    setUser({ username });
                    setIsAuthenticated(true);
                } catch (err) {
                    // Si el token no es válido, lo eliminamos
                    console.error('Error validando token:', err);
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('username');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkToken();
    }, []);

    // Función para iniciar sesión
    const login = async (username, password) => {
        setError(null);
        try {
            const response = await axios.post('/api/v1/user/login', {
                username,
                password
            });

            const { token, username: responseUsername } = response.data;

            // Guardar token en localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('username', responseUsername);

            // Configurar axios para futuras solicitudes
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Solicitar el ID de la empresa en una segunda llamada
            try {
                const empresaResponse = await axios.get(`/api/v1/empresa/email/${responseUsername}`);
                if (empresaResponse.data) {
                    localStorage.setItem('empresaId', empresaResponse.data);
                    setUser({
                        username: responseUsername,
                        empresaId: empresaResponse.data
                    });
                } else {
                    setUser({ username: responseUsername });
                }
            } catch (empresaErr) {
                console.log('Usuario no asociado a empresa o error:', empresaErr);
                setUser({ username: responseUsername });
            }

            // Actualizar estado
            setIsAuthenticated(true);

            console.log(localStorage.getItem('authToken'));
            console.log(localStorage.getItem('username'));
            console.log(localStorage.getItem('empresaId'));

            return response.data;
        } catch (err) {
            console.error('Error de login:', err);
            setError(
                err.response?.status === 401
                    ? 'Usuario o contraseña incorrectos'
                    : 'Error al conectar con el servidor'
            );
            throw err;
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('empresaId');
        delete axios.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
        setUser(null);
    };

    // Valores que proporcionará el contexto
    const value = {
        isAuthenticated,
        user,
        loading,
        error,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};