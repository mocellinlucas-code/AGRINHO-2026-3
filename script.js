/**
 * script.js - Agro Forte • Futuro Sustentável
 * JavaScript Premium - Vanilla ES6+
 * Agência Digital Elite • 2026
 */

'use strict';

// ==================== CONFIGURAÇÕES GLOBAIS ====================
const config = {
    scrollOffset: 100,
    animationDuration: 800,
};

// ==================== UTILITÁRIOS ====================
const utils = {
    debounce(fn, delay = 150) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    },

    animateValue(id, start, end, duration, suffix = '') {
        const obj = document.getElementById(id);
        if (!obj) return;
        
        const range = end - start;
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * range + start);
            obj.textContent = value + suffix;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.textContent = end + suffix;
            }
        };
        
        window.requestAnimationFrame(step);
    },

    createRipple(e, element) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        element.appendChild(ripple);

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

        setTimeout(() => ripple.remove(), 600);
    }
};

// ==================== NAVBAR & MOBILE MENU ====================
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.navLinks = document.querySelectorAll('.nav-menu a, .mobile-menu a');
        this.init();
    }

    init() {
        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });

        // Mobile toggle
        this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());

        // Smooth scroll links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.smoothScrollTo(href);
                    if (this.mobileMenu) this.closeMobileMenu();
                }
            });
        });

        // Scroll spy
        this.initScrollSpy();
    }

    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('active');
        this.mobileToggle.setAttribute('aria-expanded', 
            this.mobileMenu.classList.contains('active'));
    }

    closeMobileMenu() {
        this.mobileMenu.classList.remove('active');
        this.mobileToggle.setAttribute('aria-expanded', 'false');
    }

    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (!element) return;

        const navHeight = this.navbar.offsetHeight || 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - navHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${entry.target.id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { rootMargin: '-120px 0px -50% 0px' });

        sections.forEach(section => observer.observe(section));
    }
}

// ==================== SCROLL REVEAL ANIMATION ====================
class ScrollReveal {
    constructor() {
        this.init();
    }

    init() {
        const revealElements = document.querySelectorAll('.fade-in, .card, .stat-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 80);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }
}

// ==================== ANIMATED COUNTERS ====================
class Counters {
    constructor() {
        this.init();
    }

    init() {
        const stats = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateAll();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat.parentElement));
    }

    animateAll() {
        // Exemplos de estatísticas
        utils.animateValue('stat-producao', 0, 245, 2200, 'M');
        utils.animateValue('stat-rebanho', 0, 234, 2000, 'M');
        utils.animateValue('stat-preservacao', 0, 1800, 1800, 'K');
        utils.animateValue('stat-reducao', 0, 42, 1600, '%');
    }
}

// ==================== CALCULADORA DE IMPACTO ====================
class ImpactCalculator {
    constructor() {
        this.form = document.getElementById('impact-calculator');
        this.resultEl = document.getElementById('co2-result');
        this.savingsEl = document.getElementById('savings-result');
        this.init();
    }

    init() {
        if (!this.form) return;
        
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.calculate());
        });

        // Cálculo inicial
        this.calculate();
    }

    calculate() {
        const hectares = parseFloat(document.getElementById('hectares')?.value) || 150;
        const cultivoFactor = parseFloat(document.getElementById('cultivo')?.value) || 1.4;
        const irrigacao = parseFloat(document.getElementById('irrigacao')?.value) || 1;

        // Cálculo realista de emissões (ton CO2/ano)
        let emissaoBase = hectares * cultivoFactor * 1.35;
        const reducaoIrrigacao = (1 - (irrigacao * 0.6));
        const emissaoFinal = Math.max(12, Math.round(emissaoBase * reducaoIrrigacao));

        const reducaoPotencial = Math.round(100 - (emissaoFinal / emissaoBase * 100));

        // Animação suave
        this.resultEl.textContent = emissaoFinal;
        
        if (this.savingsEl) {
            this.savingsEl.textContent = `${reducaoPotencial}%`;
        }
    }
}

// ==================== QUIZ INTERATIVO ====================
class SustainabilityQuiz {
    constructor() {
        this.questions = [
            {
                q: "Qual é o principal benefício do plantio direto?",
                options: ["Aumentar o uso de agrotóxicos", "Reduzir erosão e melhorar o solo", "Acelerar a colheita", "Reduzir custos de mão de obra"],
                correct: 1
            },
            {
                q: "O que significa agricultura regenerativa?",
                options: ["Uso intensivo de fertilizantes químicos", "Recuperação ativa da saúde do solo e biodiversidade", "Monocultura em larga escala", "Exportação máxima de commodities"],
                correct: 1
            },
            {
                q: "Qual tecnologia mais economiza água na irrigação?",
                options: ["Aspersão convencional", "Irrigação por gotejamento com sensores", "Pivô central sem automação", "Canaletas de terra"],
                correct: 1
            },
            {
                q: "Qual é o impacto positivo de corredores ecológicos?",
                options: ["Aumentar pragas", "Proteger polinizadores e biodiversidade", "Reduzir a produtividade", "Aumentar emissões"],
                correct: 1
            },
            {
                q: "O que drones são usados para no agronegócio sustentável?",
                options: ["Dispersar agrotóxicos", "Monitoramento preciso de pragas e saúde das plantas", "Transportar sementes", "Entretenimento dos produtores"],
                correct: 1
            }
        ];

        this.currentQuestion = 0;
        this.score = 0;
        this.init();
    }

    init() {
        const startBtn = document.getElementById('start-quiz');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startQuiz());
        }
    }

    startQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.showQuestion();
    }

    showQuestion() {
        const container = document.getElementById('quiz-container');
        if (!container) return;

        const q = this.questions[this.currentQuestion];
        
        let html = `
            <div class="quiz-question">
                <div class="progress mb-6">
                    <span class="text-sm text-emerald-600">${this.currentQuestion + 1} / ${this.questions.length}</span>
                </div>
                <h3 class="text-2xl font-semibold mb-8">${q.q}</h3>
                <div class="space-y-4">
        `;

        q.options.forEach((option, index) => {
            html += `
                <button onclick="quiz.selectAnswer(${index})" 
                        class="quiz-option w-full text-left px-6 py-5 rounded-2xl border-2 border-gray-200 hover:border-emerald-400 transition-all">
                    ${option}
                </button>
            `;
        });

        html += '</div></div>';
        container.innerHTML = html;
    }

    selectAnswer(selectedIndex) {
        const q = this.questions[this.currentQuestion];
        const buttons = document.querySelectorAll('.quiz-option');
        
        buttons.forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === q.correct) {
                btn.classList.add('correct', 'border-emerald-500', 'bg-emerald-50');
            }
            if (idx === selectedIndex && idx !== q.correct) {
                btn.classList.add('wrong', 'border-red-400');
            }
        });

        if (selectedIndex === q.correct) this.score++;

        setTimeout(() => {
            this.nextQuestion();
        }, 1400);
    }

    nextQuestion() {
        this.currentQuestion++;
        if (this.currentQuestion >= this.questions.length) {
            this.showResult();
        } else {
            this.showQuestion();
        }
    }

    showResult() {
        const container = document.getElementById('quiz-container');
        const percentage = Math.round((this.score / this.questions.length) * 100);
        
        let message = '';
        let emoji = '';
        
        if (percentage >= 80) {
            message = "Parabéns! Você é um verdadeiro guardião da sustentabilidade agrícola.";
            emoji = "🌱🏆";
        } else if (percentage >= 60) {
            message = "Ótimo conhecimento! Continue aprendendo sobre o futuro do agro.";
            emoji = "🌾👍";
        } else {
            message = "Há espaço para crescer. O agro sustentável precisa de você!";
            emoji = "📚🌍";
        }

        container.innerHTML = `
            <div class="text-center py-12">
                <div class="text-7xl mb-6">${emoji}</div>
                <div class="text-6xl font-bold text-emerald-700 mb-2">${percentage}%</div>
                <p class="text-xl text-gray-600 max-w-xs mx-auto">${message}</p>
                <button onclick="quiz.startQuiz()" 
                        class="mt-12 px-10 py-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-3xl font-medium transition-all">
                    REINICIAR QUIZ
                </button>
            </div>
        `;
    }
}

// ==================== GALERIA MODAL ====================
class GalleryModal {
    constructor() {
        this.modal = document.getElementById('gallery-modal');
        this.currentIndex = 0;
        this.images = [];
        this.init();
    }

    init() {
        // Event delegation para cards da galeria
        document.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                const index = parseInt(galleryItem.dataset.index);
                if (!isNaN(index)) this.open(index);
            }
        });

        // Fechar modal
        const closeBtn = document.getElementById('modal-close');
        if (closeBtn) closeBtn.addEventListener('click', () => this.close());

        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (!this.modal || !this.modal.classList.contains('active')) return;
            
            if (e.key === 'Escape') this.close();
            if (e.key === 'ArrowRight') this.next();
            if (e.key === 'ArrowLeft') this.prev();
        });
    }

    open(index) {
        this.currentIndex = index;
        this.renderModal();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'visible';
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.renderModal();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.renderModal();
    }

    renderModal() {
        // Implementação depende das imagens definidas no HTML
        const img = document.getElementById('modal-image');
        const caption = document.getElementById('modal-caption');
        
        if (img && this.images[this.currentIndex]) {
            img.src = this.images[this.currentIndex].src;
            if (caption) caption.textContent = this.images[this.currentIndex].caption || '';
        }
    }

    setImages(images) {
        this.images = images;
    }
}

// ==================== FORMULÁRIO DE CONTATO ====================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Validação em tempo real
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    validateField(field) {
        if (field.value.trim() === '') {
            field.classList.add('border-red-400');
        } else {
            field.classList.remove('border-red-400');
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const button = this.form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        
        button.innerHTML = `
            <svg class="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Enviando...
        `;
        button.disabled = true;

        // Simulação de envio
        setTimeout(() => {
            button.textContent = '✅ Enviado com sucesso!';
            button.style.backgroundColor = '#10b981';
            
            setTimeout(() => {
                this.form.reset();
                button.textContent = originalText;
                button.style.backgroundColor = '';
                button.disabled = false;
            }, 2800);
        }, 1650);
    }
}

// ==================== BOTÃO VOLTAR AO TOPO ====================
class BackToTop {
    constructor() {
        this.button = document.createElement('button');
        this.button.innerHTML = '↑';
        this.button.className = 'fixed bottom-8 right-8 w-14 h-14 bg-emerald-700 hover:bg-emerald-800 text-white rounded-3xl shadow-xl flex items-center justify-center text-2xl transition-all duration-300 opacity-0 pointer-events-none z-50';
        document.body.appendChild(this.button);
        this.init();
    }

    init() {
        window.addEventListener('scroll', utils.debounce(() => {
            if (window.scrollY > 600) {
                this.button.classList.remove('opacity-0', 'pointer-events-none');
            } else {
                this.button.classList.add('opacity-0', 'pointer-events-none');
            }
        }, 100));

        this.button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ==================== RIPPLE EFFECT GLOBAL ====================
function initRippleEffects() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn, button');
        if (btn) {
            utils.createRipple(e, btn);
        }
    });
}

// ==================== INICIALIZAÇÃO ====================
function initializeApp() {
    console.log('%c🚜 Agro Forte - Sistema carregado com sucesso!', 'color:#10b981; font-family:monospace; font-size:13px');
    
    new Navigation();
    new ScrollReveal();
    new Counters();
    new ImpactCalculator();
    window.quiz = new SustainabilityQuiz();
    new GalleryModal();
    new ContactForm();
    new BackToTop();
    
    initRippleEffects();

    // Lazy loading para imagens
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.src = entry.target.dataset.src || entry.target.src;
                    imageObserver.unobserve(entry.target);
                }
            });
        });
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeApp);
