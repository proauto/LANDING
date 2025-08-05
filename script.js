// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scroll animation for elements coming into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // Create intersection observer for animations
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Initialize animations for elements
    function initAnimations() {
        // Add animation styles to elements
        const animatedElements = document.querySelectorAll(
            '.service-content, .work-cards, .mission-content, .team-members, .contact-content'
        );

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(40px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(element);
        });

        // Animate work cards individually
        const workCards = document.querySelectorAll('.work-card');
        workCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            card.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
            observer.observe(card);
        });

        // Animate team members individually
        const teamMembers = document.querySelectorAll('.team-member');
        teamMembers.forEach((member, index) => {
            member.style.opacity = '0';
            member.style.transform = 'translateY(40px)';
            member.style.transition = `opacity 0.8s ease ${index * 0.3}s, transform 0.8s ease ${index * 0.3}s`;
            observer.observe(member);
        });
    }

    // Hero section animation
    function initHeroAnimation() {
        const heroContent = document.querySelector('.hero-content');
        const logo = document.querySelector('.logo');
        const mainCopy = document.querySelector('.main-copy');
        const subCopy = document.querySelector('.sub-copy');

        // Initial state
        logo.style.opacity = '0';
        logo.style.transform = 'translateX(-50%) translateY(-30px)';
        mainCopy.style.opacity = '0';
        mainCopy.style.transform = 'translateX(-50%) translateY(30px)';
        subCopy.style.opacity = '0';
        subCopy.style.transform = 'translateX(-50%) translateY(30px)';

        // Animate elements with delays
        setTimeout(() => {
            logo.style.transition = 'opacity 1s ease, transform 1s ease';
            logo.style.opacity = '1';
            logo.style.transform = 'translateX(-50%) translateY(0)';
        }, 300);

        setTimeout(() => {
            mainCopy.style.transition = 'opacity 1s ease, transform 1s ease';
            mainCopy.style.opacity = '1';
            mainCopy.style.transform = 'translateX(-50%) translateY(0)';
        }, 600);

        setTimeout(() => {
            subCopy.style.transition = 'opacity 1s ease, transform 1s ease';
            subCopy.style.opacity = '1';
            subCopy.style.transform = 'translateX(-50%) translateY(0)';
        }, 900);
    }

    // Floating animation for hero background pattern
    function initFloatingAnimation() {
        const bgPattern = document.querySelector('.hero-bg-pattern');
        if (bgPattern) {
            bgPattern.style.animation = 'float 6s ease-in-out infinite';
        }
    }

    // Add floating keyframes to CSS
    function addFloatingKeyframes() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% {
                    transform: translateY(0px) rotate(0deg);
                }
                50% {
                    transform: translateY(-10px) rotate(1deg);
                }
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(40px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .work-card:hover .card-icon {
                animation: bounce 0.6s ease;
            }

            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translateY(0);
                }
                40% {
                    transform: translateY(-10px);
                }
                60% {
                    transform: translateY(-5px);
                }
            }

            .illustration-svg .person-1,
            .illustration-svg .person-2 {
                animation: subtleBob 3s ease-in-out infinite;
            }

            .illustration-svg .person-2 {
                animation-delay: -1.5s;
            }

            @keyframes subtleBob {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-5px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Contact button functionality
    function initContactButton() {
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', function() {
                // You can replace this with actual contact functionality
                alert('연락처 기능을 추가해주세요!\n\n예시:\n- 이메일 링크\n- 연락처 폼\n- 전화번호');
            });

            // Add ripple effect
            ctaButton.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(0, 0, 0, 0.1)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s linear';
                ripple.style.pointerEvents = 'none';
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        }
    }

    // Add ripple animation keyframes
    function addRippleKeyframes() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Parallax effect for hero section
    function initParallaxEffect() {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('.hero-section');
            const heroContent = document.querySelector('.hero-content');
            
            if (heroSection && heroContent) {
                const rate = scrolled * -0.5;
                heroContent.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    // Smooth scroll for anchor links (if any are added later)
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Initialize all animations and interactions
    addFloatingKeyframes();
    addRippleKeyframes();
    initHeroAnimation();
    initFloatingAnimation();
    initAnimations();
    initContactButton();
    initParallaxEffect();
    initSmoothScroll();

    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});