import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '/src/assets/css/CarouselStyles.css';
import Carousel from "../components/Carousel.jsx";
import LoginModal from "../components/LoginModal.jsx";
import {useAuth} from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';
import ToastMessageLogOut from "../components/ToastMessageLogOut.jsx";

export const HomePage = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();

    const handleButtonClick = (url) => {
        // Comprobar si la URL es externa (comienza con http:// o https://)
        if (url.startsWith('http://') || url.startsWith('https://')) {
            // Para URLs externas, usar window.location o window.open
            window.location.href = url;
            // Alternativa: window.open(url, '_blank'); // Para abrir en nueva pestaña
        } else {
            // Para URLs internas de la aplicación
            if (url === "/empresaHome" && !isAuthenticated) {
                setShowLoginModal(true);
            } else {
                navigate(url);
            }
        }
    };

    const carouselItems = [
        {
            image: "/assets/images/Perfiles.png",
            alt: "Perfiles Laborales UNA",
            title: "Perfiles Laborales UNA",
            description: "Accede al sistema de Perfiles Laborales de la Universidad Nacional y gestione su perfil profesional",
            linkText1: "Visitar",
            linkUrl1: "https://perfileslaboralesuna.com/",
        },
        {
            image: "/assets/images/FEV.jpeg",
            alt: "Feria Virtual de Empleo",
            title: "Feria Virtual de Empleo",
            description: "Explora ofertas laborales y conecta con empresas que buscan talento como el tuyo",
            linkText1: "Ver Ofertas",
            linkUrl1: "/empleos"
        },
        {
            image: "/assets/images/Empresa.jpg",
            alt: "Empresas Ofertantes",
            title: "Empresas Ofertantes",
            description: "Ingreso al sistema de gestión para las empresas ofertantes",
            linkText1: "Registrarse",
            linkUrl1: "/",
            linkText2: "Ingresar",
            linkUrl2: "/empresaHome",
        },
    ];

    useEffect(() => {
        console.log("AuthContext data:", useAuth);
    }, [])

    return (
        <>
            <ToastMessageLogOut />
            <div>
                <Carousel
                    items={carouselItems}
                    onButtonClick={handleButtonClick}
                />
                <LoginModal
                    show={showLoginModal}
                    handleClose={() => setShowLoginModal(false)}
                />
            </div>
        </>
    );
};