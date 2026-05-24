# Sistema de Gestão Financeira

Este projeto consiste em uma aplicação completa de gestão financeira com arquitetura dividida entre um servidor de API (**Back-end**) e um aplicativo móvel (**Front-end**) desenvolvido em **React Native** com **Expo**.

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

* **Node.js** (Versão LTS recomendada)
* Gerenciador de pacotes **npm** ou **yarn**
* Um emulador Android configurado (**Android Studio**) ou o aplicativo **Expo Go** instalado no seu dispositivo físico.

---

## 🚀 Como Executar o Projeto

Para rodar a aplicação, você precisará utilizar dois terminais distintos: um para o servidor e outro para o aplicativo.

### 💻 Terminal 1: Servidor API (Back-end)
O servidor gerencia o banco de dados e as regras de negócio, rodando nativamente na porta `3000`.

1. Abra o primeiro terminal e entre na pasta do back-end:
   ```bash
   cd projeto-gestao-financeira
   ```

2. Instale as dependências do projeto:
   ```bash
   npm install
   ```

3. Como o projeto utiliza o banco de dados com **Prisma**, aplique as tabelas rodando:
   ```bash
   npx prisma migrate dev
   ```

4. Inicie o servidor da API:
   ```bash
   node src/server.js
   ```

> 💡 **Nota:** O servidor estará disponível e escutando requisições no endereço: `http://localhost:3000`

---

### 📱 Terminal 2: Aplicativo Mobile (Front-end Android)
O aplicativo foi desenvolvido utilizando Expo e consome os dados fornecidos pelo Terminal 1.

1. Abra um segundo terminal à parte e entre na pasta do aplicativo móvel:
   ```bash
   cd app-gestao-financeira
   ```

2. Instale as dependências do aplicativo:
   ```bash
   npm install
   ```

3. Execute o comando para iniciar o empacotador do Expo diretamente no emulador Android:
   ```bash
   npx expo start -c --localhost
   ```

> 💡 **Dica de Execução:** Se o emulador Android já estiver aberto na sua máquina, o Expo fará a instalação e abrirá o aplicativo automaticamente nele. Caso prefira testar direto no seu celular físico, basta rodar o comando `npx expo start`, ler o QR Code gerado na tela utilizando o aplicativo **Expo Go** e garantir que o computador e o celular estejam conectados na mesma rede Wi-Fi.

---

## 🔑 Credenciais de Acesso (Modo de Teste)

Para facilitar a correção e a avaliação das funcionalidades de *Drilldown* e dos gráficos da aplicação, utilize os seguintes dados cadastrados na tela de login:

* **Usuário:** Qualquer nome de sua preferência
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
