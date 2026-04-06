document.addEventListener("DOMContentLoaded", async function () {
    const today = new Date().toLocaleDateString();
    let startTime = Date.now();

    document.body.style.pointerEvents = "none";
    document.body.style.overflow = "hidden";

    const modal = document.createElement("div");
    modal.innerHTML = `
        <input type="hidden" name="ubicacion" id="ubicacion">
        <div id="modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 9999; pointer-events: auto;">
            <div id="modal-content" style="background: white; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3); pointer-events: auto; font-family: 'Montserrat-SemiBold', sans-serif;">
                <h2 style="margin-bottom: 10px; font-size: 22px;">¡Bienvenido!</h2>
                <p id="modal-message" style="margin-bottom: 15px; font-size: 16px;">Para continuar, ingresa tu nombre:</p>
                <input type="text" id="user-name" placeholder="Tu Nombre" style="display: block; margin: 10px auto; padding: 10px; width: 80%; border-radius: 5px; border: 1px solid #ccc; font-size: 14px;">
                <button id="submit-info" style="background: #333; color: white; padding: 10px 15px; border: none; cursor: pointer; border-radius: 8px; font-size: 16px;">Continuar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("submit-info").addEventListener("click", function () {
        const name = document.getElementById("user-name").value.trim();

        if (name) {
            localStorage.setItem("userName", name);
            document.getElementById("modal-message").textContent = `¡Bienvenido, ${name}!`;
            document.getElementById("user-name").style.display = "none";
            document.getElementById("submit-info").textContent = "Ingresar";
            document.getElementById("submit-info").addEventListener("click", function () {
                document.getElementById("modal-overlay").remove();
                document.body.style.pointerEvents = "auto";
                document.body.style.overflow = "auto";
            });
        } else {
            alert("Por favor, ingresa tu nombre");
        }
    });

    let visitData = localStorage.getItem("visitData") || "{}";
    visitData = JSON.parse(visitData);

    if (!visitData.week) {
        visitData = { week: new Date().toISOString().slice(0, 10), visits: [] };
    }

    let userIP = "Desconocida";
    try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        userIP = data.ip;
    } catch (error) {
        console.error("Error obteniendo la IP", error);
    }

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            let endTime = Date.now();
            let timeSpent = Math.round((endTime - startTime) / 1000);
            let formattedTime = new Date(timeSpent * 1000).toISOString().substr(11, 8);

            const visitInfo = {
                name: localStorage.getItem("userName") || "No proporcionado",
                ip: userIP,
                timeSpent: formattedTime,
                pagesVisited: sessionStorage.getItem("pagesVisited") || [],
                cvDownloads: sessionStorage.getItem("cvDownloads") || 0,
                githubVisits: sessionStorage.getItem("githubVisits") || 0
            };

            visitData.visits.push(visitInfo);
            localStorage.setItem("visitData", JSON.stringify(visitData));
        }
    });

    setTimeout(sendWeeklyReport, 3000);
});

function sendWeeklyReport() {
    let visitData = localStorage.getItem("visitData");
    if (!visitData) return;
    visitData = JSON.parse(visitData);

    const markdownMessage = generarMensajeMarkdown(visitData);

    fetch("https://formsubmit.co/ajax/maurifl@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Reporte Diario de Visitas",
            email: "maurifl@gmail.com",
            message: markdownMessage
        })
    })
    .then(response => response.json())
    .then(data => console.log("Email enviado:", data))
    .catch(error => console.error("Error enviando email:", error));
}

function generarMensajeMarkdown(visitData) {
    let totalVisits = visitData.visits.length;
    let totalTime = visitData.visits.reduce((acc, visit) => {
        return acc + (visit.timeSpent.split(":").reduce((acc, time) => (60 * acc) + +time, 0));
    }, 0);
    let avgTime = new Date(totalTime * 1000).toISOString().substr(11, 8);

    let message = `### 📊 REPORTE DIARIO\n\n`;
    message += `👥 Total de visitas: ${totalVisits}\n`;
    message += `⏱️ Tiempo promedio de navegación: ${avgTime}\n\n---\n`;

    visitData.visits.forEach((visit, index) => {
        message += `##### #️⃣ Visita ${index + 1}\n`;
        message += `- 👤 Nombre: ${visit.name}\n`;
        message += `- 🌐 IP: ${visit.ip}\n`;
        message += `- ⏳ Tiempo de navegación: ${visit.timeSpent}\n`;
        message += `- 📄 Páginas visitadas: ${visit.pagesVisited}\n`;
        message += `- 📅 Descargas CV: ${visit.cvDownloads}\n`;
        message += `- 💻 Visitas a GitHub: ${visit.githubVisits}\n\n---\n`;
    });

    return message;
}












// document.addEventListener("DOMContentLoaded", async function () {
//     const today = new Date().toLocaleDateString();
//     let startTime = Date.now();
    
//     document.body.style.pointerEvents = "none";
//     document.body.style.overflow = "hidden";
    
//     const modal = document.createElement("div");
//     modal.innerHTML = `
//         <input type="hidden" name="ubicacion" id="ubicacion">
//         <div id="modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 9999; pointer-events: auto;">
//             <div id="modal-content" style="background: white; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3); pointer-events: auto; font-family: 'Montserrat-SemiBold', sans-serif;">
//                 <h2 style="margin-bottom: 10px; font-size: 22px;">¡Bienvenido!</h2>
//                 <p id="modal-message" style="margin-bottom: 15px; font-size: 16px;">Para continuar, ingresa tu nombre:</p>
//                 <input type="text" id="user-name" placeholder="Tu Nombre" style="display: block; margin: 10px auto; padding: 10px; width: 80%; border-radius: 5px; border: 1px solid #ccc; font-size: 14px;">
//                 <button id="submit-info" style="background: #333; color: white; padding: 10px 15px; border: none; cursor: pointer; border-radius: 8px; font-size: 16px;">Continuar</button>
//             </div>
//         </div>
//     `;
//     document.body.appendChild(modal);
    
//     document.getElementById("submit-info").addEventListener("click", function () {
//         const name = document.getElementById("user-name").value.trim();
        
//         if (name) {
//             localStorage.setItem("userName", name);
//             document.getElementById("modal-message").textContent = `¡Bienvenido, ${name}!`;
//             document.getElementById("user-name").style.display = "none";
//             document.getElementById("submit-info").textContent = "Ingresar";
//             document.getElementById("submit-info").addEventListener("click", function () {
//                 document.getElementById("modal-overlay").remove();
//                 document.body.style.pointerEvents = "auto";
//                 document.body.style.overflow = "auto";
//             });
//         } else {
//             alert("Por favor, ingresa tu nombre");
//         }
//     });
    
//     let visitData = localStorage.getItem("visitData") || "{}";
//     visitData = JSON.parse(visitData);
    
//     if (!visitData.week) {
//         visitData = { week: new Date().toISOString().slice(0, 10), visits: [] };
//     }
    
//     let userIP = "Desconocida";
//     try {
//         const response = await fetch("https://api64.ipify.org?format=json");
//         const data = await response.json();
//         userIP = data.ip;
//     } catch (error) {
//         console.error("Error obteniendo la IP", error);
//     }
    
//     document.addEventListener("visibilitychange", function () {
//         if (document.hidden) {
//             let endTime = Date.now();
//             let timeSpent = Math.round((endTime - startTime) / 1000);
//             let formattedTime = new Date(timeSpent * 1000).toISOString().substr(11, 8);
            
//             const visitInfo = {
//                 name: localStorage.getItem("userName") || "No proporcionado",
//                 ip: userIP,
//                 timeSpent: formattedTime,
//                 pagesVisited: sessionStorage.getItem("pagesVisited") || [],
//                 cvDownloads: sessionStorage.getItem("cvDownloads") || 0,
//                 githubVisits: sessionStorage.getItem("githubVisits") || 0
//             };
//             visitData.visits.push(visitInfo);
//             localStorage.setItem("visitData", JSON.stringify(visitData));
//         }
//     });
    
//     setTimeout(sendWeeklyReport, 3000);
// });

// function sendWeeklyReport() {
//     let visitData = localStorage.getItem("visitData");
//     if (!visitData) return;
//     visitData = JSON.parse(visitData);
    
//     let totalVisits = visitData.visits.length;
//     let totalTime = visitData.visits.reduce((acc, visit) => acc + (visit.timeSpent.split(':').reduce((acc, time) => (60 * acc) + +time, 0)), 0);
//     let avgTime = new Date(totalTime * 1000).toISOString().substr(11, 8);
    
//     let message = `<h2>Reporte Semanal</h2>
//         <p>Total de visitas: ${totalVisits}</p>
//         <p>Tiempo promedio de navegación: ${avgTime}</p>
//         <table border="1" style="width:100%; text-align:left; border-collapse: collapse;">
//         <tr><th>Nombre</th><th>IP</th><th>Tiempo de Navegación</th><th>Páginas Visitadas</th><th>Descargas CV</th><th>Visitas GitHub</th></tr>`;
//     visitData.visits.forEach(visit => {
//         message += `<tr>
//             <td>${visit.name}</td>
//             <td>${visit.ip}</td>
//             <td>${visit.timeSpent}</td>
//             <td>${visit.pagesVisited}</td>
//             <td>${visit.cvDownloads}</td>
//             <td>${visit.githubVisits}</td>
//         </tr>`;
//     });
//     message += `</table>`;
    
//     fetch("https://formsubmit.co/ajax/maurifl@gmail.com", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             name: "Reporte Semanal de Visitas",
//             email: "maurifl@gmail.com", 
//             message: message
//         })
//     })
//     .then(response => response.json())
//     .then(data => console.log("Email enviado con el informe semanal:", data))
//     .catch(error => console.error("Error enviando email de reporte:", error));
// }