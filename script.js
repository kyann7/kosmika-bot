// 1. Cria os cards visualmente
const heroDiv = document.querySelector('.hero');
const statusGroup = document.createElement('div');
statusGroup.className = 'status-wrapper';

statusGroup.innerHTML = `
  <div class="status-card">
    <span>Servidores</span>
    <h3 id="servidores-real">50+</h3>
  </div>
  <div class="status-card">
    <span>Membros Suporte</span>
    <h3 id="membros-real">...</h3>
  </div>
  <div class="status-card">
    <span>Status</span>
    <h3><span class="online-indicator"></span>Online</h3>
  </div>
`;

if(heroDiv) {
    heroDiv.appendChild(statusGroup);
}

// 2. Busca os dados REAIS (Agora que o Widget está ON)
async function atualizarDadosKosmika() {
    const SEU_GUILD_ID = "931659654369513542"; 
    
    try {
        const response = await fetch(`https://discord.com/api/guilds/${SEU_GUILD_ID}/widget.json`);
        
        if (!response.ok) throw new Error("Widget não respondeu");

        const data = await response.json();

        // Atualiza Membros Online (presence_count)
        if (data && data.presence_count !== undefined) {
            document.getElementById('membros-real').innerText = data.presence_count;
        }

        // Atualiza Servidores (Mude o "50+" aqui manualmente quando o bot crescer)
        document.getElementById('servidores-real').innerText = "50+";

    } catch (err) {
        console.log("Aguardando sincronização do Widget...");
        // Se falhar (ex: internet oscilar), mostra um valor padrão para não ficar vazio
        if(document.getElementById('membros-real').innerText === "...") {
            document.getElementById('membros-real').innerText = "150+";
        }
    }
}

// Executa assim que o site abre
atualizarDadosKosmika();

// Atualiza a cada 30 segundos (Tempo Real)
setInterval(atualizarDadosKosmika, 30000);
