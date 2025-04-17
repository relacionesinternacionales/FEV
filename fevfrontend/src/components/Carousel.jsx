import {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';

const Carousel = ({items, onButtonClick}) => {
    const carouselRef = useRef(null);

    useEffect(() => {
        // Obtener el elemento del carrusel
        const carouselElement = document.getElementById('bootstrapCarousel');
        if (!carouselElement) return;

        // Inicializar el carrusel con configuración Bootstrap
        const carouselInstance = new bootstrap.Carousel(carouselElement, {
            interval: false,
            wrap: true,
            keyboard: true,
        });

        carouselRef.current = carouselInstance;

        // Función para mostrar el contenido activo
        const handleSlideChange = (event) => {
            const slideIndex = parseInt(event.relatedTarget.getAttribute('data-slide-index'));

            // Ocultar todos los contenidos
            document.querySelectorAll('.content-slide').forEach((el) => {
                el.style.display = 'none';
            });

            // Mostrar el contenido correspondiente al slide activo
            const activeContent = document.getElementById(`content-${slideIndex}`);
            if (activeContent) {
                activeContent.style.display = 'block';
            }
        };

        // Escuchar el evento slide.bs.carousel
        carouselElement.addEventListener('slide.bs.carousel', handleSlideChange);

        // Inicializar mostrando el primer contenido
        document.querySelectorAll('.content-slide').forEach((el, idx) => {
            el.style.display = idx === 0 ? 'block' : 'none';
        });

        // Limpieza al desmontar
        return () => {
            if (carouselRef.current) {
                carouselRef.current.dispose();
            }
            carouselElement.removeEventListener('slide.bs.carousel', handleSlideChange);
        };
    }, [items.length]);

    // Manejador de clic para los botones
    const handleButtonClick = (e, url, text) => {
        e.preventDefault();
        if (onButtonClick) {
            onButtonClick(url, text);
        }
    };

    return (
        <div className="carousel-wrapper">

            {/* Contenedor principal con altura fija */}
            <div className="carousel-media-container">

                {/* Boton Prev */}
                <div>
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#bootstrapCarousel"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                </div>

                {/* Imagenes Centrales */}
                <div id="bootstrapCarousel" className="carousel slide">
                    {/* Sección de imágenes */}
                    {items.map((item, index) => (
                        <div
                            key={`slide-${index}`}
                            className={`carousel-item ${index === 0 ? 'active' : ''}`}
                            data-slide-index={index}
                        >
                            <div className="d-flex justify-content-center align-items-center flex-fill">
                                <img
                                    src={item.image}
                                    className="img-fluid"
                                    alt={item.alt || `Slide ${index + 1}`}
                                    style={{
                                        maxHeight: '450px',
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Boton Next */}
                <div>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#bootstrapCarousel"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            {/* Contenedor de texto separado */}
            <div className="content-section">
                {items.map((item, index) => (
                    <div
                        key={`content-${index}`}
                        id={`content-${index}`}
                        className="content-slide"
                    >
                        <h2 className="display-6 fw-bold">{item.title}</h2>
                        <p className="lead">{item.description}</p>

                        {/* Botones */}
                        <div>
                            <a href="#"
                               className="btn btn-primary btn-lg fw-bold mx-2"
                               role="button"
                               onClick={(e) => handleButtonClick(e, item.linkUrl1, item.linkText1)}
                            >
                                {item.linkText1}
                            </a>
                            {
                                item.linkUrl2 ? (

                                    <a href="#"
                                       className="btn btn-warning btn-lg fw-bold mx-2"
                                       role="button"
                                       onClick={(e) => handleButtonClick(e, item.linkUrl2, item.linkText2)}
                                    >
                                        {item.linkText2}
                                    </a>) : null
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

Carousel.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            image: PropTypes.string.isRequired,
            alt: PropTypes.string,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            linkText1: PropTypes.string.isRequired,
            linkUrl1: PropTypes.string.isRequired,
            linkText2: PropTypes.string,
            linkUrl2: PropTypes.string
        })
    ).isRequired,
    onButtonClick: PropTypes.func
};

export default Carousel;