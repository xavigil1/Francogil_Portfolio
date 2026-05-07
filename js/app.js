document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. INICIALIZAR AOS (Animaciones al hacer Scroll) ---
    if (typeof AOS !== 'undefined') {
        AOS.init({ 
            once: true,
            duration: 1000,
            offset: 100
        });
    }

    // --- 2. LÓGICA DEL NAVBAR DINÁMICO ---
    const navbar = document.querySelector('.navbar');
    
    const handleScroll = () => {
        if (!navbar) return;
        // Usamos una clase en lugar de modificar .style directamente para mayor limpieza
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);

    // --- 3. MENÚ MÓVIL (Interacción y Autocierre) ---
    const menuToggle = document.querySelector('#mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('is-active'); // Para animar la hamburguesa si añades CSS
        });

        // Cerrar el menú automáticamente al hacer clic en un enlace (UX móvil)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // --- 4. ANIMACIÓN DE VELOCÍMETROS (Con Intersection Observer) ---
    const animateGauges = () => {
        const meters = document.querySelectorAll('.gauge .meter');
        meters.forEach(m => {
            const parent = m.closest('.gauge-container');
            let pct = 80; // Valor por defecto
            
            if (parent) {
                const el = parent.querySelector('.percent');
                if (el) {
                    const parsed = parseInt(el.textContent.replace('%',''));
                    if (!isNaN(parsed)) pct = parsed;
                }
            }
            
            // r=45 en el SVG, circunferencia = 2 * PI * r
            const circumference = 2 * Math.PI * 45; 
            const offset = circumference * (1 - pct / 100);
            
            m.style.strokeDasharray = circumference;
            m.style.strokeDashoffset = offset;
        });
    };

    // Usar Observer para disparar la animación solo cuando la sección sea visible
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateGauges();
                    observer.unobserve(entry.target); // Animación solo una vez
                }
            });
        }, { threshold: 0.3 });

        observer.observe(skillsSection);
    }

    // --- 5. FILTROS DE PROYECTOS (Mejorado con clases) ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsWrap = document.querySelector('.projects-wrap');
    const projectsTrack = document.querySelector('.projects-track');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Actualizar estado del botón
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                // Animación simple de desvanecimiento al filtrar
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });

            // Reiniciar scroll del carrusel al filtrar
            if (projectsTrack) projectsTrack.style.transform = 'translateX(0)';
            if (projectsWrap) projectsWrap.scrollLeft = 0;
        });
    });

    // --- 6. CONTROLES DEL CARRUSEL ---
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    
    if (projectsWrap && prevBtn && nextBtn) {
        const getScrollAmount = () => Math.round(projectsWrap.clientWidth * 0.8);

        prevBtn.addEventListener('click', () => {
            projectsWrap.scrollBy({ 
                left: -getScrollAmount(), 
                behavior: 'smooth' 
            });
        });

        nextBtn.addEventListener('click', () => {
            projectsWrap.scrollBy({ 
                left: getScrollAmount(), 
                behavior: 'smooth' 
            });
        });
    }

    // --- 6. MANEJO DEL FORMULARIO DE CONTACTO ---
    const contactForm = document.querySelector('.contact-form');
    const submitBtn = contactForm?.querySelector('button[type="submit"]');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            // Mostrar indicador de carga
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            // Crear notificación de éxito
            const createNotification = () => {
                const notification = document.createElement('div');
                notification.className = 'success-notification';
                notification.innerHTML = `
                    <div class="notification-content">
                        <span class="notification-icon">✅</span>
                        <div class="notification-text">
                            <h4>¡Mensaje enviado exitosamente!</h4>
                            <p>Pronto me pondré en contacto con usted al revisar la propuesta.</p>
                        </div>
                        <button class="notification-close" aria-label="Cerrar notificación">×</button>
                    </div>
                `;

                // Agregar al DOM
                document.body.appendChild(notification);

                // Animación de entrada
                setTimeout(() => notification.classList.add('show'), 100);

                // Auto-cerrar después de 5 segundos
                const autoClose = setTimeout(() => {
                    closeNotification(notification);
                }, 5000);

                // Evento para cerrar manualmente
                const closeBtn = notification.querySelector('.notification-close');
                closeBtn.addEventListener('click', () => {
                    clearTimeout(autoClose);
                    closeNotification(notification);
                });

                // Función para cerrar notificación
                const closeNotification = (notif) => {
                    notif.classList.remove('show');
                    setTimeout(() => {
                        if (notif.parentNode) {
                            notif.parentNode.removeChild(notif);
                        }
                    }, 300);
                };
            };

            // Simular envío exitoso (FormSubmit manejará el envío real)
            // En un escenario real, aquí irías a verificar el envío
            setTimeout(() => {
                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensaje';

                // Limpiar formulario
                contactForm.reset();

                // Mostrar notificación
                createNotification();
            }, 1000); // Simular tiempo de envío
        });
    }

});