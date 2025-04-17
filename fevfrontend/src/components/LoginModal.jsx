// src/components/LoginModal.jsx
import React, {useState} from 'react';
import {Modal, Form, Alert} from 'react-bootstrap';
import {useAuth} from '../context/AuthContext';
import {useNavigate} from "react-router-dom";

const LoginModal = ({show, handleClose}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState('');
    const navigate = useNavigate();

    const {login, error: authError} = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        setValidated(true);
        setLoading(true);
        setLocalError('');

        try {
            await  login(username, password);
            resetForm();
            handleClose();
            navigate('/empresaHome');
        } catch (error) {
            console.log(error);
            if (!authError) {
                setLocalError('Error al procesar la solicitud');
            }
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setValidated(false);
        setLocalError('');
    };

    const handleModalClose = () => {
        resetForm();
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleModalClose} centered>
            <Modal.Header closeButton>
                <div className={"d-flex flex-column flex-fill justify-content-center align-items-center"}>
                    <h1>Empresas</h1>
                    <h2>Inicio de sesión</h2>
                </div>
            </Modal.Header>

            <Modal.Body>
                {(localError || authError) && (
                    <Alert variant="danger">{localError || authError}</Alert>
                )}

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="loginUsername">
                        <Form.Label>Correo electronico</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="correo@example.com"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor ingrese su correo electronico.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="loginPassword">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor ingrese su contraseña.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <div className={"d-flex justify-content-center"}>
                        <button
                            className="btn btn-primary btn-lg"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default LoginModal;