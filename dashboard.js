const API_URL = 'https://automacao-ia-glass.onrender.com';
let intervalQR = null;

// Abrir modal de conexão
async function conectarWhatsapp() {
  const modal = document.getElementById('qrModal');
  const qrImage = document.getElementById('qrImage');
  const qrLoading = document.getElementById('qrLoading');
  const codeDisplay = document.getElementById('pairingCodeDisplay');

  modal.style.display = 'flex';
  qrLoading.textContent = "Buscando dados do servidor...";
  qrLoading.style.display = 'block';
  qrImage.style.display = 'none';
  codeDisplay.style.display = 'none';

  async function checarStatus() {
    try {
      const response = await fetch(`${API_URL}/qr`);
      const data = await response.json();

      if (data.connected) {
        const statusElem = document.getElementById('wp-status');
        statusElem.textContent = "Conectado";
        statusElem.className = "status online";
        statusElem.style.background = "rgba(34, 197, 94, 0.2)";
        statusElem.style.color = "#4ade80";
        
        fecharModalQR();
        adicionarLog("WhatsApp", "Sessão conectada com sucesso!");
      } else if (data.qr) {
        qrLoading.style.display = 'none';
        qrImage.src = data.qr;
        qrImage.style.display = 'block';
      }
    } catch (err) {
      qrLoading.textContent = "Aguardando backend inicializar...";
    }
  }

  checarStatus();
  intervalQR = setInterval(checarStatus, 3000);
}

// Gerar Código por Número de Telefone
async function gerarCodigoPareamento() {
  const phoneInput = document.getElementById('phoneInput');
  const codeDisplay = document.getElementById('pairingCodeDisplay');
  const phone = phoneInput.value.trim();

  if (!phone) {
    alert("Digite o número completo com DDD (ex: 5511999999999).");
    return;
  }

  codeDisplay.style.display = 'block';
  codeDisplay.textContent = "Gerando código...";

  try {
    const response = await fetch(`${API_URL}/pairing-code?number=${phone}`);
    const data = await response.json();

    if (data.code) {
      codeDisplay.textContent = `CÓDIGO: ${data.code}`;
      adicionarLog("WhatsApp", `Código gerado para o número ${phone}`);
    } else {
      codeDisplay.textContent = data.error || "Erro ao gerar código.";
    }
  } catch (err) {
    codeDisplay.textContent = "Erro na comunicação com o servidor.";
  }
}

// Fechar Modal
function fecharModalQR() {
  const modal = document.getElementById('qrModal');
  if (modal) modal.style.display = 'none';
  if (intervalQR) {
    clearInterval(intervalQR);
  }
}

// Configuração do Prompt da IA
function configurarIA() {
  const novoPrompt = prompt("Digite as instruções para a IA:");
  if (novoPrompt && novoPrompt.trim() !== "") {
    alert("Prompt da IA atualizado!");
    adicionarLog("Agente IA", `Novo prompt: "${novoPrompt.substring(0, 25)}..."`);
  }
}

// Histórico de Logs
function adicionarLog(origem, mensagem) {
  const logList = document.getElementById('logList');
  if (logList) {
    const novoItem = document.createElement('li');
    novoItem.innerHTML = `<span>${origem}:</span> ${mensagem}`;
    logList.insertBefore(novoItem, logList.firstChild);
  }
}

// Logout
function fazerLogout() {
  if (confirm("Tem certeza que deseja sair?")) {
    window.location.href = 'index.html';
  }
}
