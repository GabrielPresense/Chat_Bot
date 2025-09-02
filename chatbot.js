// leitor de qr code
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');

// Configuração do cliente com autenticação local
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// serviço de leitura do qr code
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('QR Code gerado! Escaneie-o com seu WhatsApp.');
});

// evento de autenticação
client.on('authenticated', () => {
    console.log('Autenticado com sucesso!');
});

// evento de autenticação falha
client.on('auth_failure', (msg) => {
    console.error('Falha na autenticação:', msg);
});

// apos isso ele diz que foi tudo certo
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

// evento de desconexão
client.on('disconnected', (reason) => {
    console.log('Cliente desconectado:', reason);
});

// E inicializa tudo
client.initialize().catch(err => {
    console.error('Erro ao inicializar:', err);
});

const delay = ms => new Promise(res => setTimeout(res, ms));

// --- Centralizando as respostas ---
// Função para ler o arquivo de texto e retornar um array com as linhas
const lerArquivoTexto = (caminhoArquivo) => {
    try {
        const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8');
        return conteudo.split('\n').filter(linha => linha.trim()); // Remove linhas vazias
    } catch (error) {
        console.error('Erro ao ler o arquivo:', error);
        return null;
    }
};

// --- Função para enviar mensagens com delay ---
const enviarMensagensComDelay = async (chat, mensagens) => {
    for (const msg of mensagens) {
        await delay(2000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(chat.id._serialized, msg.trim());
    }
};

const respostas = {
    '1': [
        ''
    ],
    '2': [
        ''
    ],
    '3': [
        ''
    ],
    '4': [
        ''
    ],
    '5': [
        ''
    ]
};

client.on('message', async msg => {
    if (!msg.from.endsWith('@c.us')) {
        return;
    }

    const texto = msg.body.trim().toLowerCase();
    const chat = await msg.getChat();

    try {
        // Comando para enviar conteúdo do arquivo texto
        if (texto.startsWith('!enviar')) {
            const caminhoArquivo = texto.split(' ')[1]; // Pega o caminho do arquivo após o comando
            if (!caminhoArquivo) {
                await client.sendMessage(msg.from, 'Por favor, especifique o caminho do arquivo. Exemplo: !enviar C:/caminho/arquivo.txt');
                return;
            }

            const linhas = lerArquivoTexto(caminhoArquivo);
            if (linhas) {
                await enviarMensagensComDelay(chat, linhas);
            } else {
                await client.sendMessage(msg.from, 'Não foi possível ler o arquivo. Verifique se o caminho está correto.');
            }
            return;
        }

        // Resto do código original para o menu
        if (['menu', 'oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite'].includes(texto)) {
            const contact = await msg.getContact();
            const name = contact.pushname || 'Tudo bem?';
            
            const mensagemInicial = `Olá, ${name.split(" ")[0]}! Sou o assistente virtual da empresa tal. Como posso ajudá-lo hoje? Por favor, digite o número de uma das opções abaixo:\n\n1 - Como funciona\n2 - Valores dos planos\n3 - Benefícios\n4 - Como aderir\n5 - Outras perguntas`;
            
            await enviarMensagensComDelay(chat, [mensagemInicial]);
            return;
        }

        if (respostas[texto]) {
            await enviarMensagensComDelay(chat, respostas[texto]);
            return;
        }

    } catch (error) {
        console.error("Ocorreu um erro:", error);
    }
});