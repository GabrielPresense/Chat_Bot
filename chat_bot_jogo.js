const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

const client = new Client({
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ],
    }
});

// Mensagem de tutorial
const MENSAGEM_TUTORIAL = `*--- Como Jogar ---*

Vou te guiar por uma história de matemática e você fará as contas de cabeça.

A cada etapa, sua única tarefa é me responder com algo simples como *'ok'*, *'pronto'*, *'sim'* ou *'feito'* para que possamos avançar para o próximo passo.

Voce pode saair a qualquer momento digitando uma destas palavras: *sair*, *cancelar*, *parar*, ou *exit*.

É tudo de cabeça, não precisa me dizer nenhum número! Vamos começar? 👇`;


// --- PALAVRAS-CHAVE PARA SAIR DO JOGO ---
const palavrasSair = ['sair', 'cancelar', 'parar', 'chega', 'exit'];


// Biblioteca de histórias
const historias = [
    {
        nome: "Aventura Pirata",
        inicio: "Olá, marujo! 👋\n\nVamos caçar um tesouro com a matemática! Sou o Capitão Barba-Bot e vou adivinhar o seu saque.\n\nPense em quantas *moedas de ouro* você tem no seu baú (um número qualquer).\n\nQuando estiver pronto, diga *sim, capitão!',ou 'ok' *",
        passo1: "Excelente! Você encontrou um mapa do tesouro que *dobrou* suas moedas! Multiplique seu ouro por 2.\n\nMe avise quando terminar.",
        passo2: "Pela sua bravura, eu, o Capitão, te presenteio com mais *${numeroMagico} moedas de ouro* do meu tesouro pessoal! Some isso ao seu total.\n\nMe diga 'ok' quando somar.",
        passo3: "Agora temos muito ouro! Divida todo o tesouro em duas partes iguais: uma para você e outra para seu fiel papagaio.\n\nMe avise quando dividir.",
        passo4: "Para finalizar, você precisa pagar pela diversão na taverna. Gaste exatamente a *quantidade inicial* de moedas que você tinha no baú.\n\nQuando terminar, me mande um 'ok' para eu revelar seu tesouro!",
        revelacao: "Deixa eu consultar meus mapas... 🗺️\n\nA quantidade de moedas de ouro que sobrou no seu baú é... *${resultadoFinal}*!\n\nAcertei, marujo? 😎"
    },
    {
        nome: "Missão Espacial",
        inicio: "Saudações, Comandante! 🚀\n\nNossa missão é calcular a energia para um salto hiperespacial. Vou adivinhar sua reserva final.\n\nPense em quantos *cristais de energia* você tem (um número qualquer).\n\nQuando estiver pronto, me diga *'ok, computador'*",
        passo1: "Ótimo! Atravessamos uma nebulosa que *duplicou* seus cristais de energia! Multiplique seus cristais por 2.\n\nMe avise quando terminar.",
        passo2: "Uma nave alienígena amigável nos contatou! Como presente, eles nos deram mais *${numeroMagico} cristais de energia*! Some ao seu total.\n\nMe diga 'ok' quando somar.",
        passo3: "Para balancear os motores, divida toda a energia em *dois núcleos de força* iguais.\n\nMe avise quando dividir.",
        passo4: "Agora, para ativar o motor de dobra, use a *quantidade inicial* de cristais que você tinha para a ignição.\n\nQuando terminar, me mande um 'ok' para eu revelar a energia reserva!",
        revelacao: "Calculando... 🤖\n\nA energia reserva que sobrou nos seus cristais é... *${resultadoFinal}*!\n\nCálculo correto, Comandante? 😎"
    },
    {
        nome: "Poção do Mago",
        inicio: "Saudações, jovem aprendiz! 🧙‍♂️\n\nVamos preparar uma poção poderosa e eu vou adivinhar a magia que irá sobrar.\n\nPense em quantos *ingredientes mágicos* você tem no seu caldeirão (um número qualquer).\n\nQuando estiver pronto, me diga *'sim, mestre', ou 'ok' *",
        passo1: "Perfeito! Você lançou um feitiço de multiplicação que *dobrou* seus ingredientes! Multiplique-os por 2.\n\nMe avise quando terminar.",
        passo2: "Impressionante! Eu, o Arquimago, vou ajudar adicionando mais *${numeroMagico} ingredientes raros* ao seu caldeirão! Some ao seu total.\n\nMe diga 'ok' quando somar.",
        passo3: "A receita exige equilíbrio. Divida a poção igualmente em *dois frascos* idênticos.\n\nMe avise quando dividir.",
        passo4: "Para a magia se estabilizar, a poção precisa consumir a *quantidade inicial* de ingredientes que você usou. Subtraia esse valor.\n\nQuando terminar, me mande um 'ok' para eu revelar o poder final!",
        revelacao: "Vejo nas minhas visões... ✨\n\nA quantidade de magia que sobrou na sua poção é... *${resultadoFinal}*!\n\nMinha magia é infalível? 😎"
    },
    {
        nome: "Receita Maluca",
        inicio: "Olá, Chef! 🍳\n\nVamos cozinhar um prato misterioso e vou adivinhar o ingrediente secreto que sobrará.\n\nPense em quantos *grãos de arroz* você vai usar (um número qualquer).\n\nQuando estiver pronto, diga *'sim, chef!', ou 'ok' *",
        passo1: "Excelente escolha! Uma chuva de meteoros de tempero *dobrou* a quantidade de arroz na sua panela! Multiplique por 2.\n\nMe avise quando terminar.",
        passo2: "Para dar um sabor especial, eu vou adicionar *${numeroMagico} gotas de molho secreto* à sua receita! Some isso ao seu total.\n\nMe diga 'ok' quando somar.",
        passo3: "A receita é para duas pessoas. Divida a porção igualmente em *dois pratos*.\n\nMe avise quando dividir.",
        passo4: "Hmm, um pouco salgado! Para corrigir, retire a *quantidade inicial* de grãos de arroz que você pensou primeiro.\n\nQuando terminar, me mande um 'ok' para eu revelar o ingrediente final!",
        revelacao: "Deixa eu provar com minha colher... 🥄\n\nA quantidade de ingrediente secreto que sobrou no prato é... *${resultadoFinal}*!\n\nUma delícia, não? 😎"
    },
    {
        nome: "Detetive de Enigmas",
        inicio: "Olá, Detetive! 🕵️\n\nTemos um caso a resolver com a ajuda dos números. Vou descobrir a pista final que você encontrar.\n\nPense em quantas *pistas* você já coletou (um número qualquer).\n\nQuando estiver pronto, me diga *'caso em andamento', ou 'ok' *",
        passo1: "Ótimo! Você encontrou um informante que *dobrou* o número de pistas que você tinha! Multiplique suas pistas por 2.\n\nMe avise quando terminar.",
        passo2: "Eu sou seu parceiro misterioso. Estou te entregando um envelope com mais *${numeroMagico} pistas* cruciais! Adicione ao seu total.\n\nMe diga 'ok' quando somar.",
        passo3: "Para analisar tudo, divida as pistas em *dois quadros de investigação* diferentes.\n\nMe avise quando dividir.",
        passo4: "Algumas pistas eram falsas! Descarte a *quantidade inicial* de pistas que você tinha no começo.\n\nQuando terminar, me mande um 'ok' para eu revelar a pista final!",
        revelacao: "Analisando as evidências... 🔎\n\nO número da pista final que resolve o caso é... *${resultadoFinal}*!\n\nElementar, meu caro Watson? 😎"
    },
    {
        nome: "Desafio na Academia",
        inicio: "E aí, marombeiro(a)?! 💪\n\nHoje o treino é de matemática mental! Vou adivinhar o peso final no seu supino.\n\nPense em quantos *quilos* você levantou no primeiro exercício (um número qualquer).\n\nQuando estiver pronto, diga *'bora treinar!', ou 'ok' *",
        passo1: "Isso! Agora você está aquecido! Para a próxima série, você vai levantar o *dobro* do peso! Multiplique seus quilos por 2.\n\nMe avise quando terminar.",
        passo2: "Seu personal trainer (eu!) está te dando uma força e adicionou mais *${numeroMagico} quilos* na barra! Some isso ao seu total.\n\nMe diga 'ok' quando somar.",
        passo3: "Para um treino equilibrado, divida o peso igualmente, *metade para cada braço*.\n\nMe avise quando dividir.",
        passo4: "Para a última série de aquecimento, retire o peso que você usou no *primeiro exercício*. Subtraia aquele valor inicial.\n\nQuando terminar, me mande um 'ok' para eu dizer o peso final!",
        revelacao: "Vamos ver essa força... 🏋️\n\nO peso que sobrou em cada braço para o desafio final é... *${resultadoFinal} quilos*!\n\nSem dor, sem ganho, certo? 😎"
    },
    {
        nome: "Jornada do Gamer",
        inicio: "Saudações, jogador(a)! 🎮\n\nVamos upar seu personagem com matemática e vou adivinhar seu XP final.\n\nPense em quantos *pontos de experiência (XP)* você tem (um número qualquer).\n\nQuando estiver pronto, diga *'iniciar partida', ou 'ok' *",
        passo1: "Você ativou um item de 'EXP em Dobro'! Sua experiência foi *duplicada*! Multiplique seu XP por 2.\n\nMe avise quando terminar.",
        passo2: "Eu sou o Mestre do Jogo (GM) e, pela sua dedicação, estou te dando um bônus de *${numeroMagico} pontos de XP*! Some ao seu total.\n\nMe diga 'ok' quando somar.",
        passo3: "Hora de distribuir! Divida seus pontos igualmente entre duas habilidades: *Ataque e Defesa*.\n\nMe avise quando dividir.",
        passo4: "Para desbloquear o próximo mapa, você gasta a *quantidade inicial* de XP que tinha antes de tudo.\n\nQuando terminar, me mande um 'ok' para eu revelar seu poder!",
        revelacao: "Analisando seus atributos... 📈\n\nA quantidade de XP que sobrou para cada habilidade foi... *${resultadoFinal}*!\n\nPronto para o próximo chefe? 😎"
    },
    {
        nome: "Piloto de Corrida",
        inicio: "Aperte os cintos, piloto! 🏎️\n\nEstamos numa corrida e vou adivinhar sua velocidade extra na linha de chegada.\n\nPense na sua *velocidade atual em km/h* (um número qualquer).\n\nQuando estiver pronto, diga *'acelerar!', ou 'ok' *",
        passo1: "Você passou por uma zona de aceleração na pista que *dobrou* sua velocidade! Multiplique por 2.\n\nMe avise quando terminar.",
        passo2: "Eu, seu chefe de equipe, ativei o nitro! Você ganhou um impulso extra de *${numeroMagico} km/h*! Some ao seu total.\n\nMe diga 'ok' quando somar.",
        passo3: "Para fazer a próxima curva fechada, você precisou reduzir sua velocidade total pela *metade*.\n\nMe avise quando dividir.",
        passo4: "O sistema de controle de tração, para evitar derrapagem, reduziu sua velocidade na *exata quantidade que você tinha no início*.\n\nQuando terminar, me mande um 'ok' para eu dizer sua vantagem!",
        revelacao: "Analisando a telemetria... 🏁\n\nA velocidade extra que você manteve na linha de chegada foi de... *${resultadoFinal} km/h*!\n\nVitória garantida! 😎"
    },
    {
        nome: "Jardim Secreto",
        inicio: "Olá, jardineiro(a)! 🌿\n\nVamos plantar sementes mágicas e eu vou adivinhar quantas florescerão.\n\nPense em quantas *sementes* você tem na mão (um número qualquer).\n\nQuando estiver pronto, diga *'vamos plantar', ou 'ok' *",
        passo1: "Um gnomo amigável apareceu e usou magia para *duplicar* suas sementes! Multiplique-as por 2.\n\nMe avise quando terminar.",
        passo2: "Eu sou o Espírito da Floresta e te presenteio com *${numeroMagico} sementes de luz*! Some ao seu total.\n\nMe diga 'ok' quando somar.",
        passo3: "Você precisa plantar metade no canteiro do sol e metade no canteiro da lua. *Divida suas sementes por 2*.\n\nMe avise quando dividir.",
        passo4: "Ah, não! Passarinhos famintos comeram a *quantidade exata de sementes que você tinha no início*.\n\nQuando terminar, me mande um 'ok' para eu ver o que restou!",
        revelacao: "Olhando o jardim florescer... 🌸\n\nO número de sementes mágicas que restou em cada canteiro foi... *${resultadoFinal}*!\n\nQue jardim lindo! 😎"
    },
    {
        nome: "Artista Criativo",
        inicio: "Olá, artista! 🎨\n\nVamos pintar uma obra-prima e vou adivinhar quanta tinta sobrou na sua paleta.\n\nPense em quantas *cores diferentes* você está usando (um número qualquer).\n\nQuando estiver pronto, diga *'hora de criar', ou 'ok' *",
        passo1: "Você entrou em um estado de fluxo criativo que te fez misturar e *dobrar* o número de tons de cores! Multiplique por 2.\n\nMe avise quando terminar.",
        passo2: "Sua musa inspiradora (eu!) te deu um pigmento mágico que criou mais *${numeroMagico} novas cores*! Some ao seu total.\n\nMe diga 'ok' quando somar.",
        passo3: "Você dividiu sua paleta em duas: *metade para cores quentes e metade para cores frias*.\n\nMe avise quando dividir.",
        passo4: "Para dar a base na tela, você usou a *quantidade inicial* de cores que tinha pensado.\n\nQuando terminar, me mande um 'ok' para eu ver sua arte!",
        revelacao: "Avaliando sua obra... 🖼️\n\nA quantidade de cores novas em cada paleta é... *${resultadoFinal}*!\n\nUma verdadeira obra-prima! 😎"
    },
    {
        nome: "Rockstar Famoso",
        inicio: "E aí, astro do rock?! 🎸\n\nO show vai começar e vou adivinhar quantos fãs invadiram o palco.\n\nPense em quantos *fãs* estão na primeira fila (um número qualquer).\n\nQuando estiver pronto, diga *'liga o som!', ou 'ok' *",
        passo1: "Seu novo single foi um sucesso e *dobrou* o número de fãs que correram para a frente do palco! Multiplique por 2.\n\nMe avise quando terminar.",
        passo2: "Eu, seu empresário, consegui uma divulgação extra que trouxe mais *${numeroMagico} fãs* para o show! Some ao seu total.\n\nMe diga 'ok' quando somar.",
        passo3: "A segurança dividiu a multidão em *dois lados*, esquerdo e direito do palco, para controle.\n\nMe avise quando dividir.",
        passo4: "Para organizar, a equipe pediu para a *quantidade inicial* de fãs da primeira fila dar um passo para trás.\n\nQuando terminar, me mande um 'ok' para eu ver a loucura!",
        revelacao: "Olhando a multidão... 🤘\n\nO número de novos fãs enlouquecidos em cada lado do palco foi... *${resultadoFinal}*!\n\nVocê é uma lenda! 😎"
    },
    {
        nome: "Agente Secreto",
        inicio: "Agente, sua missão, caso decida aceitar... 🕶️\n\nVou decifrar a senha final baseada nos seus cálculos.\n\nPense em um *número para o código secreto* (um número qualquer).\n\nQuando estiver pronto, diga *'missão aceita', ou 'ok' *",
        passo1: "Você encontrou um chip inimigo que *dobrou* a complexidade do seu código! Multiplique seu número por 2.\n\nMe avise quando terminar.",
        passo2: "A central de comando (eu!) enviou uma transmissão com um adicional de *${numeroMagico}* para a sua senha! Some ao seu total.\n\nMe diga 'ok' quando somar.",
        passo3: "O decodificador exige que o código seja dividido em *duas partes* para análise. Divida por 2.\n\nMe avise quando dividir.",
        passo4: "O primeiro protocolo de segurança foi quebrado. *Subtraia o número inicial* que você pensou.\n\nQuando terminar, me mande um 'ok' para a revelação!",
        revelacao: "Decodificando a mensagem... 📡\n\nA senha final para desarmar a bomba é... *${resultadoFinal}*!\n\nMissão cumprida, agente! 😎"
    },
    {
        nome: "Cientista Maluco",
        inicio: "Meu caro assistente, venha ver meu experimento! 🧪\n\nVou prever o resultado da nossa mistura maluca!\n\nPense em quantos *mililitros (ml) da poção* você tem aí (um número qualquer).\n\nQuando estiver pronto, diga *'está vivo!', ou 'ok' *",
        passo1: "A mistura entrou em reação e *dobrou* de volume! Multiplique seus ml por 2.\n\nMe avise quando terminar.",
        passo2: "Eu, o cientista-chefe, adicionei mais *${numeroMagico} ml de 'substância X'*! Some ao seu total.\n\nMe diga 'ok' quando somar.",
        passo3: "Rápido, divida o composto em *dois béqueres* antes que transborde! Divida por 2.\n\nMe avise quando dividir.",
        passo4: "O processo de aquecimento evaporou exatamente a *quantidade inicial* de ml que tínhamos.\n\nQuando terminar, me mande um 'ok' para vermos o resultado!",
        revelacao: "Olhando pelo microscópio... 🔬\n\nO volume da poção instável que sobrou em cada béquer foi... *${resultadoFinal} ml*!\n\nEureka! Funcionou! 😎"
    },
    {
        nome: "Explorador de Ruínas",
        inicio: "Olá, explorador(a)! 🗺️\n\nEstamos em busca de relíquias perdidas e vou prever nosso achado final.\n\nPense em quantos *artefatos* você já encontrou (um número qualquer).\n\nQuando estiver pronto, diga *'vamos explorar', ou 'ok' *",
        passo1: "Você ativou uma alavanca secreta que abriu uma sala com o *dobro* de artefatos! Multiplique seu achado por 2.\n\nMe avise quando terminar.",
        passo2: "Eu, seu guia, decifrei um mapa que nos levou a mais *${numeroMagico} artefatos* de ouro! Some ao seu total.\n\nMe diga 'ok' quando somar.",
        passo3: "Para transportar, dividimos o tesouro em *duas mochilas* de mesmo peso. Divida por 2.\n\nMe avise quando dividir.",
        passo4: "Cuidado! A *quantidade inicial* de artefatos que você encontrou era uma armadilha e virou pó! Subtraia esse valor.\n\nQuando terminar, me mande um 'ok' para ver o que salvamos!",
        revelacao: "Avaliando o tesouro... 💎\n\nO número de relíquias genuínas que restou em cada mochila foi... *${resultadoFinal}*!\n\nFicamos ricos! 😎"
    },
    {
        nome: "Leitor de Livros",
        inicio: "Olá, amante dos livros! 📚\n\nVamos viajar por uma história e vou adivinhar em que página a magia acontece.\n\nPense em quantas *páginas* você já leu hoje (um número qualquer).\n\nQuando estiver pronto, diga *'próximo capítulo', ou 'ok' *",
        passo1: "A história ficou tão boa que sua velocidade de leitura *dobrou* e você leu a mesma quantidade de páginas novamente! Multiplique por 2.\n\nMe avise quando terminar.",
        passo2: "Eu, o autor, apareci para dar uma dica e te fiz pular *${numeroMagico} páginas* para uma cena de ação! Some ao seu total.\n\nMe diga 'ok' quando somar.",
        passo3: "Você parou e dividiu sua meta de leitura em duas: *uma parte para hoje e outra para amanhã*. Divida por 2.\n\nMe avise quando dividir.",
        passo4: "Para entender melhor um detalhe, você voltou e releu o trecho inicial. *Subtraia o número de páginas que você tinha lido no início*.\n\nQuando terminar, me mande um 'ok' para a grande revelação!",
        revelacao: "Analisando o marcador de páginas... 🔖\n\nO número da página onde o grande segredo do livro é revelado é... *${resultadoFinal}*!\n\nQue reviravolta! 😎"
    },
    {
        nome: "Construtor de Cidades",
        inicio: "Saudações, prefeito(a)! 🏙️\n\nVamos desenvolver nossa cidade e vou prever quantos novos habitantes teremos.\n\nPense em quantos *prédios* você tem na sua cidade (um número qualquer).\n\nQuando estiver pronto, diga *'vamos construir', ou 'ok' *",
        passo1: "Um novo plano de urbanização permitiu *dobrar* o número de construções! Multiplique seus prédios por 2.\n\nMe avise quando terminar.",
        passo2: "Eu, como seu consultor, aprovei a verba para mais *${numeroMagico} prédios* comerciais! Some ao seu total.\n\nMe diga 'ok' quando somar.",
        passo3: "Para organizar, você dividiu a cidade em *duas zonas*: residencial e comercial. Divida os prédios por 2.\n\nMe avise quando dividir.",
        passo4: "Uma lei de preservação histórica exigiu a demolição dos *prédios iniciais* que você tinha para criar um parque.\n\nQuando terminar, me mande um 'ok' para ver o resultado!",
        revelacao: "Olhando o mapa da cidade... 🗺️\n\nA quantidade de novos prédios em cada zona é... *${resultadoFinal}*!\n\nNossa metrópole está crescendo! 😎"
    }
];

const userStates = {};

client.on('qr', qr => { qrcode.generate(qr, { small: true }); });
client.on('ready', () => { console.log('Bot de Jogo com Histórias conectado!'); });
client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms));
const enviarMensagensComDelay = async (chat, mensagens) => {
    for (const msg of mensagens) {
        await delay(1500);
        await chat.sendStateTyping();
        await delay(2500);
        await client.sendMessage(chat.id._serialized, msg);
    }
};

client.on('message', async msg => {
    if (!msg.from.endsWith('@c.us')) { return; }

    const texto = msg.body.trim().toLowerCase();
    const chat = await msg.getChat();
    const userId = msg.from;

    try {
        if (userStates[userId]) {
            await handleGameStep(userId, chat, texto);
            return;
        }

        const palavrasInicio = ['jogar', 'brincar', 'jogo', 'game', 'play', 'start'];
        
        if (palavrasInicio.includes(texto)) {
            const historiaAleatoria = historias[Math.floor(Math.random() * historias.length)];
            
            userStates[userId] = { 
                step: 'inicio_jogo',
                historia: historiaAleatoria
            };
            
            const mensagemDeInicioCombinada = [
                MENSAGEM_TUTORIAL,
                `*--- Sua Aventura de Hoje: ${historiaAleatoria.nome} ---*\n\n${historiaAleatoria.inicio}`
            ];
            
            await enviarMensagensComDelay(chat, mensagemDeInicioCombinada);
            return;
        }

    } catch (error) {
        console.error("Ocorreu um erro:", error);
        if (userStates[userId]) { delete userStates[userId]; }
    }
});


async function handleGameStep(userId, chat, textoUsuario) {
    const currentState = userStates[userId];
    const historia = currentState.historia;

    if (palavrasSair.includes(textoUsuario)) {
        delete userStates[userId];
        await client.sendMessage(userId, "Ok, jogo cancelado! 👋\n\nQuando quiser tentar de novo, é só digitar *jogar*.");
        return;
    }

    switch (currentState.step) {
        case 'inicio_jogo':
            currentState.step = 'passo_1';
            await enviarMensagensComDelay(chat, [historia.passo1]);
            break;
        
        case 'passo_1':
            const multiplicador = Math.floor(Math.random() * 50) + 1;
            const numeroMagico = multiplicador * 2;
            currentState.magicNumber = numeroMagico;
            currentState.step = 'passo_2';
            const mensagemPasso2 = historia.passo2.replace('${numeroMagico}', numeroMagico);
            await enviarMensagensComDelay(chat, [mensagemPasso2]);
            break;

        case 'passo_2':
            currentState.step = 'passo_3';
            await enviarMensagensComDelay(chat, [historia.passo3]);
            break;

        case 'passo_3':
            currentState.step = 'passo_4';
            await enviarMensagensComDelay(chat, [historia.passo4]);
            break;
            
        case 'passo_4':
            const resultadoFinal = currentState.magicNumber / 2;
            const mensagemFinal = historia.revelacao.replace('${resultadoFinal}', resultadoFinal);
            
            await enviarMensagensComDelay(chat, [mensagemFinal]);
            
            delete userStates[userId]; 
            
            const mensagemJogarNovamente = "Se Desejar jogar novamente, digite jogar?";
            await enviarMensagensComDelay(chat, [mensagemJogarNovamente]);
            
            break;
    }
}