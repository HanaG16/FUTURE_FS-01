// ===== HIDE LOADING SCREEN IMMEDIATELY =====
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader')
    if (loader) {
        loader.style.display = 'none'
    }
})

// ===== LOAD PROJECTS FROM DATABASE =====
async function loadProjects() {
    try {
        const response = await fetch('https://futurefs-01-production.up.railway.app/api/projects')
        if (!response.ok) return
        const projects = await response.json()
        if (!Array.isArray(projects)) return

        const container = document.getElementById('projects-container')
        container.innerHTML = ''

        projects.forEach(project => {
            const card = document.createElement('div')
            card.classList.add('project-card')
            card.style.cursor = 'pointer'

            const isVideo = project.image && (
                project.image.endsWith('.mp4') ||
                project.image.endsWith('.mov') ||
                project.image.endsWith('.webm') ||
                project.image.includes('drive.google.com') ||
project.image.includes('streamable.com')
            )

            const mediaHTML = project.image
                ? isVideo
                    ? `<iframe src="${project.image}"
                        style="width:100%;height:160px;border-radius:8px;margin-bottom:14px;border:none;"
                        allowfullscreen></iframe>`
                    : `<img src="${project.image}" alt="${project.title}"
                        style="width:100%;height:160px;object-fit:cover;border-radius:8px;margin-bottom:14px;"
                        onerror="this.style.display='none'">`
                : `<div style="width:100%;height:160px;border-radius:8px;margin-bottom:14px;
                    background:linear-gradient(135deg,#1a0a00,#0f0f0f);
                    display:flex;align-items:center;justify-content:center;">
                    <i class="fa-solid fa-diagram-project" style="font-size:40px;color:#ff6a00;opacity:0.6;"></i>
                   </div>`

            card.innerHTML = `
                ${mediaHTML}
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                    <i class="fa-solid fa-star" style="font-size:12px;"></i>
                    <h3 style="font-size:17px;margin:0;">${project.title}</h3>
                </div>
                <p style="font-size:13px;color:#888;margin-bottom:12px;line-height:1.6;">
                    ${project.description.substring(0, 85)}...
                </p>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:11px;color:#ff6a00;">
                        <i class="fa-solid fa-wrench"></i>
                        ${project.tech_stack || 'N/A'}
                    </span>
                    <span style="font-size:12px;color:#ff6a00;opacity:0.8;">
                        Read more →
                    </span>
                </div>
            `
            card.addEventListener('click', () => openProjectModal(project))
            container.appendChild(card)
        })

        animateCards()

    } catch (error) {
        console.log('Server not available:', error)
    }
}

// ===== PROJECT MODAL =====
const projectModal = document.getElementById('project-modal')
const modalClose = document.getElementById('modal-close')
const modalTitle = document.getElementById('modal-title')
const modalTech = document.getElementById('modal-tech')
const modalDesc = document.getElementById('modal-desc')
const modalLink = document.getElementById('modal-link')

function openProjectModal(project) {
    modalTitle.textContent = project.title
    modalTech.textContent = project.tech_stack || ''
    modalDesc.textContent = project.description
    modalLink.href = project.link || '#'

    const mediaContainer = document.getElementById('modal-media')

    if (project.image) {
        const isVideo = project.image.endsWith('.mp4') ||
                        project.image.endsWith('.mov') ||
                        project.image.endsWith('.webm') ||
                        project.image.includes('drive.google.com')

        if (isVideo) {
            mediaContainer.innerHTML = `
                <iframe src="${project.image}"
                    width="100%" height="280"
                    frameborder="0" allowfullscreen
                    style="display:block; border-radius:8px;">
                </iframe>`
        } else {
            mediaContainer.innerHTML = `
                <img src="${project.image}" alt="${project.title}"
                    id="modal-project-img"
                    style="width:100%;height:280px;object-fit:cover;display:block;cursor:zoom-in;">`

            setTimeout(() => {
                const modalProjectImg = document.getElementById('modal-project-img')
                if (modalProjectImg) {
                    modalProjectImg.addEventListener('click', () => {
                        if (modalProjectImg.requestFullscreen) {
                            modalProjectImg.requestFullscreen()
                        } else if (modalProjectImg.webkitRequestFullscreen) {
                            modalProjectImg.webkitRequestFullscreen()
                        }
                    })
                }
            }, 100)
        }
    } else {
        mediaContainer.innerHTML = `
            <div style="width:100%;height:200px;
                background:linear-gradient(135deg,#1a0a00,#0f0f0f);
                display:flex;align-items:center;justify-content:center;">
                <i class="fa-solid fa-diagram-project"
                    style="font-size:50px;color:#ff6a00;opacity:0.5;"></i>
            </div>`
    }

    projectModal.classList.add('active')
    document.body.style.overflow = 'hidden'
}

function closeProjectModal() {
    projectModal.classList.remove('active')
    document.body.style.overflow = 'auto'
}

modalClose.addEventListener('click', closeProjectModal)
projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal()
})

// ===== CONTACT FORM =====
const form = document.getElementById('contact-form')

form.addEventListener('submit', async function(e) {
    e.preventDefault()
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const message = document.getElementById('message').value
    const formMessage = document.getElementById('form-message')

    try {
        const response = await fetch('https://futurefs-01-production.up.railway.app/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        })
        const result = await response.json()
        if (result.success) {
            formMessage.textContent = '✅ Message sent successfully!'
            form.reset()
        } else {
            formMessage.textContent = '❌ Something went wrong. Try again.'
        }
    } catch (error) {
        formMessage.textContent = '❌ Could not connect to server.'
    }
})

// ===== TYPING ANIMATION =====
window.addEventListener('load', () => {
    setTimeout(() => {
        const typingText = document.querySelector('.highlight')
        if (typingText) {
            const originalName = typingText.textContent
            typingText.textContent = ''
            let i = 0
            function typeWriter() {
                if (i < originalName.length) {
                    typingText.textContent += originalName.charAt(i)
                    i++
                    setTimeout(typeWriter, 120)
                }
            }
            typeWriter()
        }
    }, 300)
})

// ===== RUN ON PAGE LOAD =====
loadProjects()

// ===== FADE IN SECTIONS ON SCROLL =====
const sections = document.querySelectorAll('section')
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible')
        }
    })
}, { threshold: 0.1 })
sections.forEach(section => observer.observe(section))

// ===== PROJECT CARDS STAGGER ANIMATION =====
function animateCards() {
    const cards = document.querySelectorAll('.project-card')
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`
        card.classList.add('card-animate')
    })
}

// ===== ACTIVE NAV LINK ON SCROLL =====
const navLinks = document.querySelectorAll('nav ul li a')
window.addEventListener('scroll', () => {
    let current = ''
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id')
        }
    })
    navLinks.forEach(link => {
        link.classList.remove('active')
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active')
        }
    })
})

// ===== FLASHCARD SLIDESHOW =====
const fcTrack = document.getElementById('fc-track')
const fcCards = document.querySelectorAll('.flashcard')
const fcDotsContainer = document.getElementById('fc-dots')
const fcPrev = document.getElementById('fc-prev')
const fcNext = document.getElementById('fc-next')
const lightbox = document.getElementById('lightbox')
const lightboxImg = document.getElementById('lightbox-img')
const lightboxCaption = document.getElementById('lightbox-caption')
const lightboxClose = document.getElementById('lightbox-close')

const visibleCount = 4
const cardWidth = 200 + 16
let fcCurrent = 0
const fcTotal = fcCards.length
const maxIndex = fcTotal - visibleCount

for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement('div')
    dot.classList.add('fc-dot')
    if (i === 0) dot.classList.add('active')
    dot.addEventListener('click', () => goTo(i))
    fcDotsContainer.appendChild(dot)
}

function updateDots() {
    document.querySelectorAll('.fc-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === fcCurrent)
    })
}

function goTo(index) {
    fcCurrent = Math.max(0, Math.min(index, maxIndex))
    fcTrack.style.transform = `translateX(-${fcCurrent * cardWidth}px)`
    updateDots()
}

fcPrev.addEventListener('click', () => goTo(fcCurrent - 1))
fcNext.addEventListener('click', () => goTo(fcCurrent + 1))

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal()
        closeLightbox()
        return
    }
    if (lightbox && lightbox.classList.contains('active')) return
    if (e.key === 'ArrowRight') goTo(fcCurrent + 1)
    if (e.key === 'ArrowLeft') goTo(fcCurrent - 1)
})

function openLightbox(img, caption) {
    lightboxImg.src = img.src
    lightboxCaption.textContent = caption
    lightbox.classList.add('active')
    document.body.style.overflow = 'hidden'
}

function closeLightbox() {
    lightbox.classList.remove('active')
    document.body.style.overflow = 'auto'
}

fcCards.forEach(card => {
    card.addEventListener('click', () => {
        const img = card.querySelector('img')
        const caption = card.querySelector('.flashcard-caption').textContent.trim()
        openLightbox(img, caption)
    })
})

lightboxClose.addEventListener('click', closeLightbox)
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox()
})
