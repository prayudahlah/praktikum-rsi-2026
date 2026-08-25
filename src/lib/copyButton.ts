/**
 * Shared copy-to-clipboard behavior for code/terminal blocks.
 * Call `initCopyButtons()` once per page (Astro <script> or inline).
 * Finds all `.copy-btn[data-code]` and wires click → clipboard → icon swap.
 */
export function initCopyButtons(): void {
    document.querySelectorAll<HTMLButtonElement>('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const code = btn.getAttribute('data-code');
            if (!code) return;

            await navigator.clipboard.writeText(code);

            const copyIcon = btn.querySelector('.copy-icon');
            const checkIcon = btn.querySelector('.check-icon');
            copyIcon?.classList.add('hidden');
            checkIcon?.classList.remove('hidden');

            setTimeout(() => {
                copyIcon?.classList.remove('hidden');
                checkIcon?.classList.add('hidden');
            }, 2000);
        });
    });
}
