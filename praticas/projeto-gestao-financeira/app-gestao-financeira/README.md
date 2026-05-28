# Sistema de Gestão Financeira

Este projeto consiste em uma aplicação completa de gestão financeira com arquitetura dividida entre um servidor de API (**Back-end**) e um aplicativo móvel (**Front-end**) desenvolvido em **React Native** com **Expo**.

🛠️ Pré-requisitos Obrigatórios
Antes de iniciar, certifique-se de possuir instalado em sua máquina de avaliação:

* **Node.js** (Versão 18 ou superior recomendada)
* **MySQL Server** ativo localmente (Porta padrão 3306)
* **MySQL Workbench** (ou qualquer cliente SQL de sua preferência)
* **Expo Go** instalado no smartphone ou um emulador configurado

---

🖥️ 1. Configuração do Back-end (projeto-gestao-financeira)
Siga os passos abaixo sequencialmente para subir a API e popular a base de dados.

### Passo 1.1: Instalar as Dependências
Abra o terminal dentro do diretório do back-end e execute:

```bash
cd projeto-gestao-financeira
npm install
```

### Passo 1.2: Criar o Banco de Dados no MySQL Workbench
Abra o MySQL Workbench, conecte-se à sua instância local e execute a seguinte Query SQL para criar a estrutura do banco com suporte completo a caracteres especiais e emojis:

```sql
CREATE DATABASE gestao_financeira
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

### Passo 1.3: Configurar as Variáveis de Ambiente (.env)
Na raiz da pasta do back-end, crie um arquivo chamado `.env` baseado no modelo disponível em `.env.example`:

```bash
# Copie o conteúdo ou crie o arquivo manualmente na raiz do back-end
# Ajuste o "root" e a "sua_senha" para corresponder às credenciais do seu MySQL local
DATABASE_URL="mysql://root:iesb@localhost:3306/gestao_financeira"
PORT=3000
```

### Passo 1.4: Executar as Migrations do Prisma
Para ler o arquivo `schema.prisma` e gerar automaticamente todas as tabelas estruturadas (`transaction` e `category`) dentro do MySQL criado no Workbench, execute:

```bash
npx prisma migrate dev --name init
```

### Passo 1.5: Executar o Banco de Dados Seed (Popular Categorias)
Este sistema implementa uma regra de negócio estrita onde existem categorias padrão protegidas do sistema que não podem ser deletadas pela API. Para inserir essas categorias nativas junto com seus emojis correspondentes na base, execute o comando configurado em nosso script:

```bash
npm run prisma:seed
```
* **Mensagem esperada no terminal:** `Seed concluído.`

### Passo 1.6: Iniciar o Servidor API
Agora que o banco está estruturado e populado, inicie o servidor de desenvolvimento:

```bash
npm run dev
```
* **O servidor estará ativo em:** `http://localhost:3000`
* **Nota:** Deixe este terminal aberto e rodando em segundo plano.

---

📱 2. Configuração do Front-end (app-gestao-financeira)
Com a API rodando em segundo plano, abra um segundo terminal para configurar a aplicação móvel.

### Passo 2.1: Instalar as Dependências
Navegue até o diretório do front-end e instale os pacotes necessários:

```bash
cd .\praticas\projeto-gestao-financeira\app-gestao-financeira\
npm install
```

### Passo 2.2(opcional): Configurar as Variáveis de Ambiente do Expo
Crie um arquivo `.env` na raiz da pasta do front-end (app-gestao-financeira) para mapear o endpoint de comunicação com a API:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```
*⚠️ **Nota:** Caso esteja testando em um dispositivo físico Android ou iOS conectado via Wi-Fi, substitua `localhost` pelo IP local de sua máquina de desenvolvimento (ex: `http://192.168.x.x:3000`).*

### Passo 2.3: Iniciar o Aplicativo Limpando o Cache (Recomendado)
Para garantir que o Metro Bundler compile o app sem reter estados de compilações anteriores, inicie limpando o cache nativo:

```bash
npx expo start -c 

ou

npx expo start -c --localhost
```
* Pressione `a` para abrir no emulador Android ou leia o QR Code gerado utilizando a câmera do dispositivo físico através do app **Expo Go**.

---

💡 Recursos Implementados & Validações Avaliadas

* **Arquitetura Baseada em Contexto Global:** Gerenciamento de estado de dados reativo via `MoneyContext.tsx`, garantindo sincronização e atualização de telas em tempo real (Gráficos, Listagens e Criação de Transações).
* **Segurança e Proteção no Back-end:** O arquivo `categoryRoutes.js` possui um middleware rígido que impede a remoção inadvertida de categorias nativas (`isDefault: true`). Qualquer tentativa gera um retorno HTTP 400 Bad Request.
* **Validação de Formulários com Zod:** Ambas as criações de categorias e transações passam por validação sintática estrita no back-end antes de atingirem o banco de dados.
* **Persistência Relacional Correta:** A tabela de movimentações possui integridade referencial ligada diretamente aos IDs gerados de forma única na tabela de categorias (`categoryId`).

> 💡 **Dica de Execução:** Se o emulador Android já estiver aberto na sua máquina, o Expo fará a instalação e abrirá o aplicativo automaticamente nele. Caso prefira testar direto no seu celular físico, basta rodar o comando `npx expo start`, ler o QR Code gerado na tela utilizando o aplicativo **Expo Go** e garantir que o computador e o celular estejam conectados na mesma rede Wi-Fi.

---

## 🔑 Credenciais de Acesso (Modo de Teste)

Para facilitar a correção e a avaliação das funcionalidades de *Drilldown* e dos gráficos da aplicação, utilize os seguintes dados cadastrados na tela de login:

* **Usuário:** O Seu Nome
* **Senha:** `1234`

--------------------------------------------------------------------------------------------------------------------------------------   

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
