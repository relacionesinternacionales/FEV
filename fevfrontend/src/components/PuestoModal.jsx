import React, {useEffect, useState} from 'react';
import {Modal, Button, Alert} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import PuestoService from "../services/PuestoService.jsx";
import Editor from "./Editor.jsx";
import Imagen from "./Imagen.jsx";

const PuestoModal = ({show, handleClose, puestoId, selectedCompany}) => {
    const navigate = useNavigate();

    const [puesto, setPuesto] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (puestoId && show) {
            setIsLoading(true);
            setError(null);
            setPuesto(null);

            PuestoService.getPuestoById(puestoId)
                .then(puestoData => {
                    setPuesto(puestoData);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.log(error);
                    setError('Error al cargar la información del puesto');
                    setIsLoading(false);
                });
        }
    }, [puestoId, show]);

    const handleModalClose = () => {
        setPuesto(null);
        setError(null);
        handleClose();
    };

    const formatearURL = (url) => {
        if (!url) return '#';
        if (!/^https?:\/\//i.test(url)) {
            return `https://${url}`;
        }
        return url;
    };

    const handleAplicar = () => {
        if (puesto?.url) {
            window.open(formatearURL(puesto.url), '_blank');
        }
    };

    return (
        <Modal show={show} onHide={handleModalClose} centered size="lg">
            <Modal.Header closeButton className="bg-primary text-white">
                <div className="d-flex flex-column flex-fill justify-content-center align-items-center">
                    <Modal.Title className="h3 mb-0">
                        {isLoading ? 'Cargando...' : (puesto?.nombre || 'Información del Puesto')}
                    </Modal.Title>
                </div>
            </Modal.Header>

            <Modal.Body className="p-4">
                {isLoading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="text-muted">Cargando información del puesto...</p>
                    </div>
                )}

                {error && (
                    <Alert variant="danger" className="mb-3">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {error}
                    </Alert>
                )}

                {puesto && !isLoading && (
                    <div className="row">
                        {/* Imagen del puesto (si existe) */}
                        {puesto.imagen && true && puesto.imagen !== "" && (
                            <div className="col-md-4 mb-3">
                                <div className="text-center mb-3">
                                    <Imagen
                                        entidadId={puesto.id}
                                        imagen={puesto.imagen}
                                        className="img-fluid rounded shadow-sm"
                                        style={{maxHeight: '200px', objectFit: 'cover'}}
                                        tipoEntidad="puesto"
                                    />
                                </div>

                                {/* Interacciones */}
                                <div className="d-flex flex-fill justify-content-evenly">
                                    {/* WhatsApp*/}
                                    <a className="navbar-brand m-2"
                                       href={`https://wa.me/${selectedCompany.codigoPais1 + selectedCompany.telefono1}?text=${encodeURIComponent("Buenas! He visto el puesto " + puesto.nombre + " en la Feria de Empleo Virtual de la UNA y quisiera más información")}`}
                                       target="_blank"
                                    >
                                        <i className="bi bi-whatsapp h3 text-success"></i>
                                    </a>

                                    {/* Email */}
                                    <a className="navbar-brand m-2"
                                       href={`mailto:${selectedCompany.correo}?subject=${encodeURIComponent("FEV - " + puesto.nombre)}`}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                    >
                                        <i className="bi bi-envelope h3"></i>
                                    </a>

                                    {/* Web */}
                                    <a className="navbar-brand m-2"
                                       href={formatearURL(puesto.url)}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                    >
                                        <i className="bi bi-globe2 h3 text-primary"></i>
                                    </a>
                                </div>

                                {/* Información adicional
                                <div className="row mb-3 border border-black">
                                    <div className="col-12">
                                        <h6 className="text-secondary mb-2">
                                            <i className="bi bi-info-square me-2"></i>
                                            Información adicional
                                        </h6>
                                        <div className="bg-light rounded p-3">
                                            <div className="row">
                                                <div className="col-sm-6 mb-2">
                                                    <small className="text-muted d-block">ID del puesto</small>
                                                    <span className="fw-medium">#{puesto.id}</span>
                                                </div>
                                                <div className="col-sm-6 mb-2">
                                                    <small className="text-muted d-block">Estado</small>
                                                    <span className="fw-medium">{puesto.estado}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        )}

                        {/* Información del puesto */}
                        <div className={puesto.imagen ? "col-md-8" : "col-12"}>
                            {/* Título del puesto */}
                            <div className="mb-4">
                                <h4 className="text-primary fw-bold mb-2">
                                    <i className="bi bi-briefcase-fill me-2"></i>
                                    {puesto.nombre}
                                </h4>

                                {/* Estado del puesto
                                <div className="mb-2">
                                    <span className={`badge ${puesto.estado === 'ACTIVO' ? 'bg-success' : 'bg-secondary'} fs-6`}>
                                        <i className={`bi ${puesto.estado === 'ACTIVO' ? 'bi-check-circle' : 'bi-pause-circle'} me-1`}></i>
                                        {puesto.estado === 'ACTIVO' ? 'Disponible' : 'No Disponible'}
                                    </span>
                                </div>
                                */}
                            </div>

                            {/* Descripción del puesto */}
                            <div className="mb-4">
                                <h5 className="text-secondary mb-3">
                                    <i className="bi bi-file-text me-2"></i>
                                    Descripción del puesto
                                </h5>
                                <div className="border rounded p-3 bg-light">
                                    {puesto.descripcion ? (
                                        <Editor
                                            isToolbar={false}
                                            value={puesto.descripcion}
                                            isDisabled={true}
                                        />
                                    ) : (
                                        <p className="text-muted mb-0">
                                            <i className="bi bi-info-circle me-2"></i>
                                            No hay descripción disponible para este puesto.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default PuestoModal;