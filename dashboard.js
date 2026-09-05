// Função para simular a conexão do WhatsApp
function conectarWhatsapp() {
  const statusElem = document.getElementById('wp-status');
  
  // Exibe mensagem de carregamento
  statusElem.textContent = "Gerando QR Code...";
  statusElem.className = "status online";
  statusElem.style.background = "rgba(234, 179, 8, 0.2)";
  statusElem.style.color = "#facc15";

  setTimeout(() => {
    statusElem.textContent = "Conectado";
    statusElem.className = "status online";
    statusElem.style.background = "rgba(34, 197, 94, 0.2)";
    statusElem.style.color = "#4ade80";
    
    adicionarLog("WhatsApp", "Sessão iniciada via QR Code com sucesso.");
  }, 2000);
}

// Função para configurar o Prompt do Agente de IA
function configurarIA() {
  const novoPrompt = prompt("Digite as instruções para a IA (ex: 'Responda como um atendente amigável'):");
  
  if (novoPrompt && novoPrompt.trim() !== "") {
    alert("Prompt da IA atualizado com sucesso!");
    adicionarLog("Agente IA", `Novo prompt definido: "${novoPrompt.substring(0, 30)}..."`);
  }
}

// Função para adicionar novos registros na lista de automações em tempo real
function adicionarLog(origem, mensagem) {
  const logList = document.getElementById('logList');
  const novoItem = document.createElement('li');
  
  novoItem.innerHTML = `<span>${origem}:</span> ${mensagem}`;
  logList.insertBefore(novoItem, logList.firstChild);
}
// Função para encerrar a sessão
function fazerLogout() {
  if (confirm("Tem certeza que deseja sair?")) {
    window.location.href = 'index.html';
  }
}
