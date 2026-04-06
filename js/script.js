// document.addEventListener("DOMContentLoaded", function () {
//     const form = document.getElementById("contactForm");
//     const statusMessage = document.getElementById("status");

//     form.addEventListener("submit", function (event) {
//         event.preventDefault();
//         const formData = new FormData(form);
        
//         fetch("https://formsubmit.co/ajax/maurifl@gmail.com", {
//             method: "POST",
//             body: formData
//         })
//         .then(response => response.json())  // Es necesario que la respuesta sea parseada a JSON
//         .then(data => {
//             if (data.success) {
//                 statusMessage.textContent = "Mensaje enviado con éxito!";
//                 statusMessage.style.color = "green";
//                 form.reset();
//             } else {
//                 statusMessage.textContent = "Error al enviar el mensaje.";
//                 statusMessage.style.color = "red";
//             }
//         })
//         .catch(() => {
//             statusMessage.textContent = "Error de conexión. Inténtalo de nuevo.";
//             statusMessage.style.color = "red";
//         });
//     });
// });
