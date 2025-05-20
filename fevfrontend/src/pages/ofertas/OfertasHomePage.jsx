import React, {useEffect, useState} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '/src/css/style.css';
import {useNavigate} from 'react-router-dom';
import ToastMessage from "../../components/ToastMessage.jsx";
import {useToast} from "../../components/useToast.jsx";
import EmpresaService from "../../services/EmpresaService.jsx";
import {Swiper, SwiperSlide} from "swiper/react";
import {FreeMode, Navigation, Thumbs, Pagination} from 'swiper/modules';
import Editor from "../../components/Editor.jsx";
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import '/src/css/CarouselEmpresas.css';
import Imagen from "../../components/Imagen.jsx";
import PuestoService from "../../services/PuestoService.jsx";

export const OfertasHomePage = () => {
    //------------------------------------------------------------------------------------------------------------------
    // Variables
    //------------------------------------------------------------------------------------------------------------------
    const navigator = useNavigate();
    const {toast, closeToast} = useToast();

    const [empresas, setEmpresas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingEmpresa, setIsLoadingEmpresa] = useState(true);

    const [puestos, setPuestos] = useState([]);
    const [isLoadingPuestos, setIsLoadingPuestos] = useState(false);

    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const [selectedCompany, setSelectedCompany] = useState(null);

    // Actualizar la empresa seleccionada cuando cambia el slide
    const handleSlideChange = (swiper) => {
        setSelectedCompany(empresas[swiper.activeIndex]);
    };

    // Función para cargar los puestos de una empresa
    const cargarPuestosPorEmpresa = (empresa) => {
        if (!empresa) return;

        setIsLoadingPuestos(true);
        setPuestos([]);

        PuestoService.getPuestosByEmpresaId(empresa.id)
            .then(puestosData => {
                setPuestos(puestosData);
                setIsLoadingPuestos(false);
            })
            .catch(error => {
                console.log(error);
                setIsLoadingPuestos(false);
            });
    };

    function formatearURL(url) {
        if (!/^https?:\/\//i.test(url)) {
            return `https://${url}`;
        }
        return url;
    }

    //------------------------------------------------------------------------------------------------------------------
    // UseEffect
    //------------------------------------------------------------------------------------------------------------------
    // Carga inicial de empresas
    useEffect(() => {
        EmpresaService.getEmpresas()
            .then(empresasData => {
                console.log(empresasData);
                setEmpresas(empresasData);

                if (empresasData && empresasData.length > 0) {
                    setSelectedCompany(empresasData[0]);
                }

                setIsLoading(false);
                setIsLoadingEmpresa(false);
            })
            .catch(error => {
                console.log(error);
                setIsLoading(false);
                setIsLoadingEmpresa(false);
            });
    }, []);

    // Cargar puestos cuando cambia la empresa seleccionada
    useEffect(() => {
        cargarPuestosPorEmpresa(selectedCompany);
    }, [selectedCompany?.id]); // Solo se activa cuando cambia el ID de la empresa

    //------------------------------------------------------------------------------------------------------------------
    // Render
    //------------------------------------------------------------------------------------------------------------------
    return (
        <>
            <div className="container-fluid d-flex flex-row-reverse gap-3">
                {/* Swiper principal */}
                {isLoadingEmpresa ? (
                    <div className="text-center p-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-2">Cargando empresas...</p>
                    </div>
                ) : (
                    <Swiper
                        className="main-swiper border border-danger border-3"
                        spaceBetween={10}
                        navigation={true}
                        thumbs={{swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null}}
                        modules={[FreeMode, Navigation, Thumbs]}
                        onSlideChange={handleSlideChange}
                    >
                        {empresas && empresas.length > 0 ? empresas.map((item, index) => (
                            <SwiperSlide key={`main-slide-${index}`} className="main-slide">
                                <div className="puesto-section px-4">
                                    <div className="align-items-center m-2">
                                        <h1 className="mb-4">{item.nombre}</h1>
                                    </div>
                                    <div
                                        className="d-flex flex-fill flex-row align-items-start">
                                        {/* Información de la empresa */}
                                        <div className="company-info me-1 p-2">
                                            <div className="info-section text-start mx-2">
                                                <Editor
                                                    isToolbar={false}
                                                    value={item.descripcion}
                                                    isDisabled={true}
                                                />
                                            </div>
                                        </div>

                                        {/* Detalles */}
                                        <div className="company-info ms-1 p-2">
                                            <div className="d-flex flex-fill align-items-center">
                                                <i className="bi bi-person-raised-hand h3"></i> <h3 className={"fw-bold"}>Puestos disponibles: {puestos.length}</h3>
                                            </div>
                                            <div className="d-flex flex-fill">
                                                {/* WhatsApp*/}
                                                <a className="navbar-brand m-2"
                                                   href={`https://wa.me/${selectedCompany.codigoPais1 + selectedCompany.telefono1}?text=${encodeURIComponent("")}`}
                                                   target="_blank"
                                                >
                                                    <i className="bi bi-whatsapp h3 text-success"></i>
                                                </a>

                                                {/* Email */}
                                                <a className="navbar-brand m-2"
                                                   href={`mailto:${selectedCompany.correo}?subject=${encodeURIComponent("Feria de Empleo Virtual UNA")}`}
                                                   target="_blank"
                                                   rel="noopener noreferrer"
                                                >
                                                    <i className="bi bi-envelope h3"></i>
                                                </a>

                                                {/* Web */}
                                                <a className="navbar-brand m-2"
                                                   href={formatearURL(selectedCompany.web)}
                                                   target="_blank"
                                                   rel="noopener noreferrer"
                                                >
                                                    <i className="bi bi-globe2 h3 text-primary"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Puestos */}
                                    <div className="puesto-section mt-3 align-items-center mb-1">
                                        <h3>Vacantes disponibles</h3>
                                        {isLoadingPuestos ? (
                                            <div className="text-center px-4">
                                                <div className="spinner-border" role="status">
                                                    <span className="visually-hidden">Cargando...</span>
                                                </div>
                                                <p className="mt-2">Cargando puestos...</p>
                                            </div>
                                        ) : (
                                            <Swiper navigation={true} modules={[Navigation]}
                                                    spaceBetween={10}
                                                    slidesPerView={3}
                                                    className="px-5"
                                            >
                                                {puestos && puestos.length > 0 ? puestos.map((puesto, index) => (
                                                    <SwiperSlide key={`puestos-${index}`}
                                                                 className="d-flex align-items-stretch">
                                                        <div
                                                            className="container border border-black border-2 rounded-2 d-flex flex-column p-3">
                                                            <h5 className="fw-bold">{puesto.nombre || 'Vacante'}</h5>
                                                            <div className="flex-grow-1 overflow-hidden flex-grow-1 my-2" style={{height: "75px"}}>
                                                                <p>{puesto.descripcion}</p>
                                                            </div>
                                                            <div className="mt-auto">
                                                                <a href="#"
                                                                   className="btn btn-primary btn-lg fw-bold p-2 px-3"
                                                                   role="button"
                                                                >
                                                                    Información
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                )) : <SwiperSlide>
                                                    <div>
                                                        <p>No hay vacantes disponibles actualmente.</p>
                                                    </div>
                                                </SwiperSlide>}
                                            </Swiper>
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        )) : <SwiperSlide key="no-data" className="main-slide">
                            <div className="company-details-container px-4">
                                <h3>No hay empresas disponibles</h3>
                            </div>
                        </SwiperSlide>}
                    </Swiper>
                )}

                {/* Miniaturas */}
                <div className="d-flex align-items-center" style={{flex: 0.1}}>
                    {isLoading ? (
                        <div className="text-center p-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-2">Cargando empresas...</p>
                        </div>
                    ) : (
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            spaceBetween={10}
                            slidesPerView={3}
                            freeMode={true}
                            direction={'vertical'}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="thumbs-swiper"
                        >
                            {empresas && empresas.length > 0 ? empresas.map((item, index) => (
                                <SwiperSlide key={`thumb-slide-${index}`} className="thumb-slide">
                                    <div className="thumb-content">
                                        <Imagen
                                            entidadId={item.id}
                                            imagen={item.imagen}
                                            className="thumb-logo"
                                            style={{height: '100%'}}
                                            tipoEntidad="empresa"
                                        />
                                    </div>
                                </SwiperSlide>
                            )) : <SwiperSlide key="no-thumb-data" className="thumb-slide">
                                <div className="thumb-content">
                                    <p className="thumb-title">No hay datos</p>
                                </div>
                            </SwiperSlide>}
                        </Swiper>
                    )}
                </div>
            </div>

            <ToastMessage
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />
        </>
    );
};