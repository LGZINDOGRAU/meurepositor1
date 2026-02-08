document.getElementById('botaoSurpresa').addEventListener('click', function() {
    for (let i = 0; i < 30; i++) {
        criarEmoji();
    }
});

function criarEmoji() {
    const emoji = document.createElement('div');
    emoji.innerText = '⭐'; // Pode trocar por ✨, 💖, 🌸
    emoji.style.position = 'fixed';
    emoji.style.left = Math.random() * 100 + 'vw';
    emoji.style.top = '110vh';
    emoji.style.fontSize = Math.random() * 20 + 20 + 'px';
    emoji.style.transition = 'transform 2s linear';
    
    document.body.appendChild(emoji);

    // Animação de subir
    setTimeout(() => {
        emoji.style.transform = `translateY(-120vh) rotate(${Math.random() * 360}deg)`;
        emoji.style.opacity = '0';
    }, 100);

    // Limpar o emoji da tela
    setTimeout(() => { emoji.remove(); }, 2000);
}
