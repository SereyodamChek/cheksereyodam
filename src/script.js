/* =========================================================
   Sereyodam Chek — Premium Portfolio · interactions
   ========================================================= */
(function () {
    "use strict";

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    /* ---------- Preloader ---------- */
    window.addEventListener("load", () => {
        const preloader = document.getElementById("preloader");
        setTimeout(() => {
            if (preloader) preloader.classList.add("hidden");
            document.body.classList.add("is-loaded");
        }, 700);
    });

    // Safety fallback: remove loader after 3.5s no matter what
    setTimeout(() => {
        const preloader = document.getElementById("preloader");
        if (preloader) preloader.classList.add("hidden");
        document.body.classList.add("is-loaded");
    }, 3500);

    /* ---------- Typed.js ---------- */
    if (typeof Typed !== "undefined") {
        new Typed(".typing-text", {
            strings: ["Front-End Web Developer", "UI/UX Designer", "Content Creator", "Network Administrator"],
            loop: true,
            typeSpeed: 55,
            backSpeed: 28,
            backDelay: 1400,
            smartBackspace: true,
        });
    }

    /* ---------- Navbar: auto-hide on link click (mobile), glass on scroll ---------- */
    const navBar = document.querySelector(".premium-nav");
    const navCollapseEl = document.getElementById("navbarNav");

    document.querySelectorAll(".click-trigger .nav-link, .navbar-brand").forEach((el) => {
        el.addEventListener("click", () => {
            if (navCollapseEl && navCollapseEl.classList.contains("show")) {
                const instance = bootstrap.Collapse.getInstance(navCollapseEl) || new bootstrap.Collapse(navCollapseEl, { toggle: false });
                instance.hide();
            }
        });
    });

    /* ---------- Scroll-based updates: navbar state, scroll progress, active link ---------- */
    const progressEl = document.getElementById("scrollProgress");
    const sections = ["home", "about", "skills", "certification", "project"]
        .map((id) => document.getElementById(id))
        .filter(Boolean);
    const navLinks = document.querySelectorAll(".nav-link");

    let ticking = false;

    function onScroll() {
        const y = window.scrollY;
        const doc = document.documentElement;
        const max = (doc.scrollHeight - doc.clientHeight) || 1;
        const progress = Math.min(100, (y / max) * 100);

        if (progressEl) progressEl.style.width = progress + "%";

        if (navBar) {
            if (y > 24) navBar.classList.add("scrolled");
            else navBar.classList.remove("scrolled");
        }

        // Active section detection
        let activeId = sections[0] ? sections[0].id : "home";
        const mid = y + window.innerHeight * 0.35;
        for (const sec of sections) {
            if (sec.offsetTop <= mid) activeId = sec.id;
        }
        navLinks.forEach((l) => {
            const href = l.getAttribute("href");
            if (href === "#" + activeId) l.classList.add("active");
            else l.classList.remove("active");
        });

        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });
    onScroll();

    /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
    const revealEls = document.querySelectorAll("[data-reveal]");
    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.revealDelay || "0", 10);
                    setTimeout(() => entry.target.classList.add("revealed"), delay);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
        revealEls.forEach((el) => io.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add("revealed"));
    }

    /* ---------- Custom cursor ---------- */
    if (!isTouch && !prefersReducedMotion) {
        const dot = document.querySelector(".cursor-dot");
        const ring = document.querySelector(".cursor-ring");
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let ringX = mouseX, ringY = mouseY;

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (dot) dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        }, { passive: true });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            if (ring) ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateRing);
        }
        animateRing();

        const interactiveSel = "a, button, [data-magnetic], .skill-stack img, .project-grid .cards, .cert-grid .box, .contact-cta, .social-icons a, .info-list li";
        document.querySelectorAll(interactiveSel).forEach((el) => {
            el.addEventListener("mouseenter", () => {
                if (ring) ring.classList.add("hover");
                if (dot) dot.classList.add("hover");
            });
            el.addEventListener("mouseleave", () => {
                if (ring) ring.classList.remove("hover");
                if (dot) dot.classList.remove("hover");
            });
        });

        window.addEventListener("mouseleave", () => {
            if (ring) ring.style.opacity = "0";
            if (dot) dot.style.opacity = "0";
        });
        window.addEventListener("mouseenter", () => {
            if (ring) ring.style.opacity = "1";
            if (dot) dot.style.opacity = "1";
        });
    } else {
        document.body.style.cursor = "auto";
        document.querySelectorAll(".cursor-dot, .cursor-ring").forEach((el) => el.remove());
    }

    /* ---------- Magnetic buttons ---------- */
    if (!isTouch && !prefersReducedMotion) {
        const magnets = document.querySelectorAll("[data-magnetic]");
        magnets.forEach((mag) => {
            const strength = 22;
            mag.addEventListener("mousemove", (e) => {
                const rect = mag.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                mag.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px)`;
            });
            mag.addEventListener("mouseleave", () => {
                mag.style.transform = "translate(0, 0)";
            });
        });
    }

    /* ---------- 3D tilt effect ---------- */
    if (!isTouch && !prefersReducedMotion) {
        const tiltEls = document.querySelectorAll("[data-tilt]");
        tiltEls.forEach((el) => {
            const maxTilt = 8;
            el.addEventListener("mousemove", (e) => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const rotY = (x - 0.5) * maxTilt * 2;
                const rotX = (0.5 - y) * maxTilt * 2;
                el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            });
            el.addEventListener("mouseleave", () => {
                el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
            });
        });
    }

    /* ---------- Parallax on floating cards & hero portrait ---------- */
    if (!isTouch && !prefersReducedMotion) {
        const visual = document.querySelector(".hero-visual");
        if (visual) {
            visual.addEventListener("mousemove", (e) => {
                const rect = visual.getBoundingClientRect();
                const cx = (e.clientX - rect.left - rect.width / 2) / rect.width;
                const cy = (e.clientY - rect.top - rect.height / 2) / rect.height;
                visual.querySelectorAll(".floating-card").forEach((card, i) => {
                    const depth = [18, 26, 22][i % 3];
                    card.style.transform = `translate(${cx * depth}px, ${cy * depth}px) translateZ(40px)`;
                });
            });
            visual.addEventListener("mouseleave", () => {
                visual.querySelectorAll(".floating-card").forEach((card) => {
                    card.style.transform = "translateZ(40px)";
                });
            });
        }
    }

    /* ---------- Fetch JSON data (certifications & projects) ---------- */
    async function fetchData(type) {
        const url = type === "certification"
            ? "certification/certification.json"
            : "project/project.json";
        try {
            const res = await fetch(url);
            return await res.json();
        } catch (err) {
            console.error("Failed to fetch " + type, err);
            return [];
        }
    }

    function showCertification(certification) {
        const container = document.querySelector(".certification .content");
        if (!container) return;
        let html = "";
        certification.forEach((c, i) => {
            const hidden = i >= 3 ? " d-none" : "";
            const delay = (i % 3) * 120;
            html += `
                <div class="box${hidden}" data-reveal data-reveal-delay="${delay}">
                    <img draggable="false" src="${c.image}" alt="${c.name}" />
                    <div class="desc">
                        <h3>${c.name}</h3>
                        <p>Issued by <span>${c.by}</span></p>
                        <div class="credentials">
                            <a class="btn" target="_blank" rel="noopener" href="${c.links.credentials || '#'}">
                                View credential
                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                            </a>
                        </div>
                    </div>
                </div>`;
        });
        container.innerHTML = html;
        observeNew(container);
    }

    function showProject(project) {
        const container = document.querySelector(".project .content");
        if (!container) return;
        let html = "";
        project.forEach((p, i) => {
            const delay = (i % 3) * 120;
            html += `
                <article class="cards" data-reveal data-reveal-delay="${delay}">
                    <img draggable="false" src="${p.image}" alt="${p.title}" />
                    <div class="desc-content">
                        <div class="tag">
                            <h3>${p.title}</h3>
                            <h5>${p.tech}</h5>
                        </div>
                        <div class="desc">
                            <p>${p.desc}</p>
                            <div class="btns">
                                <a href="${p.links.demo}" class="btn" target="_blank" rel="noopener">
                                    <i class="fa-solid fa-eye"></i> Demo
                                </a>
                                <a href="${p.links.code}" class="btn" target="_blank" rel="noopener">
                                    <i class="fa-solid fa-code"></i> Code
                                </a>
                            </div>
                        </div>
                    </div>
                </article>`;
        });
        container.innerHTML = html;
        observeNew(container);
    }

    function observeNew(scope) {
        const items = scope.querySelectorAll("[data-reveal]");
        if ("IntersectionObserver" in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const delay = parseInt(entry.target.dataset.revealDelay || "0", 10);
                        setTimeout(() => entry.target.classList.add("revealed"), delay);
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
            items.forEach((el) => io.observe(el));
        } else {
            items.forEach((el) => el.classList.add("revealed"));
        }
    }

    Promise.all([fetchData("certification"), fetchData("project")]).then(([certs, projects]) => {
        showCertification(certs);
        showProject(projects);
    });

    /* ---------- Load-more (certifications) ---------- */
    const loadmore = document.querySelector(".loadmore-btn");
    if (loadmore) {
        let currentItems = 3;
        loadmore.addEventListener("click", (e) => {
            e.preventDefault();
            const elementList = [...document.querySelectorAll(".certification .content .box")];
            let added = 0;
            for (let i = currentItems; i < currentItems + 3; i++) {
                if (elementList[i]) {
                    elementList[i].classList.remove("d-none");
                    setTimeout(() => elementList[i].classList.add("revealed"), added * 100);
                    added++;
                }
            }
            currentItems += 3;
            if (currentItems >= elementList.length) {
                loadmore.style.transition = "opacity 400ms ease, transform 400ms ease";
                loadmore.style.opacity = "0";
                loadmore.style.transform = "translateY(10px)";
                setTimeout(() => (loadmore.style.display = "none"), 420);
            }
        });
    }

    /* ---------- AOS (legacy fallback for any remaining [data-aos]) ---------- */
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 900,
            easing: "ease-out-cubic",
            once: true,
            offset: 60,
        });
    }

    /* ---------- Disable context menu & devtools shortcuts (preserved from original) ---------- */
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    document.addEventListener("keydown", (e) => {
        if (
            (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
            (e.ctrlKey && e.key === "U")
        ) {
            e.preventDefault();
            return false;
        }
    });
})();
