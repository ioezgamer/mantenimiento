function getStatusBadge(fechaProximo) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextDate = new Date(fechaProximo + "T00:00:00");
  const diffTime = nextDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return '<span class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Vencido</span>';
  } else if (diffDays <= 7) {
    return '<span class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Próximo</span>';
  } else {
    return '<span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Vigente</span>';
  }
}

function getStatusClass(fechaProximo) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextDate = new Date(fechaProximo + "T00:00:00");
  const diffTime = nextDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "vencido";
  if (diffDays <= 7) return "proximo";
  return "vigente";
}

function renderTable() {
  const tbody = document.getElementById("tableBody");
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const statusFilter = document.getElementById("filterStatus").value;

  let filteredMaintenances = maintenances.filter((m) => {
    const matchesSearch =
      (m.equipo || "").toLowerCase().includes(searchTerm) ||
      (m.usuario || "").toLowerCase().includes(searchTerm) ||
      (m.tipo || "").toLowerCase().includes(searchTerm) ||
      (m.descripcion || "").toLowerCase().includes(searchTerm);

    const status = getStatusClass(m.fechaProximo);
    const matchesStatus = !statusFilter || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  tbody.innerHTML = filteredMaintenances
    .map(
      (m, index) => `
                <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">${
                      index + 1
                    }</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${m.equipo}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${
                      m.usuario
                    }</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${m.tipo}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${new Date(
                      m.fechaMantenimiento + "T00:00:00"
                    ).toLocaleDateString("es-ES")}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title="${
                      m.descripcion
                    }">${m.descripcion}</td>
                    <td class="px-4 py-3 text-sm">
                        <div class="flex flex-col">
                            <span class="text-gray-900">${new Date(
                              m.fechaProximo + "T00:00:00"
                            ).toLocaleDateString("es-ES")}</span>
                            ${getStatusBadge(m.fechaProximo)}
                        </div>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900">${m.estado}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title="${
                      m.notas
                    }">${m.notas}</td>
                    <td class="px-4 py-3 text-sm">
                        <div class="flex space-x-2">
                            <button onclick="openModal('${
                              m.id
                            }')" class="text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors" title="Editar">
                                ✏️ Editar
                            </button>
                            <button onclick="deleteMaintenance('${
                              m.id
                            }')" class="text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors" title="Eliminar">
                                🗑️ Eliminar
                            </button>
                        </div>
                    </td>
                </tr>
            `
    )
    .join("");
}

function updateStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  document.getElementById("totalEquipos").textContent = maintenances.length;
  document.getElementById("totalMantenimientos").textContent =
    maintenances.length;

  const proximos = maintenances.filter((m) => {
    const nextDate = new Date(m.fechaProximo + "T00:00:00");
    const diffTime = nextDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  const vencidos = maintenances.filter((m) => {
    const nextDate = new Date(m.fechaProximo + "T00:00:00");
    return nextDate < today;
  }).length;

  document.getElementById("proximosMantenimientos").textContent = proximos;
  document.getElementById("mantenimientosVencidos").textContent = vencidos;
}

// Event Listeners
document
  .getElementById("new-maintenance-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      equipo: document.getElementById("equipo").value,
      usuario: document.getElementById("usuario").value,
      tipo: document.getElementById("tipo").value,
      fechaMantenimiento: document.getElementById("fechaMantenimiento").value,
      descripcion: document.getElementById("descripcion").value,
      fechaProximo: document.getElementById("fechaProximo").value,
      estado: document.getElementById("estado").value,
      notas: document.getElementById("notas").value,
    };

    // Validar campos requeridos
    if (
      !formData.equipo ||
      !formData.usuario ||
      !formData.tipo ||
      !formData.estado ||
      !formData.fechaMantenimiento ||
      !formData.fechaProximo
    ) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      let response;

      if (editingId) {
        // Actualizar mantenimiento existente
        response = await fetch(API_URL.UPDATE(editingId), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // Crear nuevo mantenimiento
        response = await fetch(API_URL.CREATE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al guardar el mantenimiento");
      }

      // Recargar datos desde la API
      await loadData();
      closeModal();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar el mantenimiento: " + error.message);
    }
  });

document.getElementById("searchInput").addEventListener("input", renderTable);
document.getElementById("filterStatus").addEventListener("change", renderTable);

// Cerrar modal al hacer clic fuera o en el botón de cancelar
document.getElementById("modal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal();
  }
});

async function exportData() {
  try {
    const response = await fetch(API_URL.GET_ALL);
    if (!response.ok) {
      throw new Error("Error al obtener datos para exportar");
    }

    const data = await response.json();
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName =
      "mantenimientos-backup-" +
      new Date().toISOString().split("T")[0] +
      ".json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  } catch (error) {
    console.error("Error al exportar datos:", error);
    alert("Error al exportar los datos. Por favor, intenta de nuevo.");
  }
}

async function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function (event) {
      try {
        const importedData = JSON.parse(event.target.result);

        if (Array.isArray(importedData) && importedData.length > 0) {
          if (
            confirm(
              `¿Estás seguro de importar ${importedData.length} registros? Esto reemplazará todos los datos actuales.`
            )
          ) {
            document.body.style.cursor = "wait";

            try {
              const setupKey = prompt(
                "Ingrese la clave de seguridad para confirmar la eliminación de todos los registros:"
              );
              if (!setupKey) {
                document.body.style.cursor = "default";
                return;
              }

              const deleteResponse = await fetch(API_URL.DELETE_ALL, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${setupKey}` },
              });

              if (!deleteResponse.ok) {
                throw new Error("Error al eliminar datos actuales");
              }

              for (const item of importedData) {
                const { id, ...dataWithoutId } = item;
                await fetch(API_URL.CREATE, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(dataWithoutId),
                });
              }

              await loadData();
              alert("Datos importados correctamente");
            } catch (error) {
              console.error("Error al importar datos:", error);
              alert("Error al importar los datos: " + error.message);
            } finally {
              document.body.style.cursor = "default";
            }
          }
        } else {
          alert("El archivo no contiene datos válidos");
        }
      } catch (error) {
        alert("Error al procesar el archivo: " + error.message);
      }
    };

    reader.readAsText(file);
  };

  input.click();
}

// Inicializar manejadores del formulario
setupFormHandlers();
