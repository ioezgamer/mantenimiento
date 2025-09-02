document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("new-maintenance-form");
  const cancelBtn = document.getElementById("cancel-maintenance");
  const saveBtn = document.getElementById("save-maintenance");

  cancelBtn.addEventListener("click", () => {
    form.reset();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      equipo: form.equipo.value,
      usuario: form.usuario.value,
      tipo: form.tipo.value,
      fechaMantenimiento: form.fechaMantenimiento.value,
      fechaProximo: form.fechaProximo.value || null,
      estado: form.estado.value,
      descripcion: form.descripcion.value,
      notas: form.notas.value,
    };

    if (
      !formData.equipo ||
      !formData.tipo ||
      !formData.fechaMantenimiento ||
      !formData.estado ||
      !formData.usuario
    ) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      const response = await fetch("/.netlify/functions/post-maintenances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error en la respuesta");
      const result = await response.json();
      alert(result.message || "Mantenimiento guardado con éxito");
      form.reset();
      location.reload();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar el mantenimiento. Revisa la consola.");
    }
  });
});
