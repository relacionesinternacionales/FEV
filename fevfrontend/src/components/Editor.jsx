import { useEffect, useRef } from "react";
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const Editor = ({ value, onChange, isDisabled, error }) => {
    // Referencias para el editor Quill
    const containerRef = useRef(null);
    const editorRef = useRef(null);

    useEffect(() => {
        // Solo inicializar Quill si el contenedor existe y no hay un editor ya creado
        if (containerRef.current && !editorRef.current) {
            const toolbarOptions = [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'header': [1, 2, 3, false] }],
                ['clean']
            ];

            // Limpiar el contenedor antes de inicializar
            containerRef.current.innerHTML = '';

            // Crear el div para el editor
            const editorContainer = containerRef.current.appendChild(
                document.createElement('div')
            );

            // Inicializar Quill
            editorRef.current = new Quill(editorContainer, {
                modules: {
                    toolbar: toolbarOptions
                },
                theme: 'snow',
                readOnly: isDisabled
            });

            // Configurar el contenido inicial
            if (value) {
                editorRef.current.root.innerHTML = value;
            }

            // Manejar cambios en el editor
            editorRef.current.on('text-change', () => {
                if (onChange) {
                    onChange(editorRef.current.root.innerHTML);
                }
            });
        }

        // Actualizar el modo de solo lectura cuando cambia
        if (editorRef.current) {
            editorRef.current.enable(!isDisabled);
        }

        // Limpieza al desmontar
        return () => {
            if (editorRef.current) {
                editorRef.current.off('text-change'); // Limpia listener
                editorRef.current = null;

                // Limpieza completa del contenedor
                if (containerRef.current) {
                    containerRef.current.innerHTML = '';
                }
            }
        };
    }, [isDisabled]); // Dependencia isDisabled para reaccionar a cambios en el modo

    // Actualizar el editor cuando cambia el valor externamente
    useEffect(() => {
        if (editorRef.current && value !== undefined) {
            const currentContent = editorRef.current.root.innerHTML;
            if (value !== currentContent) {
                editorRef.current.root.innerHTML = value || '';
            }
        }
    }, [value]);

    return (
        <div className="quill-editor-container">
            <div className={error ? 'border border-danger rounded' : ''}>
                <div ref={containerRef}></div>
            </div>
            {error && <div className="text-danger mt-1">{error}</div>}
        </div>
    );
};

export default Editor;