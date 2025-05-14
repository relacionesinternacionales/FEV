import { useState, useEffect } from 'react';



export const useToast = () => {
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {

        const storedMessage = localStorage.getItem('toastMessage');

        if (storedMessage) {
            const messageType = localStorage.getItem('toastType') || 'success';
            setToast({ show: true, message: storedMessage, type: messageType });
            localStorage.removeItem('toastMessage');
            localStorage.removeItem('toastType');
        }
    }, []);

    // Función para mostrar toast
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    // Función para guardar un mensaje que se mostrará en la siguiente página
    const setToastForNextPage = (message, type = 'success') => {
        localStorage.setItem('toastMessage', message);
        localStorage.setItem('toastType', type);
    };

    // Función para cerrar el toast
    const closeToast = () => {
        setToast({ ...toast, show: false });
    };

    return {
        toast,
        showToast,
        closeToast,
        setToastForNextPage
    };
};