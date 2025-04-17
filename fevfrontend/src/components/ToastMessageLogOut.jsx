import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ToastMessageLogOut = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const expired = localStorage.getItem('sessionExpired');
        if (expired) {
            setShow(true);
            localStorage.removeItem('sessionExpired');
            setTimeout(() => setShow(false), 4000);
        }
    }, []);

    return (
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
            <div className={`toast align-items-center text-bg-danger ${show ? 'show' : 'hide'}`} role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                    <div className="toast-body">
                        Sesión expirada. Por favor, inicia sesión nuevamente.
                    </div>
                    <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShow(false)}></button>
                </div>
            </div>
        </div>
    );
};

export default ToastMessageLogOut;
