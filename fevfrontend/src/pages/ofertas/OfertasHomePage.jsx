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
import {FreeMode, Navigation, Thumbs} from 'swiper/modules';
import Editor from "../../components/Editor.jsx";
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import '/src/css/CarouselEmpresas.css';
import Imagen from "../../components/Imagen.jsx";

export const OfertasHomePage = () => {
    //------------------------------------------------------------------------------------------------------------------
    // Variables
    //------------------------------------------------------------------------------------------------------------------
    const navigator = useNavigate();
    const {toast, closeToast} = useToast();

    const [empresas, setEmpresas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingEmpresa, setIsLoadingEmpresa] = useState(true);

    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const [selectedCompany, setSelectedCompany] = useState(null);

    // Actualizar la empresa seleccionada cuando cambia el slide
    const handleSlideChange = (swiper) => {
        setSelectedCompany(empresas[swiper.activeIndex]);
    };

    //------------------------------------------------------------------------------------------------------------------
    // UseEffect
    //------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        EmpresaService.getEmpresas().then(empresasData => {
            console.log(empresasData);
            setEmpresas(empresasData);

            if (empresasData && empresasData.length > 0) {
                setSelectedCompany(empresasData[0]);
            }

            setIsLoading(false);
            setIsLoadingEmpresa(false);
        }).catch(error => {
            console.log(error);
            setIsLoading(false);
            setIsLoadingEmpresa(false);
        })
    }, [])


    //------------------------------------------------------------------------------------------------------------------
    // Render
    //------------------------------------------------------------------------------------------------------------------
    return (
        <>
            <div className="container-fluid d-flex flex-row-reverse carousel-empresas-container">

                {/* Swiper principal */}
                {isLoadingEmpresa ? (
                    <div className="text-center p-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-2">Cargando puestos...</p>
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
                                <div className="company-details-container px-4">
                                    <div className="align-items-center m-2">
                                        <h1 className="company-title">{item.nombre}</h1>
                                    </div>
                                    <div className="d-flex flex-fill flex-row align-items-start">
                                        {/* Detalles */}
                                        <div className="company-info border border-warning me-1 p-2">
                                            <div className="info-section text-start mx-2">
                                                <Editor
                                                    isToolbar={false}
                                                    value={item.descripcion}
                                                    isDisabled={true}
                                                />
                                            </div>
                                        </div>

                                        {/* Información de la empresa */}
                                        <div className="company-info border border-black ms-1 p-2">
                                            <div className="info-section">
                                                <h5>Detalles</h5>
                                                <p>{item.details}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Puestos */}
                                    <div className="puesto-section border border-black mt-2">
                                        <h5>Vacantes disponibles</h5>
                                        {/* Aquí puedes agregar la lista de vacantes */}
                                        <div className="vacancies-list">
                                            <p>No hay vacantes disponibles actualmente.</p>
                                            {/* Ejemplo de cómo mostrar vacantes */}
                                        </div>
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
                            <p className="mt-2">Cargando puestos...</p>
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