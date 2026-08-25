export function initScrolly() {
    const steps = Array.from(document.querySelectorAll<HTMLElement>('.step-enter'));
    if (steps.length === 0) return;

    const diagramMap: Record<string, string> = {};
    steps.forEach(step => {
        const src = step.getAttribute('data-diagram');
        if (src) diagramMap[step.id] = src;
    });

    const diagram = document.getElementById('scrolly-diagram') as HTMLImageElement | null;
    const firstStep = steps[0];
    const lastStep = steps[steps.length - 1];

    // JavaScript Snap (desktop only)
    let snapTimeout: ReturnType<typeof setTimeout>;
    let isSnapping = false;

    const onScroll = () => {
        if (isSnapping) return;
        if (window.innerWidth < 1024) return;

        clearTimeout(snapTimeout);
        snapTimeout = setTimeout(() => {
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;

            const scrollyTop = firstStep.offsetTop;
            const scrollyBottom = lastStep.offsetTop + lastStep.offsetHeight;

            const inScrolly = scrollY >= scrollyTop - viewportHeight * 0.5 && scrollY < scrollyBottom - viewportHeight * 0.5;

            if (!inScrolly) return;
            if (scrollY > lastStep.offsetTop + 50) return;

            let nearestStep: HTMLElement = steps[0];
            let minDistance = Infinity;

            steps.forEach(step => {
                const distance = Math.abs(scrollY - step.offsetTop);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestStep = step;
                }
            });

            if (nearestStep && minDistance > 10) {
                isSnapping = true;
                nearestStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => { isSnapping = false; }, 600);
            }
        }, 120);
    };
    window.addEventListener('scroll', onScroll);

    // TOC: toggle, backdrop, click-outside, jump
    const toggle = document.querySelector<HTMLElement>('[data-toc-toggle]');
    const tocPanel = document.querySelector<HTMLElement>('[data-toc-panel]');
    const backdrop = document.querySelector<HTMLElement>('[data-toc-backdrop]');
    const tocItems = Array.from(document.querySelectorAll<HTMLElement>('[data-toc-item]'));

    const isTocOpen = () => tocPanel?.classList.contains('translate-x-0') ?? false;

    const setTocOpen = (open: boolean) => {
        tocPanel?.classList.toggle('translate-x-0', open);
        tocPanel?.classList.toggle('-translate-x-full', !open);
        backdrop?.classList.toggle('hidden', !open);
        toggle?.setAttribute('aria-expanded', String(open));
    };

    toggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        setTocOpen(!isTocOpen());
    });

    backdrop?.addEventListener('click', () => setTocOpen(false));

    document.addEventListener('mousedown', (e) => {
        if (!isTocOpen()) return;
        const target = e.target as Node;
        if (tocPanel?.contains(target)) return;
        if (toggle?.contains(target)) return;
        setTocOpen(false);
    });

    tocItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-toc-target');
            if (targetId) {
                document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            setTocOpen(false);
        });
    });

    // Active step → diagram crossfade + TOC highlight
    let currentSrc = diagram?.src;

    if (diagram) {
        const fadeIn = () => diagram.classList.remove('opacity-0');
        diagram.onload = fadeIn;
        if (diagram.complete) fadeIn();
    }

    const setActiveToc = (id: string) => {
        tocItems.forEach(item => {
            item.classList.toggle('toc-item-active', item.getAttribute('data-toc-target') === id);
        });
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const id = entry.target.id;
                setActiveToc(id);
                if (diagram) {
                    const newSrc = diagramMap[id];
                    if (newSrc && currentSrc !== newSrc) {
                        diagram.classList.add('opacity-0');
                        setTimeout(() => {
                            diagram.src = newSrc;
                            currentSrc = newSrc;
                            diagram.onload = () => diagram.classList.remove('opacity-0');
                        }, 300);
                    }
                }
            });
        },
        { threshold: 0.5 }
    );

    steps.forEach(step => observer.observe(step));

    // Expand diagram (modal overlay)
    const modal = document.getElementById('scrolly-modal');
    const modalWrapper = document.getElementById('scrolly-modal-wrapper');
    const modalImg = document.getElementById('scrolly-modal-img') as HTMLImageElement | null;
    const modalClose = document.getElementById('scrolly-modal-close');

    const openModal = () => {
        if (!modal || !modalImg || !diagram) return;
        modalImg.src = diagram.src;
        modalImg.style.transform = 'scale(1)';
        modalImg.style.cursor = 'grab';
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100', 'pointer-events-auto');
        document.body.style.overflow = 'hidden';
        zoomScale = 1;
        translateX = 0;
        translateY = 0;
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('opacity-100', 'pointer-events-auto');
        modal.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
        zoomScale = 1;
        translateX = 0;
        translateY = 0;
        if (modalImg) modalImg.style.transform = 'scale(1)';
    };

    diagram?.addEventListener('click', openModal);
    modalClose?.addEventListener('click', closeModal);
    modalWrapper?.addEventListener('click', (e) => {
        if (e.target === modalWrapper) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('opacity-100')) closeModal();
    });

    // Image zoom (modal only)
    let zoomScale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let startTranslateX = 0;
    let startTranslateY = 0;
    let isPinching = false;
    let pinchStartDist = 0;
    let pinchStartScale = 1;
    let badgeTimer: ReturnType<typeof setTimeout>;

    const MIN_Z = 0.25;
    const MAX_Z = 10;

    const zoomBadge = document.getElementById('scrolly-zoom-badge');

    const applyModalZoom = (smooth: boolean) => {
        if (!modalImg) return;
        modalImg.style.transition = smooth ? 'transform 0.2s' : 'none';
        modalImg.style.transform = `scale(${zoomScale}) translate(${translateX}px, ${translateY}px)`;
    };

    const showBadge = () => {
        if (!zoomBadge) return;
        zoomBadge.textContent = Math.round(zoomScale * 100) + '%';
        zoomBadge.classList.remove('opacity-0');
        zoomBadge.classList.add('opacity-100');
        clearTimeout(badgeTimer);
        badgeTimer = setTimeout(() => {
            zoomBadge.classList.remove('opacity-100');
            zoomBadge.classList.add('opacity-0');
        }, 1200);
    };

    if (modalWrapper && modalImg) {
        // Scroll wheel zoom (no Ctrl)
        modalWrapper.addEventListener('wheel', (e) => {
            if (!modal?.classList.contains('opacity-100')) return;
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            zoomScale = Math.min(MAX_Z, Math.max(MIN_Z, zoomScale + delta));
            applyModalZoom(true);
            showBadge();
        }, { passive: false });

        // Double-click: zoom 3x at cursor or reset
        modalWrapper.addEventListener('dblclick', (e) => {
            if (!modal?.classList.contains('opacity-100')) return;
            e.preventDefault();
            if (zoomScale > 1.3) {
                zoomScale = 1;
                translateX = 0;
                translateY = 0;
                applyModalZoom(true);
                showBadge();
            } else {
                zoomScale = 3;
                const rect = modalImg.getBoundingClientRect();
                const cx = (e.clientX - rect.left) / rect.width;
                const cy = (e.clientY - rect.top) / rect.height;
                translateX = -(cx - 0.5) * rect.width * (zoomScale - 1) / zoomScale;
                translateY = -(cy - 0.5) * rect.height * (zoomScale - 1) / zoomScale;
                applyModalZoom(true);
                showBadge();
            }
        });

        // Drag to pan
        modalImg.addEventListener('mousedown', (e) => {
            if (!modal?.classList.contains('opacity-100')) return;
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            startTranslateX = translateX;
            startTranslateY = translateY;
            modalImg.style.cursor = 'grabbing';
            modalImg.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            translateX = startTranslateX + dx / zoomScale;
            translateY = startTranslateY + dy / zoomScale;
            if (modalImg) modalImg.style.transform = `scale(${zoomScale}) translate(${translateX}px, ${translateY}px)`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                if (modalImg) modalImg.style.cursor = 'grab';
            }
        });

        // Pinch-to-zoom (mobile)
        modalWrapper.addEventListener('touchstart', (e) => {
            if (!modal?.classList.contains('opacity-100')) return;
            if (e.touches.length === 2) {
                isPinching = true;
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                pinchStartDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
                pinchStartScale = zoomScale;
            }
        }, { passive: true });

        modalWrapper.addEventListener('touchmove', (e) => {
            if (isPinching && e.touches.length === 2) {
                e.preventDefault();
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
                const ratio = dist / pinchStartDist;
                zoomScale = Math.min(MAX_Z, Math.max(MIN_Z, pinchStartScale * ratio));
                applyModalZoom(true);
                showBadge();
            }
        }, { passive: false });

        modalWrapper.addEventListener('touchend', () => { isPinching = false; }, { passive: true });
    }
}
