const express = require('express');
const cors = require('cors');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

let qrCodeImage = null;
let isConnected = false;
let sock = null;

async function connectToWhatsApp() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
        
        sock = makeWASocket({
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
        console.error("Erro na conexão:", err);
    }
}

connectToWhatsApp();

app.get('/', (req, res) => {
    res.send('API WhatsApp rodando!');
});

app.get('/qr', (req, res) => {
    res.json({ qr: qrCodeImage, connected: isConnected });
});

// Rota para gerar código de pareamento por telefone
app.get('/pairing-code', async (req, res) => {
    const phoneNumber = req.query.number;

    if (!phoneNumber) {
        return res.status(400).json({ error: 'Número não fornecido' });
    }

    try {
        if (sock && !isConnected) {
            const cleanNumber = phoneNumber.replace(/\D/g, '');
            const code = await sock.requestPairingCode(cleanNumber);
            return res.json({ code: code });
        } else {
            return res.json({ error: 'Instância indisponível ou já conectada' });
        }
    } catch (err) {
        console.error("Erro ao gerar pairing code:", err);
        return res.status(500).json({ error: 'Falha ao gerar código de pareamento' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
