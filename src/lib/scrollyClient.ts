export function initScrolly() {
    const steps = Array.from(document.querySelectorAll<HTMLElement>('.step-enter'));
    if (steps.length === 0) return;

    const diagramMap: Record<string, string> = {};
    steps.forEach(step => {
        const src = step.getAttribute('data-diagram');
        if (src) diagramMap[step.id] = src;
    });

    const diagram = document.getElementById('scrolly-diagram') as HTMLImageElement | null;
    const placeholder = document.getElementById('scrolly-placeholder');
    const firstStep = steps[0];

    // TOC: toggle (header), backdrop, click-outside, close button, jump
    const toggle = document.querySelector<HTMLElement>('[data-toc-toggle]');
    const tocPanel = document.querySelector<HTMLElement>('[data-toc-panel]');
    const backdrop = document.querySelector<HTMLElement>('[data-toc-backdrop]');
    const tocCloseBtn = document.querySelector<HTMLElement>('[data-toc-close]');
    const tocItems = Array.from(document.querySelectorAll<HTMLElement>('[data-toc-item]'));

    const isTocOpen = () => tocPanel?.classList.contains('translate-x-0') ?? false;

    const setTocOpen = (open: boolean) => {
        tocPanel?.classList.toggle('translate-x-0', open);
        tocPanel?.classList.toggle('translate-x-full', !open);
        backdrop?.classList.toggle('hidden', !open);
        toggle?.setAttribute('aria-expanded', String(open));
    };

    toggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        setTocOpen(!isTocOpen());
    });

    tocCloseBtn?.addEventListener('click', () => setTocOpen(false));

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

    const updateActiveStep = (step: HTMLElement) => {
        const id = step.id;
        setActiveToc(id);
        const diagramSrc = diagramMap[id];

        if (placeholder) {
            if (diagramSrc) {
                placeholder.classList.add('hidden');
                if (diagram) diagram.classList.remove('hidden');
            } else {
                placeholder.classList.remove('hidden');
                if (diagram) diagram.classList.add('hidden');
            }
        }

        if (diagram && diagramSrc && currentSrc !== diagramSrc) {
            diagram.classList.add('opacity-0');
            setTimeout(() => {
                diagram.src = diagramSrc;
                currentSrc = diagramSrc;
                diagram.onload = () => diagram.classList.remove('opacity-0');
            }, 300);
        }
    };

    // Continuous flow: activate the last step whose top has passed the reading line.
    let activeStep = firstStep;
    let scrollFrame = 0;
    const updateActiveFromScroll = () => {
        const readingLine = window.scrollY + 56 + window.innerHeight * 0.2;
        let nextActive = firstStep;

        for (const step of steps) {
            if (step.offsetTop <= readingLine) nextActive = step;
            else break;
        }

        if (nextActive !== activeStep) {
            activeStep = nextActive;
            updateActiveStep(activeStep);
        }
    };

    const onScroll = () => {
        if (scrollFrame) return;
        scrollFrame = window.requestAnimationFrame(() => {
            scrollFrame = 0;
            updateActiveFromScroll();
        });
    };

    updateActiveStep(activeStep);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Desktop-only resizable text/diagram split. The setting survives reloads.
    const split = document.getElementById('scrolly-split');
    const textColumn = document.getElementById('scrolly-text-col');
    const divider = document.getElementById('scrolly-divider');
    const splitStorageKey = 'rsi.splitTextPct';
    const minTextPct = 30;
    const maxTextPct = 70;
    let textPct = 60;
    let isResizing = false;

    const clampTextPct = (value: number) => Math.min(maxTextPct, Math.max(minTextPct, value));
    const applyTextPct = (value: number) => {
        textPct = clampTextPct(value);
        if (window.innerWidth >= 1024 && textColumn) {
            textColumn.style.width = `${textPct}%`;
            textColumn.style.flexBasis = `${textPct}%`;
        }
        divider?.setAttribute('aria-valuenow', String(Math.round(textPct)));
    };

    try {
        const stored = localStorage.getItem(splitStorageKey);
        if (stored !== null) {
            const savedPct = Number(stored);
            if (Number.isFinite(savedPct)) textPct = clampTextPct(savedPct);
        }
    } catch {
        // Storage can be unavailable in privacy-restricted browsers.
    }

    applyTextPct(textPct);

    const stopResizing = () => {
        if (!isResizing) return;
        isResizing = false;
        document.body.classList.remove('select-none');
        document.body.style.cursor = '';
        try {
            localStorage.setItem(splitStorageKey, String(textPct));
        } catch {
            // Ignore storage failures; resizing still works for this session.
        }
    };

    divider?.addEventListener('pointerdown', (event) => {
        if (window.innerWidth < 1024 || !split) return;
        isResizing = true;
        divider.setPointerCapture(event.pointerId);
        document.body.classList.add('select-none');
        document.body.style.cursor = 'col-resize';
        event.preventDefault();
    });

    divider?.addEventListener('pointermove', (event) => {
        if (!isResizing || !split) return;
        const bounds = split.getBoundingClientRect();
        const nextPct = ((event.clientX - bounds.left) / bounds.width) * 100;
        applyTextPct(nextPct);
    });

    divider?.addEventListener('pointerup', stopResizing);
    divider?.addEventListener('pointercancel', stopResizing);
    window.addEventListener('resize', () => {
        if (window.innerWidth < 1024 && textColumn) {
            textColumn.style.width = '';
            textColumn.style.flexBasis = '';
        } else {
            applyTextPct(textPct);
        }
    });

    // Expand diagram (modal overlay)
    const modal = document.getElementById('scrolly-modal');
    const modalWrapper = document.getElementById('scrolly-modal-wrapper');
    const modalImg = document.getElementById('scrolly-modal-img') as HTMLImageElement | null;
    const modalClose = document.getElementById('scrolly-modal-close');

    const openModal = () => {
        if (!modal || !modalImg || !diagram) return;
        if (diagram.classList.contains('hidden')) return;
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
        if (e.key !== 'Escape') return;
        if (modal?.classList.contains('opacity-100')) {
            closeModal();
            return;
        }
        if (isTocOpen()) {
            setTocOpen(false);
            (toggle as HTMLElement | null)?.focus();
        }
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
