console.log("script.js funcionando");

function showTyping() {
    const indicator = document.getElementById("typing-indicator");
    indicator.classList.remove("hidden");
    indicator.classList.add("show");
}

function hideTyping() {
    const indicator = document.getElementById("typing-indicator");
    indicator.classList.remove("show");
    setTimeout(() => indicator.classList.add("hidden"), 200);
}

async function sendMessage() {
    let input = document.getElementById("user-input");
    let message = input.value.trim();
    if (message === "") return;

   
    addMessage(message, "user-message");
    input.value = "";

    
    const aiDiv = addMessage("", "ai-message");

  
    showTyping();

    try {
      
        const response = await fetch("http://localhost:3000/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

       

        // IA escribe palabra por palabra
        typeWriter(data.reply, aiDiv);

    } catch (error) {
        hideTyping();
        aiDiv.textContent = "Error: No se pudo conectar con el servidor.";
        console.error(error);
    }
}

function addMessage(text, className) {
    let box = document.getElementById("chat-box");
    let div = document.createElement("div");
    div.className = className;
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    return div; // devolvemos el div para editarlo después
}

// -----------------------------------------
// EFECTO DE ESCRITURA ESTILO CHATGPT
// -----------------------------------------
function typeWriter(text, element) {
    let words = text.split(" ");
    let i = 0;

    function typing() {
        if (i < words.length) {
            element.textContent += words[i] + " ";
            i++;
            setTimeout(typing, 15); // velocidad de escritura
        } else {
            hideTyping(); // termina cuando acaba de escribir
        }
    }

    typing();
}


// -----------------------------------------
// PERMITIR ENVIAR CON ENTER
// -----------------------------------------
document.getElementById("user-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // evita saltos de línea
        sendMessage();
    }
});

// -----------------------------------------
// GENERAR PDF REAL
// -----------------------------------------
document.getElementById("btn-pdf").addEventListener("click", generarPDF);

function generarPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    let titulo = "SOLICITUD DE ACLARACIÓN AL SAT";
    let contenido = `
Nombre completo: ____________________________
RFC: ____________________________
Fecha: ____________________________

Motivo de la aclaración:
__________________________________________________________
__________________________________________________________
__________________________________________________________

Declaro que la información proporcionada es verdadera y se presenta para su debido proceso.
        
Firma: ____________________________
    `;

    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(titulo, 20, 20);

    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(12);

    let lines = pdf.splitTextToSize(contenido, 170);
    pdf.text(lines, 20, 40);

    pdf.save("solicitud_aclaracion.pdf");
}
