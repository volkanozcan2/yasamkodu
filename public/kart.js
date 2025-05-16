const id = location.pathname.split('/').pop();

fetch(`/api/students/${id}`)
    .then(res => res.json())
    .then(student => {
        if (!student || student.error) {
            document.body.innerHTML = "<p style='text-align:center;color:red;'>Öğrenci bulunamadı.</p>";
            return;
        }

        document.getElementById("student-name").textContent = student.student_name;
        document.getElementById("parent1").textContent = student.parent1;
        document.getElementById("parent2").textContent = student.parent2 || "-";
        document.getElementById("parent1-link").href = "tel:" + student.parent1;
        document.getElementById("parent2-link").href = "tel:" + student.parent2;
        document.getElementById("blood").textContent = student.blood;
        document.getElementById("allergies").textContent = student.allergies || "-";
        document.getElementById("medications").textContent = student.medications || "-";
        document.getElementById("notes-content").textContent = student.notes || "-";
    });
