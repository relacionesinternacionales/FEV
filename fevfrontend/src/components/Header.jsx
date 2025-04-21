import React, {useEffect, useState} from 'react';
import {useAuth} from '../context/AuthContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/style.css';
import {useNavigate} from "react-router-dom";
import EmpresaService from "../services/EmpresaService.jsx";

const Header = () => {
    //------------------------------------------------------------------------------------------------------------------
    // Variables
    //------------------------------------------------------------------------------------------------------------------
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const empresaId = localStorage.getItem('empresaId');

    const [empresaNombre, setEmpresaNombre] = useState('');

    //------------------------------------------------------------------------------------------------------------------
    // Metodos
    //------------------------------------------------------------------------------------------------------------------
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleHome = () => {
        navigate(`/empresaHome`);
    };

    const handleProfile = () => {
        navigate(`/empresa/view/${empresaId}`);
    };

    useEffect(() => {
        const fetchEmpresa = async () => {
            try {
                const response = await EmpresaService.getEmpresaById(empresaId);
                if (response && response.data) {
                    setEmpresaNombre(response.data.nombre);
                }
            } catch (error) {
                console.error("Error obteniendo la empresa:", error);
            }
        };

        if (empresaId) {
            fetchEmpresa();
        }
    }, [empresaId]);

    //------------------------------------------------------------------------------------------------------------------
    // Render
    //------------------------------------------------------------------------------------------------------------------
    return (
        <>
            <header style={{ position: 'relative' }}>
                <div className="d-flex flex-fill justify-content-between align-items-center">
                    <div className="d-flex align-items-lg-start">
                        <a className="navbar-brand" href="https://www.una.ac.cr/">
                            <img src="/assets/images/UNA.png" alt="Logo" width="100" height="81"
                                 className="d-inline-block align-text-top mx-2"/>
                        </a>
                        <a className="navbar-brand" href="https://www.ri.una.ac.cr/">
                            <img src="/assets/images/ERI.jpg" alt="Logo" width="81" height="81"
                                 className="d-inline-block align-text-top mx-2"/>
                        </a>
                    </div>
                    <div className="d-flex align-items-center me-3">
                        {
                            isAuthenticated ? (
                                <div className="d-flex align-items-center">

                                    <h3 className={"text-black mx-5"}>{empresaNombre}</h3>
                                    <div className="btn-group" style={{ position: 'static' }}>
                                        <button className="btn dropdown-toggle" type="button"
                                                data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="bi bi-list fs-4 me-1"></i>
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={handleHome}
                                                >
                                                    <i className="bi bi-house-fill me-2"></i>
                                                    Inicio
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={handleProfile}
                                                >
                                                    <i className="bi bi-person-circle me-2"></i>
                                                    Ver perfil
                                                </button>
                                            </li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li>
                                                <button
                                                    className="dropdown-item logout"
                                                    onClick={handleLogout}
                                                >
                                                    <i className="bi bi-box-arrow-right me-2"></i>
                                                    Cerrar sesión
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ) : null
                        }
                    </div>
                </div>
            </header>
        </>
    )
}


export default Header;