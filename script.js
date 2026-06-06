/* ==========================================
   Romantic Apology Website Script
   Logic: Music player, Particles, Lightbox,
          Typing effect, Sorry Meter & Counter
========================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. Global Variables & Selectors
    ========================================== */
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const readHeartBtn = document.getElementById('read-heart-btn');
    const navBar = document.getElementById('main-nav');
    
    // Lightbox Selectors
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    // Image data for Lightbox slideshow
    const galleryImages = [
        { src: 'images/gallery_pic1.png', caption: '❤️' },
        { src: 'images/gallery_pic2.png', caption: '❤️' },
        { src: 'images/gallery_pic3.png', caption: '❤️' },
        { src: 'images/memory_first_date.png', caption: '❤️' },
        { src: 'images/memory_travel.png', caption: '❤️' },
        { src: 'images/memory_cozy.png', caption: '❤️' }
    ];
    let currentImgIndex = 0;

    /* ==========================================
       2. Navigation Bar Scroll Effect
    ========================================== */
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navBar.classList.add('scrolled');
        } else {
            navBar.classList.remove('scrolled');
        }
    });

    /* ==========================================
       3. Audio Player Logic
    ========================================== */
    // Adjust volume initially
    bgMusic.volume = volumeSlider.value;

    function toggleMusic() {
        if (bgMusic.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    }

    function playMusic() {
        bgMusic.play().then(() => {
            musicBtn.classList.add('playing');
        }).catch(err => {
            console.log("Audio play blocked by browser policy. Waiting for user interaction.", err);
        });
    }

    function pauseMusic() {
        bgMusic.pause();
        musicBtn.classList.remove('playing');
    }

    musicBtn.addEventListener('click', toggleMusic);

    volumeSlider.addEventListener('input', (e) => {
        bgMusic.volume = e.target.value;
        if (bgMusic.volume === 0) {
            musicBtn.classList.remove('playing');
        } else if (!bgMusic.paused && !musicBtn.classList.contains('playing')) {
            musicBtn.classList.add('playing');
        }
    });

    // Start music on first click of "Please Read My Heart" button as user gesture
    if (readHeartBtn) {
        readHeartBtn.addEventListener('click', () => {
            playMusic();
        });
    }

    // fallback: play music on any key/touch event if still paused
    const startAudioOnInteraction = () => {
        if (bgMusic.paused) {
            playMusic();
        }
        window.removeEventListener('click', startAudioOnInteraction);
        window.removeEventListener('touchstart', startAudioOnInteraction);
    };
    window.addEventListener('click', startAudioOnInteraction);
    window.addEventListener('touchstart', startAudioOnInteraction);


    /* ==========================================
       4. Heart Particle Canvas Effect
    ========================================== */
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const particleColors = ['#ff7597', '#b19ffb', '#ffeef2', '#fceeff', '#e5a69e'];
    const emojiList = ['❤️', '💕', '💖', '💗', '✨', '🌸'];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
            // Start at random heights initially to prevent clumps
            this.y = Math.random() * canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 50;
            this.size = Math.random() * 16 + 10; // Font size range
            this.speedY = -(Math.random() * 1.2 + 0.5); // Rise speed
            this.speedX = Math.random() * 0.6 - 0.3; // Horizontal wobble
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            this.wobbleValue = Math.random() * Math.PI;
            this.opacity = Math.random() * 0.5 + 0.3; // Starting transparency
            this.fadeSpeed = Math.random() * 0.003 + 0.001;
            // Select emoji
            this.emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
        }

        update() {
            this.y += this.speedY;
            this.wobbleValue += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobbleValue) * 0.3;
            
            // Fade particles as they approach the top
            if (this.y < canvas.height * 0.25) {
                this.opacity -= this.fadeSpeed;
            }

            // Reset when completely out of screen or faded
            if (this.y < -30 || this.opacity <= 0) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.font = `${this.size}px Arial`;
            ctx.fillText(this.emoji, this.x, this.y);
            ctx.restore();
        }
    }

    // Initialize particles
    const maxParticles = Math.min(60, Math.floor(window.innerWidth / 25)); // Responsive particle count
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();


    /* ==========================================
       5. Mouse Heart Trail
    ========================================== */
    let lastTrailTime = 0;
    window.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTrailTime < 75) return; // Throttle spawning
        
        lastTrailTime = now;
        
        const trailHeart = document.createElement('div');
        trailHeart.className = 'cursor-heart';
        
        // Offset coordinates slightly to center the heart on cursor
        trailHeart.style.left = `${e.clientX - 6}px`;
        trailHeart.style.top = `${e.clientY - 6}px`;
        
        // Random slight color/size variations
        const colors = ['#ff7597', '#ff4d77', '#b19ffb', '#e5a69e'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        trailHeart.style.backgroundColor = randomColor;
        
        // Set up psuedo colors through styles
        trailHeart.style.setProperty('--primary-pink', randomColor);
        
        document.body.appendChild(trailHeart);
        
        // Auto remove element after animation finishes
        trailHeart.addEventListener('animationend', () => {
            trailHeart.remove();
        });
    });


    /* ==========================================
       6. Scroll Reveal & Sorry Counters Animation
    ========================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const counterElements = {
        sorry: { el: document.getElementById('counter-sorry'), target: 1 },
        sorryAgain: { el: document.getElementById('counter-sorry-again'), target: 100 },
        thousand: { el: document.getElementById('counter-thousand'), target: 1000 },
    };
    
    let countersAnimated = false;

    function animateCounter(el, target, duration = 2000) {
        let start = 0;
        const stepTime = Math.abs(Math.floor(duration / target));
        
        // Cap speed step
        const stepVal = target > 500 ? 5 : 1;
        const intervalTime = Math.max(stepTime, 10);
        
        const timer = setInterval(() => {
            start += stepVal;
            if (start >= target) {
                el.innerText = target.toLocaleString();
                clearInterval(timer);
            } else {
                el.innerText = start.toLocaleString();
            }
        }, intervalTime);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Trigger counters specifically when scroll reaches them
                if (entry.target.id === 'counter-section' && !countersAnimated) {
                    countersAnimated = true;
                    animateCounter(counterElements.sorry.el, counterElements.sorry.target, 1200);
                    animateCounter(counterElements.sorryAgain.el, counterElements.sorryAgain.target, 1500);
                    animateCounter(counterElements.thousand.el, counterElements.thousand.target, 1800);
                    
                    // Trigger the Meter bar fill
                    setTimeout(() => {
                        const meterFill = document.getElementById('meter-fill');
                        if (meterFill) meterFill.style.width = '99.9%';
                        startSorryMeterPrecision();
                    }, 500);
                }
            }
        });
    }, { threshold: 0.15 });

    // Observe scroll reveals
    revealElements.forEach(el => observer.observe(el));
    
    // Also observe counter section specifically
    const counterSection = document.getElementById('counter-section');
    if (counterSection) observer.observe(counterSection);


    /* ==========================================
       7. High-Precision Sorry Meter Logic
    ========================================== */
    let meterPercentage = 99.99990000;
    const percentageText = document.getElementById('meter-percentage');
    let meterInterval;

    function startSorryMeterPrecision() {
        if (meterInterval) return;
        
        meterInterval = setInterval(() => {
            // Add a tiny random fraction
            const increment = Math.random() * 0.00000015 + 0.00000005;
            meterPercentage += increment;
            
            // Format percentage string to 8 decimal places
            if (percentageText) {
                percentageText.innerText = `${meterPercentage.toFixed(8)}%`;
            }
        }, 60);
    }


    /* ==========================================
       8. Love Letter Typewriter Effect
    ========================================== */
    const typewriterElement = document.getElementById('typewriter-text');
    const letterTextContent = `My Dearest,

Sometimes words fail me when we speak, but I wanted to build this special space for you to show how much you truly mean to me. I am writing this to tell you how deeply sorry I am for my recent mistakes. 

I cherish every single moment we share—from our quiet evening walks to our silly late-night talks. You have brought so much warmth, kindness, and light into my life, and the thought of causing you any sadness breaks my heart.

Please know that I am committed to listening more, communicating better, and being the supportive, loving partner you deserve. Thank you for your patience and for being the most incredible person in my world. 

I love you, now and forever. ❤️

Yours,
VAVA`;

    let letterTyped = false;

    function startTypewriter() {
        if (letterTyped) return;
        letterTyped = true;
        
        typewriterElement.innerHTML = '';
        typewriterElement.classList.add('typing-cursor');
        
        let charIndex = 0;
        const typingSpeed = 35; // millisecond delay per character

        function type() {
            if (charIndex < letterTextContent.length) {
                const char = letterTextContent.charAt(charIndex);
                
                if (char === '\n') {
                    typewriterElement.innerHTML += '<br>';
                } else {
                    typewriterElement.innerHTML += char;
                }
                
                charIndex++;
                setTimeout(type, typingSpeed);
            } else {
                // Remove typing blinking cursor when finished
                typewriterElement.classList.remove('typing-cursor');
            }
        }
        
        type();
    }

    const letterSection = document.getElementById('letter-section');
    if (letterSection) {
        const letterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startTypewriter();
                    letterObserver.unobserve(letterSection); // Type only once
                }
            });
        }, { threshold: 0.3 });
        
        letterObserver.observe(letterSection);
    }


    /* ==========================================
       9. Interactive Lightbox Modal
    ========================================== */
    window.openLightbox = function(index) {
        currentImgIndex = index;
        const currentImgData = galleryImages[currentImgIndex];
        
        lightboxImg.src = currentImgData.src;
        lightboxCaption.innerText = currentImgData.caption;
        
        lightboxModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Lock background scrolling
    };

    window.closeLightbox = function() {
        lightboxModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Unlock background scrolling
    };

    window.prevLightboxImage = function() {
        currentImgIndex = (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImg();
    };

    window.nextLightboxImage = function() {
        currentImgIndex = (currentImgIndex + 1) % galleryImages.length;
        updateLightboxImg();
    };

    function updateLightboxImg() {
        const nextImgData = galleryImages[currentImgIndex];
        // Apply temporary opacity transition on source swap
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = nextImgData.src;
            lightboxCaption.innerText = nextImgData.caption;
            lightboxImg.style.opacity = '1';
        }, 150);
    }

    // Keyboard bindings for Lightbox
    window.addEventListener('keydown', (e) => {
        if (lightboxModal.style.display === 'block') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevLightboxImage();
            if (e.key === 'ArrowRight') nextLightboxImage();
        }
    });

});
