import { useState, useEffect } from "react";
import PuestoService from "../services/PuestoService.jsx";
import EmpresaService from "../services/EmpresaService.jsx";

function Imagen({ entidadId, imagen, className, style, tipoEntidad = 'puesto' }) {
    const [imagenUrl, setImagenUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Limpiar la URL del objeto al desmontar el componente o antes de crear una nueva
        return () => {
            if (imagenUrl && imagenUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imagenUrl);
            }
        };
    }, [imagenUrl]);

    useEffect(() => {
        // Reinicia los estados cuando cambia la imagen o el entidadId
        setError(false);

        // Caso 1: Si recibimos directamente una imagen en base64
        if (typeof imagen === 'string' && imagen.startsWith('data:')) {
            setImagenUrl(imagen);
        }
        // Caso 2: Si ya tenemos una URL completa (diferente de blob:)
        else if (typeof imagen === 'string' && imagen.startsWith('http')) {
            setImagenUrl(imagen);
        }
        // Caso 3: Si solo tenemos el ID de la entidad, hacemos una solicitud directa
        else if (entidadId) {
            cargarImagenDesdeBlobDirecto(entidadId);
        }
        // Caso 4: No hay imagen
        else {
            setImagenUrl(null);
        }
    }, [entidadId, imagen, tipoEntidad]);

    // Método que utiliza axios para obtener directamente la imagen como blob
    const cargarImagenDesdeBlobDirecto = async (id) => {
        setIsLoading(true);
        try {
            // Elegir el servicio según el tipo de entidad
            let response;
            if (tipoEntidad === 'puesto') {
                response = await PuestoService.getPuestoImage(id);
            } else if (tipoEntidad === 'empresa') {
                response = await EmpresaService.getEmpresaImage(id);
            }

            // Crear una URL para el blob
            const blobUrl = URL.createObjectURL(response.data);
            setImagenUrl(blobUrl);
        } catch (err) {
            console.error(`Error al cargar la imagen de ${tipoEntidad}:`, err);
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-3 bg-light border rounded">Cargando imagen...</div>;
    }

    return imagenUrl ? (
        <img
            src={!error ? imagenUrl : "/placeholder-image.png"}
            alt="Imagen/Logo"
            className={className || "img-thumbnail"}
            style={style || { maxHeight: '200px' }}
            onError={() => {
                setError(true);
                console.error("Error al cargar la imagen");
            }}
        />
    ) : (
        <div className="text-center p-3 bg-light border rounded">Sin imagen</div>
    );
}
export default Imagen;