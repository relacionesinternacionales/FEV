import { useState, useEffect } from "react";
import PuestoService from "../services/PuestoService.jsx";

function ImagenPuesto({ puestoId, imagen, className, style }) {
    const [imagenUrl, setImagenUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    // URL base del API
    const PUESTO_BASE_REST_API_URL = "http://localhost:8080/api/v1/puesto";

    useEffect(() => {
        // Limpiar la URL del objeto al desmontar el componente o antes de crear una nueva
        return () => {
            if (imagenUrl && imagenUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imagenUrl);
            }
        };
    }, [imagenUrl]);

    useEffect(() => {
        // Reinicia los estados cuando cambia la imagen o el puestoId
        setError(false);

        // Caso 1: Si recibimos directamente una imagen en base64
        if (typeof imagen === 'string' && imagen.startsWith('data:')) {
            setImagenUrl(imagen);
        }
        // Caso 2: Si ya tenemos una URL completa (diferente de blob:)
        else if (typeof imagen === 'string' && imagen.startsWith('http')) {
            setImagenUrl(imagen);
        }
        // Caso 3: Si solo tenemos el ID del puesto, hacemos una solicitud directa
        else if (puestoId) {
            cargarImagenDesdeBlobDirecto(puestoId);
        }
        // Caso 4: No hay imagen
        else {
            setImagenUrl(null);
        }
    }, [puestoId, imagen]);

    // Método que utiliza axios para obtener directamente la imagen como blob
    const cargarImagenDesdeBlobDirecto = async (id) => {
        setIsLoading(true);
        try {
            // Realizar la solicitud para obtener la imagen como blob
            const response = await PuestoService.getPuestoImage(id)

            // Crear una URL para el blob
            const blobUrl = URL.createObjectURL(response.data);
            setImagenUrl(blobUrl);
        } catch (err) {
            console.error("Error al cargar la imagen del puesto:", err);
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
            alt="Imagen del puesto"
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

export default ImagenPuesto;