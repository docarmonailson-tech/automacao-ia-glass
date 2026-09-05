const express = require('express');
const cors = require('cors');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');

const app = express();
app.use(cors());

// Define a porta dinâmica enviada pelo Render ou 3000 como fallback
const PORT = process.env.PORT || 3000;

let qrCodeImage = null;
let isConnected = false;

async function connectToWhatsApp() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
        
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                qrCodeImage = await QRCode.toDataURL(qr);
            }

            if (connection === 'close') {
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                isConnected = false;
                qrCodeImage = null;
                if (shouldReconnect) {
                    connectToWhatsApp();
                }
            } else if (connection === 'open') {
                isConnected = true;
                qrCodeImage = null;
                console.log('WhatsApp Conectado com sucesso!');
            }
        });
    } catch (err) {
        console.error("Erro na conexão com WhatsApp:", err);
    }
}

// Inicia a tentativa de conexão
connectToWhatsApp();

// Endpoint de teste de saúde da aplicação
app.get('/', (req, res) => {
    res.send('API WhatsApp rodando com sucesso!');
});

// Endpoint para buscar status/QR Code
app.get('/qr', (req, res) => {
    res.json({ qr: qrCodeImage, connected: isConnected });
});

// Mantém o servidor rodando e ouvindo na porta informada pelo Render
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
