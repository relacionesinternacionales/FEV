import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '/src/assets/css/CarouselStyles.css';
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { AuthProvider } from './context/AuthContext';
import axios from 'axios';
import { PuestoListPage } from "./pages/puesto/PuestoListPage.jsx";
import PuestoCreatePage from "./pages/puesto/PuestoCreatePage.jsx";

axios.defaults.baseURL = 'http://localhost:8080';

// Nuevo componente contenedor para el interceptor
const AppWithInterceptor = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('username');
                    localStorage.removeItem('empresaId');
                    delete axios.defaults.headers.common['Authorization'];

                    localStorage.setItem('sessionExpired', 'true');
                    navigate('/');
                }

                return Promise.reject(error);
            }
        );

        // Cleanup para quitar el interceptor al desmontar
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [navigate]);

    return (
        <div className="app-container">
            <Header />
            <div className="content-container">
                <Routes>
                    <Route exact path="/" element={<HomePage />} />
                    <Route exact path="/home" element={<HomePage />} />

                    <Route exact path="/empresaHome" element={<PuestoListPage />} />
                    <Route exact path="/puesto/create" element={<PuestoCreatePage mode={"create"} />} />
                    <Route exact path="/puesto/view/:id" element={<PuestoCreatePage mode={"view"} />} />
                    <Route exact path="/puesto/edit/:id" element={<PuestoCreatePage mode={"edit"} />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
};

// Export final con AuthProvider
export const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppWithInterceptor />
            </BrowserRouter>
        </AuthProvider>
    );
};
