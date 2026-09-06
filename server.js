// Endpoint para solicitar o código de pareamento por número
app.get('/pairing-code', async (req, res) => {
  const phoneNumber = req.query.number; // Recebe o número via parâmetro URL

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Número de telefone é obrigatório' });
  }

  try {
    if (sock && !isConnected) {
      // Solicita o código de 8 dígitos para a API do Baileys
      const code = await sock.requestPairingCode(phoneNumber.replace(/\D/g, ''));
      res.json({ code: code });
    } else {
      res.json({ error: 'Instância já conectada ou indisponível' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Falha ao gerar código de pareamento' });
  }
});
