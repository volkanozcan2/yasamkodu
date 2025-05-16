
function showModal(message) {
    document.getElementById("modal-message").innerText = message;
    document.getElementById("modal").classList.remove("hidden");
}

document.getElementById("modal-close").addEventListener("click", function () {
    console.log("Modal kapatılıyor...");
    document.getElementById("modal").classList.add("hidden");
});

document.getElementById("studentForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    showModal("Bilgiler gönderiliyor...");

    try {
        const response = await fetch("/kaydet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            showModal("Bilgiler başarıyla gönderildi.");
            form.reset();
        } else {
            showModal("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
    } catch (error) {
        console.error("Gönderim hatası:", error);
        showModal("Sunucuya bağlanırken bir sorun oluştu.");
    }
});