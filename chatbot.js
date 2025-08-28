// leitor de qr code
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const client = new Client();

// serviço de leitura do qr code
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// apos isso ele diz que foi tudo certo
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

// E inicializa tudo
client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms));

// --- Centralizando as respostas ---
// Armazenamos todas as respostas em um objeto. Fica mais fácil de editar
const respostas = {
    '1': [
        'Nosso serviço oferece consultas médicas 24 horas por dia, 7 dias por semana, diretamente pelo WhatsApp.\n\nNão há carência, o que significa que você pode começar a usar nossos serviços imediatamente após a adesão.\n\nOferecemos atendimento médico ilimitado, receitas\n\nAlém disso, temos uma ampla gama de benefícios, incluindo acesso a cursos gratuitos',
        'COMO FUNCIONA?\nÉ muito simples.\n\n1º Passo\nFaça seu cadastro e escolha o plano que desejar.\n\n2º Passo\nApós efetuar o pagamento do plano escolhido você já terá acesso a nossa área exclusiva para começar seu atendimento na mesma hora.\n\n3º Passo\nSempre que precisar',
        'Link para cadastro: https://site.com'
    ],
    '2': [
        '*Plano Individual:* R$22,50 por mês.\n\n*Plano Família:* R$39,90 por mês, inclui você mais 3 dependentes.\n\n*Plano TOP Individual:* R$42,50 por mês, com benefícios adicionais como\n\n*Plano TOP Família:* R$79,90 por mês, inclui você mais 3 dependentes',
        'Link para cadastro: https://site.com'
    ],
    '3': [
        'Sorteio de em prêmios todo ano.\n\nAtendimento médico ilimitado 24h por dia.\n\nReceitas de medicamentos',
        'Link para cadastro: https://site.com'
    ],
    '4': [
        'Você pode aderir aos nossos planos diretamente pelo nosso site ou pelo WhatsApp.\n\nApós a adesão, você terá acesso imediato',
        'Link para cadastro: https://site.com'
    ],
    '5': [
        'Se você tiver outras dúvidas ou precisar de mais informações, por favor, fale aqui nesse whatsapp ou visite nosso site: https://site.com'
    ]
};

// --- Função para evitar repetição de código ---
// Esta função envia as mensagens com delay e simulação de digitação.
const enviarMensagensComDelay = async (chat, mensagens) => {
    for (const msg of mensagens) {
        await delay(2000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(chat.id._serialized, msg);
    }
};

client.on('message', async msg => {
    // Ignora mensagens que não são de usuários (ex: de grupos)
    if (!msg.from.endsWith('@c.us')) {
        return;
    }

    const texto = msg.body.trim().toLowerCase();
    const chat = await msg.getChat();

    // --- Estrutura Lógica mais Limpa ---
    try {
        // Bloco 1: Palavras-chave para iniciar a conversa
        if (['menu', 'oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite'].includes(texto)) {
            const contact = await msg.getContact();
            const name = contact.pushname || 'Tudo bem?'; // Fallback caso não tenha nome
            
            const mensagemInicial = `Olá, ${name.split(" ")[0]}! Sou o assistente virtual da empresa tal. Como posso ajudá-lo hoje? Por favor, digite o número de uma das opções abaixo:\n\n1 - Como funciona\n2 - Valores dos planos\n3 - Benefícios\n4 - Como aderir\n5 - Outras perguntas`;
            
            await enviarMensagensComDelay(chat, [mensagemInicial]);
            return; // Encerra aqui para não processar as outras opções
        }

        // Bloco 2: Respostas baseadas na escolha do menu
        // Verifica se a mensagem (texto) é uma das chaves do nosso objeto 'respostas'
        if (respostas[texto]) {
            await enviarMensagensComDelay(chat, respostas[texto]);
            return;
        }

    } catch (error) {
        console.error("Ocorreu um erro:", error);
        // Opcional: Enviar uma mensagem de erro para o usuário
        // await client.sendMessage(msg.from, "Ops! Ocorreu um erro. Tente novamente mais tarde.");
    }
});