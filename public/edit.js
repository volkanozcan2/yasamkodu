const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
    alert("Geçersiz öğrenci ID'si.");
    window.location.href = "/admin.html";
}

fetch(`/api/students/${id}`)
    .then((res) => res.json())
    .then((data) => {
        if (!data || data.success === false) throw new Error("Öğrenci bulunamadı.");

        document.getElementById("student-id").value = data.id;
        document.getElementById("student-name").value = data.student_name;
        document.getElementById("parent1").value = data.parent1;
        document.getElementById("parent2").value = data.parent2;
        document.getElementById("blood").value = data.blood;
        document.getElementById("allergies").value = data.allergies;
        document.getElementById("medications").value = data.medications;
        document.getElementById("notes").value = data.notes;
    })
    .catch((err) => {
        console.error(err);
        alert("Öğrenci verisi alınamadı.");
        window.location.href = "/admin.html";
    });


// Form gönderimi
const form = document.getElementById("editForm");
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const updated = {
        "student-name": form["student-name"].value,
        parent1: form.parent1.value,
        parent2: form.parent2.value,
        blood: form.blood.value,
        allergies: form.allergies.value,
        medications: form.medications.value,
        notes: form.notes.value,
    };

    fetch(`/api/students/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
    })
        .then((res) => res.json())
        .then((result) => {
            if (result.success) {
                alert("Bilgiler güncellendi.");
                window.location.href = "/admin.html";
            } else {
                alert("Güncelleme başarısız: " + result.message);
            }
        })
        .catch((err) => {
            console.error("Güncelleme hatası:", err);
            alert("Sunucuya bağlanırken bir hata oluştu.");
        });
});