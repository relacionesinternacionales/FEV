import React, {useEffect, useState} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '/src/css/style.css';
import {useNavigate} from 'react-router-dom';
import PuestoService from "../../services/PuestoService.jsx";
import ToastMessage from "../../components/ToastMessage.jsx";
import {useToast} from "../../components/useToast.jsx";

export const PuestoListPage = () => {
    //------------------------------------------------------------------------------------------------------------------
    // Variables
    //------------------------------------------------------------------------------------------------------------------
    const navigator = useNavigate();

    const empresaId = localStorage.getItem('empresaId');

    const {toast, closeToast} = useToast();

    const [puestos, setPuestos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    //------------------------------------------------------------------------------------------------------------------
    // Metos
    //------------------------------------------------------------------------------------------------------------------
    function addPuesto() {
        navigator("/puesto/create");
    }

    function editPuesto(id) {
        navigator(`/puesto/edit/${id}`);
    }

    function viewPuesto(id) {
        navigator(`/puesto/view/${id}`);
    }

    function removePuesto(id) {
        console.log("Eliminar puesto con id: ", id);

        if(confirm("¿Está seguro que desea eliminar este puesto?")) {
            PuestoService.deletePuesto(id).then(() => {
                PuestoService.getPuestosByEmpresaId(empresaId).then((response) => {
                    setPuestos(response);
                }).catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // UseEffect
    //------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        console.log("Obteninendo puesto")

        PuestoService.getPuestosByEmpresaId(empresaId).then(response => {
            setPuestos(response);
            console.log("Lista Puestos", response.data);
            setIsLoading(false);
        }).catch(error => {
            console.log(error);
            setIsLoading(false);
        })
    }, [])


    //------------------------------------------------------------------------------------------------------------------
    // Render
    //------------------------------------------------------------------------------------------------------------------
    return (
        <>
            {/*Tabla*/}
            <div className={"table-puestos"}>
                <br/>
                <h1>Puestos</h1>
                <button className="btn btn-primary mb-1 float-end fw-bold" onClick={addPuesto}><i
                    className="bi bi-plus-circle-fill me-2"></i>Nuevo Puesto
                </button>

                <table className={"table table-striped"}>
                    <thead>
                    <tr className={"text-center d-flex"}>
                        <th style={{flex: 1.0}} className={"px-3"}>Nombre</th>
                        <th style={{flex: 0.2}} className={""}>Estado</th>
                        <th style={{flex: 0.5}} className={""}>Opciones</th>
                    </tr>
                    </thead>
                    {isLoading ? (
                        <div className="text-center p-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-2">Cargando puestos...</p>
                        </div>
                    ) : (
                        <>
                            {puestos && puestos.length > 0 ? (
                                    <tbody>
                                    {puestos.map(puesto =>
                                        <tr className={"text-center d-flex"} key={puesto.id}>
                                            <td style={{flex: 1}}
                                                className={"text-start px-3 align-items-center align-content-center"}>{puesto.nombre}</td>
                                            <td style={{flex: 0.2}} className={"align-content-center"}>{puesto.estado}</td>
                                            <td style={{flex: 0.5}} className={"align-content-center"}>
                                                <div className={"text-center"}>
                                                    <button className="btn btn-warning m-1 fw-bold"
                                                            onClick={() => editPuesto(puesto.id)}><i
                                                        className="bi bi-pen-fill me-2"></i>Editar
                                                    </button>
                                                    <button className="btn btn-info m-1 fw-bold"
                                                            onClick={() => viewPuesto(puesto.id)}>
                                                        <i className="bi bi-eye-fill me-2"></i>Ver
                                                    </button>
                                                    <button className="btn btn-danger m-1 fw-bold"
                                                            onClick={() => removePuesto(puesto.id)}><i
                                                        className="bi bi-trash-fill me-2"></i>Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                    }
                                    </tbody>
                                )
                                :
                                (
                                    <div className="alert alert-info text-center mt-4">
                                        <i className="bi bi-info-circle-fill me-2 fs-4"></i>
                                        <p className="mb-0">No se encontraron puestos registrados para esta empresa.</p>
                                        <p className="mb-0">Puede crear un nuevo puesto utilizando el botón "Nuevo
                                            Puesto".</p>
                                    </div>
                                )
                            }
                        </>
                    )}

                </table>
            </div>

            <ToastMessage
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />
        </>
    )
}

