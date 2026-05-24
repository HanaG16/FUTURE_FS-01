// ======================================================
// GLOBAL ERROR HANDLER (MOBILE SAFE)
// ======================================================

window.onerror = function(message, source, lineno, colno, error) {
    console.log('ERROR:', {
        message,
        source,
        lineno,
        colno,
        error
    })
}

// ======================================================
// HIDE LOADER
// ======================================================

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader')

    if (loader) {
        loader.style.display = 'none'
    }
})

// ======================================================
// MODAL ELEMENTS
// ======================================================

const projectModal = document.getElementById('project-modal')
const modalClose = document.getElementById('modal-close')
const modalTitle = document.getElementById('modal-title')
const modalTech = document.getElementById('modal-tech')
const modalDesc = document.getElementById('modal-desc')
const modalLink = document.getElementById('modal-link')

// ======================================================
// LOAD PROJECTS
// ======================================================

async function loadProjects() {

    const container = document.getElementById('projects-container')

    if (!container) return

    container.innerHTML = `
        <p style="text-align:center;padding:20px;">
            Loading projects...
        </p>
    `

    try {

        const response = await fetch(
            'https://futurefs-01-production.up.railway.app/api/projects'
        )

        if (!response.ok) {
            container.innerHTML = `
                <p style="text-align:center;padding:20px;">
                    Failed to load projects.
                </p>
            `
            return
        }

        const projects = await response.json()

        if (!Array.isArray(projects)) {
            container.innerHTML = `
                <p style="text-align:center;padding:20px;">
                    No projects found.
                </p>
            `
            return
        }

        container.innerHTML = ''

        projects.forEach(project => {

            const card = document.createElement('div')

            card.classList.add('project-card')
            card.style.cursor = 'pointer'

            const imageUrl = (project.image || '').toLowerCase()

            const isVideo =
                imageUrl.endsWith('.mp4') ||
                imageUrl.endsWith('.mov') ||
                imageUrl.endsWith('.webm') ||
                imageUrl.includes('drive.google.com') ||
                imageUrl.includes('streamable.com')

            let mediaHTML = ''

            if (project.image) {

                if (isVideo) {

                    let embedUrl = project.image

                    // Convert Google Drive links to preview links
                    if (embedUrl.includes('drive.google.com')) {

                        const match = embedUrl.match(/\/d\/(.*?)\//)

                        if (match && match[1]) {
                            embedUrl =
                                `https://drive.google.com/file/d/${match[1]}/preview`
                        }
                    }

                    mediaHTML = `
                        <iframe
                            src="${embedUrl}"
                            style="
                                width:100%;
                                height:160px;
                                border:none;
                                border-radius:8px;
                                margin-bottom:14px;
                            "
                            allowfullscreen
                            loading="lazy">
                        </iframe>
                    `

                } else {

                    mediaHTML = `
                        <img
                            src="${project.image}"
                            alt="${project.title || 'Project Image'}"
                            loading="lazy"
                            style="
                                width:100%;
                                height:160px;
                                object-fit:cover;
                                border-radius:8px;
                                margin-bottom:14px;
                            "
                            onerror="this.style.display='none'"
                        >
                    `
                }

            } else {

                mediaHTML = `
                    <div
                        style="
                            width:100%;
                            height:160px;
                            border-radius:8px;
                            margin-bottom:14px;
                            background:linear-gradient(135deg,#1a0a00,#0f0f0f);
                            display:flex;
                            align-items:center;
                            justify-content:center;
                        "
                    >
                        <i
                            class="fa-solid fa-diagram-project"
                            style="
                                font-size:40px;
                                color:#ff6a00;
                                opacity:0.6;
                            "
                        ></i>
                    </div>
                `
            }

            card.innerHTML = `
                ${mediaHTML}

                <div
                    style="
                        display:flex;
                        align-items:center;
                        gap:8px;
                        margin-bottom:8px;
                    "
                >
                    <i
                        class="fa-solid fa-star"
                        style="font-size:12px;"
                    ></i>

                    <h3 style="font-size:17px;margin:0;">
                        ${project.title || 'Untitled Project'}
                    </h3>
                </div>

                <p
                    style="
                        font-size:13px;
                        color:#888;
                        margin-bottom:12px;
                        line-height:1.6;
                    "
                >
                    ${(project.description || '').substring(0, 85)}...
                </p>

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                    "
                >
                    <span style="font-size:11px;color:#ff6a00;">
                        <i class="fa-solid fa-wrench"></i>
                        ${project.tech_stack || 'N/A'}
                    </span>

                    <span
                        style="
                            font-size:12px;
                            color:#ff6a00;
                            opacity:0.8;
                        "
                    >
                        Read more →
                    </span>
                </div>
            `

            card.addEventListener('click', () => {
                openProjectModal(project)
            })

            container.appendChild(card)
        })

        animateCards()

    } catch (error) {

        console.log(error)

        container.innerHTML = `
            <p style="text-align:center;padding:20px;">
                Could not connect to server.
            </p>
        `
    }
}

// ======================================================
// OPEN MODAL
// ======================================================

function openProjectModal(project) {

    if (!projectModal) return

    if (modalTitle) {
        modalTitle.textContent = project.title || 'Untitled'
    }

    if (modalTech) {
        modalTech.textContent = project.tech_stack || ''
    }

    if (modalDesc) {
        modalDesc.textContent = project.description || ''
    }

    if (modalLink) {
        modalLink.href = project.link || '#'
    }

    const mediaContainer = document.getElementById('modal-media')

    if (!mediaContainer) return

    const imageUrl = (project.image || '').toLowerCase()

    const isVideo =
        imageUrl.endsWith('.mp4') ||
        imageUrl.endsWith('.mov') ||
        imageUrl.endsWith('.webm') ||
        imageUrl.includes('drive.google.com') ||
        imageUrl.includes('streamable.com')

    if (project.image) {

        if (isVideo) {

            let embedUrl = project.image

            if (embedUrl.includes('drive.google.com')) {

                const match = embedUrl.match(/\/d\/(.*?)\//)

                if (match && match[1]) {
                    embedUrl =
                        `https://drive.google.com/file/d/${match[1]}/preview`
                }
            }

            mediaContainer.innerHTML = `
                <iframe
                    src="${embedUrl}"
                    style="
                        width:100%;
                        height:280px;
                        border:none;
                        border-radius:8px;
                    "
                    allowfullscreen>
                </iframe>
            `

        } else {

            mediaContainer.innerHTML = `
                <img
                    src="${project.image}"
                    alt="${project.title || 'Project Image'}"
                    id="modal-project-img"
                    style="
                        width:100%;
                        height:280px;
                        object-fit:cover;
                        border-radius:8px;
                        cursor:pointer;
                    "
                >
            `

            setTimeout(() => {

                const modalProjectImg =
                    document.getElementById('modal-project-img')

                if (!modalProjectImg) return

                modalProjectImg.addEventListener('click', () => {

                    if (
                        document.fullscreenEnabled &&
                        modalProjectImg.requestFullscreen
                    ) {
                        modalProjectImg.requestFullscreen()
                    }
                })

            }, 100)
        }

    } else {

        mediaContainer.innerHTML = `
            <div
                style="
                    width:100%;
                    height:200px;
                    background:linear-gradient(135deg,#1a0a00,#0f0f0f);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    border-radius:8px;
                "
            >
                <i
                    class="fa-solid fa-diagram-project"
                    style="
                        font-size:50px;
                        color:#ff6a00;
                        opacity:0.5;
                    "
                ></i>
            </div>
        `
    }

    projectModal.classList.add('active')
    document.body.style.overflow = 'hidden'
}

// ======================================================
// CLOSE MODAL
// ======================================================

function closeProjectModal() {

    if (!projectModal) return

    projectModal.classList.remove('active')
    document.body.style.overflow = 'auto'
}

if (modalClose) {
    modalClose.addEventListener('click', closeProjectModal)
}

if (projectModal) {

    projectModal.addEventListener('click', (e) => {

        if (e.target === projectModal) {
            closeProjectModal()
        }
    })
}

// ======================================================
// CONTACT FORM
// ======================================================

const form = document.getElementById('contact-form')

if (form) {

    form.addEventListener('submit', async function(e) {

        e.preventDefault()

        const name =
            document.getElementById('name')?.value || ''

        const email =
            document.getElementById('email')?.value || ''

        const message =
            document.getElementById('message')?.value || ''

        const formMessage =
            document.getElementById('form-message')

        try {

            const response = await fetch(
                'https://futurefs-01-production.up.railway.app/api/contact',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        message
                    })
                }
            )

            const result = await response.json()

            if (result.success) {

                if (formMessage) {
                    formMessage.textContent =
                        '✅ Message sent successfully!'
                }

                form.reset()

            } else {

                if (formMessage) {
                    formMessage.textContent =
                        '❌ Something went wrong.'
                }
            }

        } catch (error) {

            if (formMessage) {
                formMessage.textContent =
                    '❌ Could not connect to server.'
            }
        }
    })
}

// ======================================================
// TYPING EFFECT
// ======================================================

window.addEventListener('load', () => {

    setTimeout(() => {

        const typingText =
            document.querySelector('.highlight')

        if (!typingText) return

        const originalName = typingText.textContent

        typingText.textContent = ''

        let i = 0

        function typeWriter() {

            if (i < originalName.length) {

                typingText.textContent +=
                    originalName.charAt(i)

                i++

                setTimeout(typeWriter, 120)
            }
        }

        typeWriter()

    }, 300)
})

// ======================================================
// LOAD PROJECTS
// ======================================================

loadProjects()

// ======================================================
// FADE-IN SECTIONS
// ======================================================

const sections = document.querySelectorAll('section')

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.classList.add('visible')
        }
    })

}, {
    threshold: 0.1
})

sections.forEach(section => {
    observer.observe(section)
})

// ======================================================
// CARD ANIMATION
// ======================================================

function animateCards() {

    const cards =
        document.querySelectorAll('.project-card')

    cards.forEach((card, index) => {

        card.style.animationDelay =
            `${index * 0.15}s`

        card.classList.add('card-animate')
    })
}

// ======================================================
// ACTIVE NAVIGATION
// ======================================================

const navLinks =
    document.querySelectorAll('nav ul li a')

window.addEventListener('scroll', () => {

    let current = ''

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 100

        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id')
        }
    })

    navLinks.forEach(link => {

        link.classList.remove('active')

        if (
            link.getAttribute('href') === `#${current}`
        ) {
            link.classList.add('active')
        }
    })
})

// ======================================================
// FLASHCARD SLIDESHOW
// ======================================================

const fcTrack =
    document.getElementById('fc-track')

const fcCards =
    document.querySelectorAll('.flashcard')

const fcDotsContainer =
    document.getElementById('fc-dots')

const fcPrev =
    document.getElementById('fc-prev')

const fcNext =
    document.getElementById('fc-next')

const lightbox =
    document.getElementById('lightbox')

const lightboxImg =
    document.getElementById('lightbox-img')

const lightboxCaption =
    document.getElementById('lightbox-caption')

const lightboxClose =
    document.getElementById('lightbox-close')

const visibleCount = 4
const cardWidth = 216

let fcCurrent = 0

const fcTotal = fcCards.length

const maxIndex =
    Math.max(0, fcTotal - visibleCount)

// ======================================================
// CREATE DOTS
// ======================================================

if (fcDotsContainer) {

    for (let i = 0; i <= maxIndex; i++) {

        const dot = document.createElement('div')

        dot.classList.add('fc-dot')

        if (i === 0) {
            dot.classList.add('active')
        }

        dot.addEventListener('click', () => {
            goTo(i)
        })

        fcDotsContainer.appendChild(dot)
    }
}

// ======================================================
// UPDATE DOTS
// ======================================================

function updateDots() {

    document.querySelectorAll('.fc-dot')
        .forEach((dot, i) => {

            dot.classList.toggle(
                'active',
                i === fcCurrent
            )
        })
}

// ======================================================
// GO TO SLIDE
// ======================================================

function goTo(index) {

    if (!fcTrack) return

    fcCurrent =
        Math.max(0, Math.min(index, maxIndex))

    fcTrack.style.transform =
        `translateX(-${fcCurrent * cardWidth}px)`

    updateDots()
}

// ======================================================
// BUTTONS
// ======================================================

if (fcPrev && fcNext && fcTrack) {

    fcPrev.addEventListener('click', () => {
        goTo(fcCurrent - 1)
    })

    fcNext.addEventListener('click', () => {
        goTo(fcCurrent + 1)
    })
}

// ======================================================
// KEYBOARD
// ======================================================

document.addEventListener('keydown', (e) => {

    if (e.key === 'Escape') {

        closeProjectModal()
        closeLightbox()

        return
    }

    if (
        lightbox &&
        lightbox.classList.contains('active')
    ) {
        return
    }

    if (e.key === 'ArrowRight') {
        goTo(fcCurrent + 1)
    }

    if (e.key === 'ArrowLeft') {
        goTo(fcCurrent - 1)
    }
})

// ======================================================
// LIGHTBOX
// ======================================================

function openLightbox(img, caption) {

    if (
        !lightbox ||
        !lightboxImg ||
        !lightboxCaption
    ) return

    lightboxImg.src = img.src

    lightboxCaption.textContent = caption

    lightbox.classList.add('active')

    document.body.style.overflow = 'hidden'
}

function closeLightbox() {

    if (!lightbox) return

    lightbox.classList.remove('active')

    document.body.style.overflow = 'auto'
}

fcCards.forEach(card => {

    card.addEventListener('click', () => {

        const img = card.querySelector('img')

        const caption =
            card.querySelector('.flashcard-caption')
            ?.textContent
            ?.trim() || ''

        if (img) {
            openLightbox(img, caption)
        }
    })
})

if (lightboxClose) {

    lightboxClose.addEventListener(
        'click',
        closeLightbox
    )
}

if (lightbox) {

    lightbox.addEventListener('click', (e) => {

        if (e.target === lightbox) {
            closeLightbox()
        }
    })
}
