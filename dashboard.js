const API_URL = 'https://automacao-ia-glass.onrender.com';
let intervalQR = null;

// ==========================================
// 1. CONEXÃO E GERENCIAMENTO WHATSAPP
// ==========================================

async function conectarWhatsapp() {
  const modal = document.getElementById('qrModal');
  const qrImage = document.getElementById('qrImage');
  const qrLoading = document.getElementById('qrLoading');
  const codeDisplay = document.getElementById('pairingCodeDisplay');

  if (!modal) return;

  modal.style.display = 'flex';
  qrLoading.textContent = "Buscando dados do servidor Render...";
  qrLoading.style.display = 'block';
  qrImage.style.display = 'none';
  if (codeDisplay) codeDisplay.style.display = 'none';

  async function checarStatus() {
    try {
      const response = await fetch(`${API_URL}/qr`);
      const data = await response.json();

      if (data.connected) {
        atualizarStatusWhatsapp(true);
        fecharModalQR();
      } else if (data.qr) {
        qrLoading.style.display = 'none';
        qrImage.src = data.qr;
        qrImage.style.display = 'block';
      }
    } catch (err) {
      qrLoading.textContent = "Aguardando inicialização do servidor...";
    }
  }

  checarStatus();
  if (intervalQR) clearInterval(intervalQR);
  intervalQR = setInterval(checarStatus, 3000);
}

// Gerar Código de Pareamento por Telefone
async function gerarCodigoPareamento() {
  const phoneInput = document.getElementById('phoneInput');
  const codeDisplay = document.getElementById('pairingCodeDisplay');
  if (!phoneInput || !codeDisplay) return;

  let phone = phoneInput.value.replace(/\D/g, ''); // Remove não dígitos

  if (!phone || phone.length < 10) {
    alert("Digite um número válido com DDD (ex: 71993181776).");
    return;
  }

  // Adiciona o DDI 55 (Brasil) automaticamente se não presente
  if (!phone.startsWith('55') && (phone.length === 10 || phone.length === 11)) {
    phone = '55' + phone;
  }

  codeDisplay.style.display = 'block';
  codeDisplay.textContent = "Gerando código...";

  try {
    const response = await fetch(`${API_URL}/pairing-code?number=${phone}`);
    const data = await response.json();

    if (data.code) {
      codeDisplay.textContent = `CÓDIGO: ${data.code}`;
      adicionarLog("WhatsApp", `Código de pareamento gerado para +${phone}`);
    } else {
      codeDisplay.textContent = data.error || "Erro ao gerar código.";
    }
  } catch (err) {
    console.error("Erro na comunicação:", err);
    codeDisplay.textContent = "Erro na comunicação com o servidor.";
  }
}

// Desconectar Sessão do WhatsApp
async function desconectarWhatsapp() {
  if (!confirm("Deseja realmente desconectar a sessão do WhatsApp?")) return;

  try {
    const response = await fetch(`${API_URL}/logout`, { method: 'POST' });
    const data = await response.json();

    if (data.success) {
      atualizarStatusWhatsapp(false);
      adicionarLog("WhatsApp", "Sessão desconectada pelo usuário.");
      alert("WhatsApp desconectado com sucesso.");
    } else {
      alert("Erro ao desconectar sessão.");
    }
  } catch (err) {
    // Atualização local de fallback caso o endpoint não responda
    atualizarStatusWhatsapp(false);
    adicionarLog("WhatsApp", "Sessão desconectada.");
  }
}

function atualizarStatusWhatsapp(online) {
  const statusElem = document.getElementById('wp-status');
  const btnElem = document.getElementById('wp-btn');

  if (statusElem) {
    if (online) {
      statusElem.textContent = "Conectado";
      statusElem.className = "status online";
      statusElem.style.background = "rgba(34, 197, 94, 0.2)";
      statusElem.style.color = "#4ade80";
    } else {
      statusElem.textContent = "Desconectado";
      statusElem.className = "status offline";
      statusElem.style.background = "rgba(239, 68, 68, 0.2)";
      statusElem.style.color = "#f87171";
    }
  }

  if (btnElem) {
    if (online) {
      btnElem.textContent = "Desconectar";
      btnElem.onclick = desconectarWhatsapp;
      btnElem.style.background = "rgba(239, 68, 68, 0.3)";
      btnElem.style.borderColor = "rgba(239, 68, 68, 0.5)";
    } else {
      btnElem.textContent = "Conectar WhatsApp";
      btnElem.onclick = conectarWhatsapp;
      btnElem.style.background = "";
      btnElem.style.borderColor = "";
    }
  }
}

function fecharModalQR() {
  const modal = document.getElementById('qrModal');
  if (modal) modal.style.display = 'none';
  if (intervalQR) clearInterval(intervalQR);
}

// ==========================================
// 2. CONFIGURAÇÕES DA IA E OUTRAS INTEGRACÕES
// ==========================================

function configurarIA() {
  const promptAtual = localStorage.getItem('shruhh_ia_prompt') || "Responda como um assistente atencioso e profissional.";
  const novoPrompt = prompt("Ajuste as instruções do Agente de IA:", promptAtual);

  if (novoPrompt !== null && novoPrompt.trim() !== "") {
    localStorage.setItem('shruhh_ia_prompt', novoPrompt.trim());
    alert("Prompt do Agente de IA salvo com sucesso!");
    adicionarLog("Agente IA", `Prompt atualizado: "${novoPrompt.trim().substring(0, 30)}..."`);
  }
}

function alternarInstagram() {
  const statusElem = document.getElementById('insta-status');
  const btnElem = document.getElementById('insta-btn');

  if (!statusElem || !btnElem) return;

  const estaConectado = statusElem.classList.contains('online');

  if (estaConectado) {
    if (confirm("Deseja desvincular a conta do Instagram?")) {
      statusElem.textContent = "Desconectado";
      statusElem.className = "status offline";
      statusElem.style.background = "rgba(239, 68, 68, 0.2)";
      statusElem.style.color = "#f87171";
      btnElem.textContent = "Conectar Instagram";
      adicionarLog("Instagram", "Conta desvinculada.");
    }
  } else {
    statusElem.textContent = "Conectado";
    statusElem.className = "status online";
    statusElem.style.background = "rgba(34, 197, 94, 0.2)";
    statusElem.style.color = "#4ade80";
    btnElem.textContent = "Desconectar";
    adicionarLog("Instagram", "Conta do Instagram vinculada com sucesso.");
  }
}

// ==========================================
// 3. LOGS E SISTEMA
// ==========================================

function adicionarLog(origem, mensagem) {
  const logList = document.getElementById('logList');
  if (logList) {
    const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const novoItem = document.createElement('li');
    novoItem.innerHTML = `<small style="color: #888;">[${hora}]</small> <strong style="color: #c084fc;">${origem}:</strong> ${mensagem}`;
    logList.insertBefore(novoItem, logList.firstChild);
  }
}

function limparLogs() {
  const logList = document.getElementById('logList');
  if (logList) {
    logList.innerHTML = '<li><span>Sistema:</span> Histórico limpo.</li>';
  }
}

function fazerLogout() {
  if (confirm("Tem certeza que deseja encerrar a sessão?")) {
    window.location.href = 'index.html';
  }
}

// Checagem inicial de status ao carregar o painel
window.addEventListener('DOMContentLoaded', () => {
  fetch(`${API_URL}/qr`)
    .then(res => res.json())
    .then(data => {
      if (data.connected) {
        atualizarStatusWhatsapp(true);
        adicionarLog("WhatsApp", "Sessão ativa detectada no servidor.");
      }
    })
    .catch(() => {
      adicionarLog("Sistema", "Servidor inicializado.");
    });
});
// Endpoint para desconectar / encerrar a sessão ativa do Baileys
app.post('/logout', async (req, res) => {
    try {
        if (sock) {
            await sock.logout();
            isConnected = false;
            qrCodeImage = null;
            return res.json({ success: true, message: 'Sessão encerrada com sucesso' });
        }
        res.json({ success: true, message: 'Nenhuma sessão ativa encontrada' });
    } catch (err) {
        console.error("Erro ao encerrar sessão:", err);
        res.status(500).json({ error: 'Erro ao desconectar sessão' });
    }
});
