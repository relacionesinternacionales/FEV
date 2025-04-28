import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Editor from "../../components/Editor.jsx";
import Imagen from "../../components/Imagen.jsx";
import ToastMessage from "../../components/ToastMessage.jsx";
import {useToast} from "../../components/useToast.jsx";
import EmpresaService from "../../services/EmpresaService.jsx";

export const EmpresaCreatePage = ({mode}) => {

    const codigosPais = [
        {codigo: "+1", pais: "Estados Unidos/Canadá"},
        {codigo: "+34", pais: "España"},
        {codigo: "+52", pais: "México"},
        {codigo: "+54", pais: "Argentina"},
        {codigo: "+56", pais: "Chile"},
        {codigo: "+57", pais: "Colombia"},
        {codigo: "+502", pais: "Guatemala"},
        {codigo: "+503", pais: "El Salvador"},
        {codigo: "+504", pais: "Honduras"},
        {codigo: "+505", pais: "Nicaragua"},
        {codigo: "+506", pais: "Costa Rica"},
        {codigo: "+507", pais: "Panamá"},
        {codigo: "+593", pais: "Ecuador"},
        {codigo: "+598", pais: "Uruguay"},
        {codigo: "+51", pais: "Perú"},
        {codigo: "+58", pais: "Venezuela"},
        {codigo: "+55", pais: "Brasil"},
        {codigo: "+591", pais: "Bolivia"},
        {codigo: "+595", pais: "Paraguay"},
        {codigo: "+53", pais: "Cuba"},
        {codigo: "+809", pais: "República Dominicana"},
        {codigo: "+49", pais: "Alemania"},
        {codigo: "+33", pais: "Francia"},
        {codigo: "+44", pais: "Reino Unido"},
        {codigo: "+39", pais: "Italia"},
        {codigo: "+351", pais: "Portugal"},
        {codigo: "+31", pais: "Países Bajos"},
    ];

    //------------------------------------------------------------------------------------------------------------------
    // Variables
    //------------------------------------------------------------------------------------------------------------------
    const empresaId = localStorage.getItem("empresaId")
    const navigate = useNavigate();
    const isDisabled = mode === 'view';
    const isEditMode = mode === 'edit';
    const {toast, showToast, closeToast, setToastForNextPage} = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Modelo
    const {id} = useParams();
    const [cedula, setCedula] = useState(empresaId);
    const [cedulaSinFormato, setCedulaSinFormato] = useState(''); // Para mantener el valor sin formato
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [correo, setCorreo] = useState('');
    const [codigoPais1, setCodigoPais1] = useState('');
    const [codigoPais2, setCodigoPais2] = useState('');
    const [telefono1, setTelefono1] = useState('');
    const [telefono2, setTelefono2] = useState('');
    const [web, setWeb] = useState('');
    const [imagen, setImagen] = useState(''); // Guardaremos la imagen en Base64
    const [imagenTipo, setImagenTipo] = useState(''); // Tipo MIME de la imagen

    // Errores
    const [errors, setErrors] = useState({
        cedula: "",
        nombre: '',
        descripcion: '',
        correo: '',
        codigoPais1: '',
        codigoPais2: '',
        telefono1: '',
        telefono2: '',
        web: '',
        imagen: '',
    });

    //------------------------------------------------------------------------------------------------------------------
    // Funciones para formatear cédula
    //------------------------------------------------------------------------------------------------------------------
    // Función para formatear cédula según longitud
    const formatearCedula = (value) => {
        if (!value) return '';

        // Eliminar los caracteres no numéricos
        let soloNumeros = value.replace(/[^\d]/g, '');

        // Determinar el formato según la longitud
        if (soloNumeros.length === 10) {
            return `${soloNumeros[0]}-${soloNumeros.substring(1, 4)}-${soloNumeros.substring(4)}`;
        } else if (soloNumeros.length === 9) {
            return `${soloNumeros[0]}-${soloNumeros.substring(1, 5)}-${soloNumeros.substring(5)}`;
        }

        // Si no cumple con las longitudes específicas, devolver el valor tal cual
        return value;
    };

    // Manejar cambio de cédula con formato en tiempo real
    const handleCedulaChange = (e) => {
        let valor = e.target.value;

        // Guardar la versión sin formato para procesamiento
        setCedulaSinFormato(valor.replace(/[^\d]/g, ''));

        // Si el usuario está borrando, permitirlo normalmente
        if (valor.length < cedula.length) {
            setCedula(valor);
            return;
        }

        // Eliminar cualquier formato previo para trabajar solo con números
        let soloNumeros = valor.replace(/[^\d]/g, '');

        // Si ya tenemos el número máximo de dígitos, no permitir más
        if (soloNumeros.length > 10) {
            return;
        }

        // Aplicar formato en tiempo real según la cantidad de números ingresados
        if (soloNumeros.length > 0) {
            // Primer segmento (siempre un solo dígito)
            valor = soloNumeros[0];

            // Añadir guión después del primer dígito si hay más
            if (soloNumeros.length > 1) {
                valor += '-';

                // Segundo segmento (3 dígitos para 10 dígitos totales, 4 para 9 dígitos totales)
                const longitudSegundoSegmento = soloNumeros.length >= 10 ? 3 : 4;
                const finSegundoSegmento = Math.min(1 + longitudSegundoSegmento, soloNumeros.length);
                valor += soloNumeros.substring(1, finSegundoSegmento);

                // Añadir otro guión y el tercer segmento si estamos allí
                if (soloNumeros.length > longitudSegundoSegmento + 1) {
                    valor += '-' + soloNumeros.substring(longitudSegundoSegmento + 1);
                }
            }
        }

        setCedula(valor);
    };

    // Asegurarse que el formato final sea correcto al perder el foco
    const handleCedulaBlur = () => {
        // Esta función asegura que, al salir del campo, el formato sea el correcto
        setCedula(formatearCedula(cedula));
    };

    // Placeholder según formato
    const cedulaPlaceholder = "Digite la cédula (1-234-567890 o 1-2345-6789)";

    //------------------------------------------------------------------------------------------------------------------
    // Métodos / Funciones
    //------------------------------------------------------------------------------------------------------------------
    function validarForm() {
        let valid = true;

        const errorsCopy = {...errors};

        // Cedula
        if (!cedula || cedula === "") {
            errorsCopy.cedula = "La cedula es obligatoria";
            valid = false;
        } else {
            errorsCopy.cedula = "";
        }

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

        // Validar teléfono 1 (si tiene código de país, debe tener número)
        if (codigoPais1 && !telefono1) {
            errorsCopy.telefono1 = "Si selecciona un código de país, debe ingresar un número";
            valid = false;
        } else {
            errorsCopy.telefono1 = "";
        }

        // Validar teléfono 2 (si tiene código de país, debe tener número)
        if (codigoPais2 && !telefono2) {
            errorsCopy.telefono2 = "Si selecciona un código de país, debe ingresar un número";
            valid = false;
        } else {
            errorsCopy.telefono2 = "";
        }



        setErrors(errorsCopy);
        return valid;
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Función para convertir File a Base64
    // -----------------------------------------------------------------------------------------------------------------
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

    const createOrUpdateEmpresa = async (e) => {
        e.preventDefault();

        if (validarForm()) {
            setIsLoading(true);

            // Al enviar, usamos la cédula sin formato para guardar el valor real
            const valorCedulaParaGuardar = cedulaSinFormato || cedula.replace(/[^\d]/g, '');

            const empresaDTO = {
                id,
                cedula: valorCedulaParaGuardar,
                nombre,
                descripcion,
                correo,
                codigoPais1,
                codigoPais2,
                telefono1,
                telefono2,
                web,
                imagen,
                imagenTipo
            };
            const empresaCreateDTO = {
                id,
                cedula: valorCedulaParaGuardar,
                nombre,
                descripcion,
                correo,
                codigoPais1,
                codigoPais2,
                telefono1,
                telefono2,
                web,
                imagen,
                imagenTipo
            };

            //Actualizar puesto
            if (id) {
                try {
                    const response = await EmpresaService.updateEmpresa(id, empresaDTO);
                    console.log(response.data);
                    setToastForNextPage('Empresa editada correctamente');
                    navigate(`/empresa/view/${empresaId}`);
                } catch (error) {
                    showToast('Hubo un error al editar la empresa: ' + error.message, 'danger');
                } finally {
                    setIsLoading(false);
                }
            }

            // Crear Puesto
            else {
                try {
                    /*
                    const response = await PuestoService.createPuesto(empresaCreateDTO);
                    console.log(response);
                    setToastForNextPage('Puesto creado correctamente');
                    navigate(`/empresa/view/${empresaId}`);
                    */
                } catch (error) {
                    showToast('Hubo un error al crear la empresa: ' + error.message, 'danger');
                } finally {
                    setIsLoading(false);
                }
            }
        }
    }

    function title() {
        if (id && mode === 'edit') {
            return <h1 className={"text-center card-header"}>Editar {nombre}</h1>;
        }
        if (id && mode === 'view') {
            return <h1 className={"text-center card-header"}>{nombre}</h1>;
        }
        return <h1 className={"text-center card-header"}>Crear Empresa</h1>;
    }

    function mostrarBotonGuardar() {
        if (id && mode === 'view') {
            return null;
        } else {
            return (
                <button
                    className={"btn btn-primary mx-2"}
                    onClick={(e) => createOrUpdateEmpresa(e)}
                    disabled={isLoading}
                >
                    {isLoading ? 'Guardando...' : 'Guardar'}
                </button>
            );
        }
    }

    function editEmpresa() {
        navigate(`/empresa/edit/${empresaId}`);
    }

    function cleanInputs() {
        setCedula('')
        setNombre('')
        setDescripcion('')
        setCorreo('')
        setCodigoPais1('')
        setCodigoPais2('')
        setTelefono1('')
        setTelefono2('')
        setWeb('')
        setImagen('')
    }

    function volver() {
        cleanInputs();
        isEditMode
            ? navigate(`/empresa/view/${empresaId}`)
            : navigate(`/empresaHome`);
    }

    //------------------------------------------------------------------------------------------------------------------
    // UseEffect
    //------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        if (id) {
            EmpresaService.getEmpresaById(id).then(response => {
                // Guardar cédula sin formato
                setCedulaSinFormato(response.data.cedula ? response.data.cedula.replace(/[^\d]/g, '') : '');

                // Aplicar formato a la cédula para mostrarla
                setCedula(formatearCedula(response.data.cedula));

                // Resto de campos
                setNombre(response.data.nombre);
                setDescripcion(response.data.descripcion);
                setCorreo(response.data.correo);
                setCodigoPais1(response.data.codigoPais1);
                setCodigoPais2(response.data.codigoPais2);
                setTelefono1(response.data.telefono1);
                setTelefono2(response.data.telefono2);
                setWeb(response.data.web);

                // Logo
                if (response.data.imagen) {
                    if (typeof response.data.imagen === 'string' && response.data.imagen.startsWith('data:')) {
                        setImagen(response.data.imagen);
                    } else {
                        setImagen('exist');
                    }
                    setImagenTipo(response.data.imagenTipo);
                }
            }).catch((error) => {
                console.log(error)
            });
        }
        const storedMessage = localStorage.getItem('toastMessage');
        if (storedMessage) {
            const messageType = localStorage.getItem('toastType') || 'success';
            showToast(storedMessage, messageType);
            localStorage.removeItem('toastMessage');
            localStorage.removeItem('toastType');
        }
    }, [id, mode]);

    //------------------------------------------------------------------------------------------------------------------
    // Render
    //------------------------------------------------------------------------------------------------------------------
    return (
        <>
            <div>
                <div className='container'>
                    {/* Boton Editar */}
                    {
                        isDisabled && (
                            <button className="btn btn-warning mb-1 float-end fw-bold" onClick={editEmpresa}><i
                                className="bi bi-pen-fill me-2"></i>Editar</button>
                        )
                    }
                    <br/>
                    <br/>

                    <div className='card'>
                        {/* Titulo */}
                        {title()}

                        {/* Cuerpo */}
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

                                                {/* Cedula de la empresa */}
                                                <div className="mb-3 d-flex flex-column">
                                                    <label className="form-label text-start fw-bold">Cédula</label>
                                                    <input
                                                        disabled={isDisabled || isLoading}
                                                        type="text"
                                                        placeholder={cedulaPlaceholder}
                                                        name="cedula"
                                                        className={`form-control ${errors.cedula ? 'is-invalid' : ''}`}
                                                        value={cedula}
                                                        onChange={handleCedulaChange}
                                                        onBlur={handleCedulaBlur}
                                                    />
                                                    {errors.cedula &&
                                                        <div className={"invalid-feedback"}>{errors.cedula}</div>}
                                                </div>

                                                {/* Nombre de la empresa */}
                                                <div className="mb-3 d-flex flex-column">
                                                    <label className="form-label text-start fw-bold">Nombre</label>
                                                    <input
                                                        disabled={isDisabled || isLoading}
                                                        type="text"
                                                        placeholder="Digite el nombre del puesto"
                                                        name="nombre"
                                                        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                                        value={nombre}
                                                        onChange={(e) => setNombre(e.target.value)}
                                                    />
                                                    {errors.nombre &&
                                                        <div className={"invalid-feedback"}>{errors.nombre}</div>}
                                                </div>

                                                {/* Email de la empresa */}
                                                <div className="mb-3 d-flex flex-column">
                                                    <label className="form-label text-start fw-bold">Email</label>
                                                    <input
                                                        disabled={isDisabled || isLoading}
                                                        type="text"
                                                        placeholder="Digite el email de la empresa"
                                                        name="email"
                                                        className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
                                                        value={correo}
                                                        onChange={(e) => setCorreo(e.target.value)}
                                                    />
                                                    {errors.correo &&
                                                        <div className={"invalid-feedback"}>{errors.correo}</div>}
                                                </div>

                                                {/* Teléfonos */}
                                                <div className={"mb-3 d-flex flex-row"}>
                                                    {/* Telefono 1 */}
                                                    <div className="me-1 d-flex flex-column">
                                                        <label
                                                            className="form-label text-start fw-bold">Teléfono</label>
                                                        <div className="d-flex">
                                                            <select
                                                                disabled={isDisabled || isLoading}
                                                                className="form-select me-2"
                                                                style={{width: "30%"}}
                                                                value={codigoPais1}
                                                                onChange={(e) => setCodigoPais1(e.target.value)}
                                                            >
                                                                <option value="">Seleccione código</option>
                                                                {codigosPais.map((pais) => (
                                                                    <option key={pais.codigo} value={pais.codigo}>
                                                                        {pais.codigo}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <input
                                                                disabled={isDisabled || isLoading}
                                                                type="tel"
                                                                placeholder="Número de teléfono"
                                                                name="telefono1"
                                                                className={`form-control ${errors.telefono1 ? 'is-invalid' : ''}`}
                                                                value={telefono1}
                                                                onChange={(e) => setTelefono1(e.target.value)}
                                                            />
                                                        </div>
                                                        {errors.telefono1 &&
                                                            <div
                                                                className="text-danger small mt-1">{errors.telefono1}</div>}
                                                    </div>

                                                    {/* Teléfono 2 */}
                                                    <div className="ms-1 d-flex flex-column">
                                                        <label
                                                            className="form-label text-start fw-bold">Teléfono</label>
                                                        <div className="d-flex">
                                                            <select
                                                                disabled={isDisabled || isLoading}
                                                                className="form-select me-2"
                                                                style={{width: "30%"}}
                                                                value={codigoPais2}
                                                                onChange={(e) => setCodigoPais2(e.target.value)}
                                                            >
                                                                <option value="">Seleccione código</option>
                                                                {codigosPais.map((pais) => (
                                                                    <option key={pais.codigo} value={pais.codigo}>
                                                                        {pais.codigo}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <input
                                                                disabled={isDisabled || isLoading}
                                                                type="tel"
                                                                placeholder="Número de teléfono (opcional)"
                                                                name="telefono2"
                                                                className={`form-control ${errors.telefono2 ? 'is-invalid' : ''}`}
                                                                value={telefono2}
                                                                onChange={(e) => setTelefono2(e.target.value)}
                                                            />
                                                        </div>
                                                        {errors.telefono2 &&
                                                            <div
                                                                className="text-danger small mt-1">{errors.telefono2}</div>}
                                                    </div>
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
                                                <div className="mb-3 d-flex flex-column">
                                                    <label className="form-label text-start fw-bold">Logo</label>
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
                                                                style={{maxHeight: '200px'}}
                                                                tipoEntidad="empresa"
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* WebSite */}
                                                <div className="mb-0 d-flex flex-column">
                                                    <label className="form-label text-start fw-bold">Web Site</label>
                                                    <input
                                                        disabled={isDisabled || isLoading}
                                                        type="url"
                                                        placeholder="https://ejemplo.com"
                                                        name="url"
                                                        className="form-control"
                                                        value={web}
                                                        onChange={(e) => setWeb(e.target.value)}
                                                    />
                                                    <div className="form-text text-start">Pagina web para conocer acerca
                                                        de {nombre}</div>
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
                                    <button className='btn btn-secondary mx-2' onClick={volver}>Volver</button>
                                    {mostrarBotonGuardar()}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* ToastMessage */}
            <ToastMessage
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />
        </>
    )
}

export default EmpresaCreatePage