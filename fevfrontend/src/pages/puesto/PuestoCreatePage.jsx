import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PuestoService from "../../services/PuestoService.jsx";
import Editor from "../../components/Editor.jsx";
import Imagen from "../../components/Imagen.jsx";
import ToastMessage from "../../components/ToastMessage.jsx";
import {useToast} from "../../components/useToast.jsx";

export const PuestoCreatePage = ({ mode }) => {
    //------------------------------------------------------------------------------------------------------------------
    // Variables
    //------------------------------------------------------------------------------------------------------------------
    const empresaId = localStorage.getItem("empresaId")
    const navigate = useNavigate();
    const isDisabled = mode === 'view';
    const { toast, showToast, closeToast, setToastForNextPage } = useToast();

    // Modelo
    const { id } = useParams();
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [url, setUrl] = useState('');
    const [imagen, setImagen] = useState(''); // Guardaremos la imagen en Base64
    const [imagenTipo, setImagenTipo] = useState(''); // Tipo MIME de la imagen
    const [estado, setEstado] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Errores
    const [errors, setErrors] = useState({
        nombre: '',
        descripcion: '',
        url: '',
        imagen: '',
        estado: ''
    });

    //------------------------------------------------------------------------------------------------------------------
    // Métodos / Funciones
    //------------------------------------------------------------------------------------------------------------------
    function validarForm() {
        let valid = true;

        const errorsCopy = { ...errors };

        // Validar nombre
        if (!nombre || nombre === "") {
            errorsCopy.nombre = "El nombre es obligatorio";
            valid = false;
        } else {
            errorsCopy.nombre = "";
        }

        // Validar descripción
        if (!descripcion || descripcion === "" || descripcion === "<p><br></p>") {
            errorsCopy.descripcion = "La descripcion es obligatoria";
            valid = false;
        } else {
            errorsCopy.descripcion = "";
        }

        // Validar estado
        if (!estado || estado === "") {
            errorsCopy.estado = "El estado es obligatorio";
            valid = false;
        } else {
            errorsCopy.estado = "";
        }

        setErrors(errorsCopy);
        return valid;
    }

    // Función para convertir File a Base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64 = await fileToBase64(file);
                setImagen(base64); // Esto reemplazará la URL anterior si había una
                setImagenTipo(file.type);
            } catch (error) {
                console.error("Error al convertir imagen:", error);
                alert("Error al procesar la imagen");
            }
        }
    };

    const createOrUpdateProducto = async (e) => {
        e.preventDefault();

        if (validarForm()) {
            setIsLoading(true);

            const puestoDTO = { id, nombre, descripcion, url, imagen, imagenTipo, estado };
            const puestoCreateDTO = { nombre, descripcion, url, imagen, imagenTipo, estado, empresaId };

            //Actualizar puesto
            if (id) {
                try {
                    const response = await PuestoService.updatePuesto(id, puestoDTO);
                    console.log(response.data);
                    setToastForNextPage('Puesto editado correctamente');
                    navigate('/empresaHome');
                } catch (error) {
                    showToast('Hubo un error al editar el puesto: ' + error.message, 'danger');
                } finally {
                    setIsLoading(false);
                }
            }
            // Crear Puesto
            else {
                try {
                    const response = await PuestoService.createPuesto(puestoCreateDTO);
                    console.log(response);
                    setToastForNextPage('Puesto creado correctamente');
                    navigate('/empresaHome');
                } catch (error) {
                    showToast('Hubo un error al crear el puesto: ' + error.message, 'danger');
                } finally {
                    setIsLoading(false);
                }
            }
        }
    }

    function title() {
        if (id && mode === 'edit') {
            return <h1 className={"text-center card-header"}>Editar Puesto</h1>;
        }
        if (id && mode === 'view') {
            return <h1 className={"text-center card-header"}>Ver Puesto</h1>;
        }
        return <h1 className={"text-center card-header"}>Agregar Puesto</h1>;
    }

    function mostrarBotonGuardar() {
        if (id && mode === 'view') {
            return null;
        } else {
            return (
                <button
                    className={"btn btn-primary mx-2"}
                    onClick={(e) => createOrUpdateProducto(e)}
                    disabled={isLoading}
                >
                    {isLoading ? 'Guardando...' : 'Guardar'}
                </button>
            );
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // UseEffect
    //------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        if (id) {
            PuestoService.getPuestosById(id).then(response => {
                setNombre(response.data.nombre);
                setDescripcion(response.data.descripcion);
                setUrl(response.data.url);

                // Ya no necesitamos manejar la lógica de la imagen aquí
                // Solo almacenamos la información básica
                if (response.data.imagen) {
                    // Para nuevas imágenes en base64 (durante la creación)
                    if (typeof response.data.imagen === 'string' && response.data.imagen.startsWith('data:')) {
                        setImagen(response.data.imagen);
                    } else {
                        // Para imágenes existentes, solo guardamos un indicador
                        // El componente Imagen se encargará de cargar la imagen correcta
                        setImagen('exist');
                    }
                    setImagenTipo(response.data.imagenTipo);
                }
                setEstado(response.data.estado);
            }).catch((error) => {
                console.log(error)
            });
        }
    }, [id])

    //------------------------------------------------------------------------------------------------------------------
    // Render
    //------------------------------------------------------------------------------------------------------------------
    return (
        <>
            <div>
                <div className='container'>
                    <br />
                    <br />
                    <div className='card'>
                        {title()}
                        <div className='card-body'>
                            <form>
                                <div className={"row"}>
                                    {/* Columna izquierda - Datos principales */}
                                    <div className={"col-md-7 mb-3"}>
                                        <div className="card h-100">
                                            <div className="card-header bg-light">
                                                <h5 className="m-0">Información Principal</h5>
                                            </div>
                                            <div className="card-body d-flex flex-column justify-content-evenly">
                                                {/* Nombre del puesto */}
                                                <div className="mb-3 d-flex flex-column">
                                                    <label className="form-label text-start fw-bold">Nombre del puesto</label>
                                                    <input
                                                        disabled={isDisabled || isLoading}
                                                        type="text"
                                                        placeholder="Digite el nombre del puesto"
                                                        name="nombre"
                                                        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                                        value={nombre}
                                                        onChange={(e) => setNombre(e.target.value)}
                                                    />
                                                    {errors.nombre && <div className={"invalid-feedback"}>{errors.nombre}</div>}
                                                </div>

                                                {/* Estado */}
                                                <div className="mb-3 d-flex flex-column">
                                                    <label className="form-label text-start fw-bold">Estado</label>
                                                    <select
                                                        disabled={isDisabled || isLoading}
                                                        className={`form-select ${errors.estado ? 'is-invalid' : ''}`}
                                                        value={estado}
                                                        onChange={(e) => setEstado(e.target.value)}
                                                    >
                                                        <option value="">Seleccione un estado</option>
                                                        <option value="Activo">Activo</option>
                                                        <option value="Inactivo">Inactivo</option>
                                                    </select>
                                                    {errors.estado && <div className={"invalid-feedback"}>{errors.estado}</div>}
                                                </div>

                                                {/* URL relacionada */}
                                                <div className="mb-0 d-flex flex-column">
                                                    <label className="form-label text-start fw-bold">URL</label>
                                                    <input
                                                        disabled={isDisabled || isLoading}
                                                        type="url"
                                                        placeholder="https://ejemplo.com"
                                                        name="url"
                                                        className="form-control"
                                                        value={url}
                                                        onChange={(e) => setUrl(e.target.value)}
                                                    />
                                                    <div className="form-text text-start">URL para aplicar al puesto</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Columna derecha - Detalles adicionales */}
                                    <div className={"col-md-5 mb-3"}>
                                        <div className="card h-100">
                                            <div className="card-header bg-light">
                                                <h5 className="mb-0">Información Adicional</h5>
                                            </div>
                                            <div className="card-body">
                                                {/* Imagen del puesto */}
                                                <div className="mb-3 d-flex flex-column h-100">
                                                    <label className="form-label text-start fw-bold">Imagen</label>
                                                    {!isDisabled && (
                                                        <input
                                                            disabled={isLoading}
                                                            type="file"
                                                            className="form-control"
                                                            onChange={handleImageChange}
                                                            accept="image/*"
                                                        />
                                                    )}
                                                    <div className="mt-2 w-100 h-100">
                                                        {(imagen || id) && (
                                                            <Imagen
                                                                entidadId={id}
                                                                imagen={imagen}
                                                                className="img-thumbnail"
                                                                style={{ maxHeight: '200px' }}
                                                                tipoEntidad="puesto"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Row Descripcion */}
                                <div className="row mt-3">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-header bg-light">
                                                <h5 className="mb-0">Descripción del puesto</h5>
                                            </div>
                                            <div className="card-body">
                                                <Editor
                                                    value={descripcion}
                                                    onChange={setDescripcion}
                                                    isDisabled={isDisabled || isLoading}
                                                    error={errors.descripcion}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className={"mt-3 p-1 d-flex flex-row justify-content-center"}>
                                    <Link to='/empresaHome' className='btn btn-secondary mx-2'>Volver</Link>
                                    {mostrarBotonGuardar()}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Añade el componente ToastMessage aquí */}
            <ToastMessage
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />
        </>
    )
}

export default PuestoCreatePage