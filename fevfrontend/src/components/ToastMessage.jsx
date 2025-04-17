// components/ToastMessage.jsx
import {useEffect, useState} from "react";

const ToastMessage = ({show, message, type = "success", onClose}) => {
    const [visible, setVisible] = useState(show);

    useEffect(() => {
        setVisible(show);
        if (show) {
            const timer = setTimeout(() => {
                setVisible(false);
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show]);

    if (!visible) return null;

    return (
        <>
            <div
                className={`toast align-items-center text-bg-${type} border-0 position-fixed top-0 end-0 m-3 show`}
                role="alert"
            >
                <div className="d-flex">
                    <div className="toast-body">{message}</div>
                    <button
                        type="button"
                        className="btn-close btn-close-white me-2 m-auto"
                        onClick={() => {
                            setVisible(false);
                            onClose();
                        }}
                    ></button>
                </div>
            </div>
        </>
    );
};

export default ToastMessage;