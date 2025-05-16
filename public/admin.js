function createStudentCard(student) {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
    <h2>${student.student_name}</h2>
    <p><span class="label">ID:</span><br>${student.id || '-'}</p>
    <p><span class="label">Kan Grubu:</span> ${student.blood}</p>
    <p><span class="label">Veli 1:</span> ${student.parent1}</p>
    <p><span class="label">Veli 2:</span> ${student.parent2 || '-'}</p>
    <p><span class="label">Alerjiler:</span> ${student.allergies || '-'}</p>
    <p><span class="label">İlaçlar:</span> ${student.medications || '-'}</p>
    <p><span class="label">Notlar:</span><br>${student.notes || '-'}</p>
    <div class="btn-row">
      <button class="edit-btn">Düzenle</button>
      <button class="delete-btn">Sil</button>
      <button class="qr-btn">QR Göster</button>
    </div>
  `;

    div.querySelector('.edit-btn').addEventListener("click", () => {
        window.location.href = `/edit.html?id=${student.id}`;
    });

    div.querySelector('.delete-btn').addEventListener("click", () => {
        if (confirm("Bu öğrenciyi silmek istediğinize emin misiniz?")) {
            fetch(`/api/students/${student.id}`, { method: "DELETE" })
                .then(res => res.json())
                .then(result => {
                    if (result.success) {
                        div.remove();
                        alert("Öğrenci silindi.");
                    } else {
                        alert("Silinemedi: " + result.message);
                    }
                });
        }
    });

    div.querySelector('.qr-btn').addEventListener("click", () => {
        const studentId = student.id;
        const qrImageUrl = `/qr/${studentId}`;
        const qrPageLink = `${location.origin}/kart/${studentId}`;

        qrImage.src = qrImageUrl; // sadece bu yeterli
        qrText.textContent = qrPageLink;
        qrModal.classList.remove("hidden");
    });


    return div;
}
document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("qr-modal").classList.add("hidden");
});
document.getElementById("qr-modal").addEventListener("click", (e) => {
    if (e.target.id === "qr-modal") {
        document.getElementById("qr-modal").classList.add("hidden");
    }
});

fetch('/api/students')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("students-container");
        data.forEach(student => {
            const card = createStudentCard(student);
            container.appendChild(card);
        });
    })
    .catch(err => {
        console.error("Veri alınamadı:", err);
        document.getElementById("students-container").innerHTML = "<p>Veri alınamadı.</p>";
    });
const qrModal = document.getElementById("qr-modal");
const qrImage = document.getElementById("qr-image");
const qrText = document.getElementById("qr-link-text");
const closeModal = document.getElementById("close-modal");

closeModal.addEventListener("click", () => {
    qrModal.classList.add("hidden");
});
