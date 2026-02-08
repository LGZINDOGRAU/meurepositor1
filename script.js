const texto = "Você é a luz dos meus dias!";
let index = 0;

function escreverTexto() {
    if (index < texto.length) {
        document.getElementById("mensagem-subtitulo").innerHTML += texto.charAt(index);
        index++;
        setTimeout(escreverTexto, 100);
    }
}

// Inicia a digitação ao carregar
window.onload = escreverTexto;

// Efeito de partículas/flores ao clicar
document.getElementById('btnMagico').addEventListener('click', function() {
    for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.innerHTML = '🌸';
        p.className = 'particula';
        p.style.position = 'fixed';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = '100vh';
        p.style.fontSize = (Math.random() * 20 + 10) + 'px';
        p.style.zIndex = '1000';
        p.style.transition = 'all 3s ease-out';
        
        document.body.appendChild(p);

        setTimeout(() => {
            p.style.transform = `translateY(-110vh) translateX(${Math.random() * 200 - 100}px) rotate(720deg)`;
            p.style.opacity = '0';
        }, 50);

        setTimeout(() => p.remove(), 3000);
    }
    alert("Você acaba de ganhar uma chuva de carinho! 💖");
});
