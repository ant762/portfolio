AOS.init({ duration: 1000, once: true });

gsap.from(".hero-content h1", { opacity: 0, y: 50, duration: 2.5, ease: "power4.out" });
gsap.from(".hero-content p", { opacity: 0, x: -50, duration: 2, delay: 0.5 });

VANTA.NET({
  el: "#vanta-canvas",
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  scale: 1.00,
  scaleMobile: 1.00,
  color: 0x444444, 
  backgroundColor: 0x0, // 0x0 + backgroundAlpha torna o fundo transparente
  backgroundAlpha: 0.1, // Isso permite ver a imagem atrás
  points: 12.00,
  maxDistance: 20.00,
  spacing: 16.00
});

document.addEventListener('mousemove', (e) => {
    const bg = document.querySelector('.background-overlay');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    bg.style.transform = `translate(-${x * 20}px, -${y * 20}px) scale(1.1)`;
});

window.addEventListener('scroll', () => {
    const nav = document.querySelector('#navbar');
    if (window.scrollY > 20) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});


document.querySelectorAll('#navbar a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Compensação do header
                behavior: 'smooth'
            });
        }
    });
});

const observerOptions = {
    threshold: 0.15 // O elemento aparece quando 15% dele está na tela
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active'); 
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-reveal').forEach(section => {
    observer.observe(section);
});

const modal = document.getElementById('contact-modal');
const openBtn = document.getElementById('contact-trigger');
const closeBtn = document.querySelector('.close-modal');

openBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('open');
    }, 10);
    document.body.style.overflow = 'hidden';
});

const closeModal = () => {
    modal.classList.remove('open');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 500);
    document.body.style.overflow = 'auto';
};

closeBtn.addEventListener('click', closeModal);

function closeDetail() {
    const modal = document.getElementById('detail-modal');
    modal.classList.remove('open');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 500);
    document.body.style.overflow = 'auto';
}

function openDetail(title, desc, img) {
    const modal = document.getElementById('detail-modal');
    document.getElementById('detail-title').innerText = title;
    document.getElementById('detail-desc').innerText = desc;
    document.getElementById('detail-img').src = img;

    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('open');
    }, 10);
    document.body.style.overflow = 'hidden';
}

const contactTrigger = document.getElementById('contact-trigger');
if(contactTrigger) {
    contactTrigger.addEventListener('click', () => {
        const modal = document.getElementById('contact-modal');
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('open');
        }, 10);
        document.body.style.overflow = 'hidden';
    });
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    
    modals.forEach(modal => {
        if (modal.classList.contains('open')) {
            modal.classList.remove('open');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 500); // Tempo da transição CSS
        }
    });
    
    document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        closeAllModals();
    }
}