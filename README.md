# Bot de Atendimento para WhatsApp

Este é um bot de atendimento inicial para WhatsApp, desenvolvido com Node.js e a biblioteca `whatsapp-web.js`. O projeto foi estruturado para ser um assistente virtual que responde a perguntas frequentes (FAQ) através de um menu de opções simples, de forma organizada e escalável.

## Funcionalidades Principais

-   **Login via QR Code**: Gera um QR Code no terminal para autenticar a sessão do WhatsApp de forma rápida.
-   **Saudação Personalizada**: Identifica o nome do contato do usuário para uma saudação mais amigável.
-   **Menu de Opções**: É acionado por palavras-chave de saudação (como "oi", "olá", "menu") e apresenta um menu de opções numerado.
-   **Respostas Centralizadas**: Todas as respostas do menu são armazenadas em um único objeto, facilitando a manutenção e a adição de novo conteúdo.
-   **Fluxo de Conversa Natural**: Simula o status "digitando..." e utiliza pausas estratégicas entre as mensagens para uma interação mais humana.
-   **Código Otimizado**: Utiliza uma função reutilizável para o envio de mensagens, evitando a repetição de código e melhorando a legibilidade.

## Pré-requisitos

Para executar este projeto, você precisará ter o [Node.js](https://nodejs.org/) (versão 14 ou superior) instalado em seu computador.

## Como Instalar

1.  **Clone o repositório ou baixe os arquivos do projeto.**

2.  **Abra o seu terminal (CMD, PowerShell, etc.) e navegue até a pasta do projeto:**
    ```bash
    cd caminho/para/o/projeto
    ```

3.  **Instale as dependências necessárias executando o comando:**
    ```bash
    npm install whatsapp-web.js qrcode-terminal
    ```

## Como Executar

1.  **No terminal, dentro da pasta do projeto, execute o bot com o seguinte comando:**
    ```bash
    node nome_do_seu_arquivo.js
    ```
    *(Substitua `nome_do_seu_arquivo.js` pelo nome que você deu ao seu arquivo, por exemplo, `bot.js`)*.

2.  **Escaneie o QR Code**: Um QR Code será exibido no terminal. Use o aplicativo do WhatsApp no seu celular para escaneá-lo (em **Aparelhos conectados > Conectar um aparelho**).

3.  **Aguarde a confirmação**: Assim que a mensagem "Tudo certo! WhatsApp conectado." aparecer no terminal, o bot estará online e pronto para interagir.

## Como Personalizar

A adaptação do bot para o seu negócio é muito simples:

-   **Para alterar as respostas do menu**: Modifique o objeto `respostas` no início do código. Você pode adicionar, remover ou editar as mensagens de cada opção.
-   **Para mudar a mensagem inicial**: Altere o texto na variável `mensagemInicial`.
-   **Para adicionar mais palavras-chave**: Inclua novas palavras no array da condição `if (['menu', 'oi', ...].includes(texto))`.