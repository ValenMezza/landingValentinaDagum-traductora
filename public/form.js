document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const status = document.getElementById("form-status");
    const btn = document.getElementById("submit-btn");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = form.elements.nombre?.value?.trim();
        const email = form.elements.email?.value?.trim();
        const mensaje = form.elements.mensaje?.value?.trim();

        if (!nombre || !email || !mensaje) {
            status.style.color = "red";
            status.textContent = "❌ Completá nombre, email y mensaje.";
            return;
        }

        btn.disabled = true;
        const oldText = btn.textContent;
        btn.textContent = "Enviando...";
        status.textContent = "";

        try {
            const res = await fetch("/api/contacto", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, email, mensaje }),
            });

            const result = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(result.error || `Error HTTP ${res.status}`);
            }

            status.style.color = "green";
            status.textContent = "✅ Mensaje enviado correctamente.";
            form.reset();
        } catch (err) {
            status.style.color = "red";
            status.textContent = "❌ No se pudo enviar. Intentá más tarde.";
            // Si querés ver el motivo real:
            console.error("Error enviando:", err);
        } finally {
            btn.disabled = false;
            btn.textContent = oldText;
        }
    });
});
