import React from 'react';
import {useAuth} from '../context/AuthContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/style.css';
import {useNavigate} from "react-router-dom";

const Header = () => {
    //------------------------------------------------------------------------------------------------------------------
    // Variables
    //------------------------------------------------------------------------------------------------------------------
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    //------------------------------------------------------------------------------------------------------------------
    // Metodos
    //------------------------------------------------------------------------------------------------------------------
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    //------------------------------------------------------------------------------------------------------------------
    // Render
    //------------------------------------------------------------------------------------------------------------------
    return (
        <>
            <header>
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
                                    <button
                                        className="btn btn-outline-danger d-flex align-items-center text-black"
                                        onClick={handleLogout}
                                        title="Cerrar sesión"
                                    >
                                        <img
                                            src="/assets/icons/logout.png"
                                            alt="Cerrar sesión"
                                            width="24"
                                            height="24"
                                            className="me-2"
                                        />
                                        Salir
                                    </button>
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