# Reparai — aplicativo de registro de ocorrências urbanas

## Objetivo
O Reparai é um aplicativo Android desenvolvido em React Native com Expo para registrar e acompanhar ocorrências urbanas, como buracos na via, problemas de iluminação pública, lixo irregular, sinalização e calçadas.

## Funcionalidades implementadas no código
- Cadastro e login local de usuários.
- Listagem de ocorrências associadas ao usuário conectado.
- Pesquisa/filtros na lista de ocorrências.
- Cadastro com categoria, título, descrição, endereço e foto opcional.
- Validação de título (10 a 50 caracteres) e descrição (10 a 1.000 caracteres).
- Visualização de detalhes, edição e exclusão de ocorrência.
- Atualização do status: Enviada, Em análise, Em execução e Resolvida.
- Armazenamento local usando SQLite; fotos salvas no diretório de documentos do aplicativo.

## Tecnologias
- JavaScript, React Native e Expo.
- React Navigation (native stack).
- `expo-sqlite` para dados locais.
- `expo-image-picker` para seleção/captura de imagens.
- `expo-file-system` para persistência de fotos.

## Requisitos
- Node.js compatível com a versão do Expo usada no projeto.
- npm.
- Android Studio/emulador ou dispositivo Android para testes.

## Instalar dependências e executar
Na pasta do projeto, execute:

```bash
npm install
npm start
```

Depois, abra o aplicativo no emulador Android pelo menu do Expo ou execute `npm run android`.

## Usuário de demonstração
A inicialização do banco cria este usuário se ele ainda não existir:
- E-mail: `aluno@senac.com`
- Senha: `1234`

Pode ser necessário cadastrar um novo usuário se os dados do emulador tiverem sido apagados ou se a base local tiver sido redefinida.

## Estrutura principal
```text
App.js
index.js
app.json
package.json
eas.json
src/
  components/    componentes reutilizáveis de interface
  database/      inicialização e operações SQLite; persistência de fotos
  models/        modelo e autenticação local de usuário
  navigation/    configuração das rotas
  screens/       telas do aplicativo
  styles/        cores e estilos compartilhados
assets/          ícones e imagens do aplicativo
```

## Banco de dados
O banco local chama-se `reparai.db` e é criado no dispositivo na primeira inicialização. A estrutura atual é documentada em `DOCUMENTACAO_BANCO.md`. Não é necessário entregar um arquivo de banco com dados pessoais: a aplicação cria as tabelas e um usuário de demonstração quando necessário.

## Gerar APK Android
A configuração `eas.json` inclui o perfil `preview` para gerar um APK instalável. Para gerar o arquivo, é necessário ter uma conta Expo/EAS, internet e a ferramenta EAS CLI configurada:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

Ao terminar, o serviço EAS fornecerá um link para baixar o APK. A geração do APK não foi executada nesta organização do código.

## Limitações e observações
- A autenticação é local e a senha é armazenada em texto simples no SQLite; esta implementação é apropriada apenas para protótipo acadêmico e não deve ser usada em produção sem melhorias de segurança.
- Os dados e fotos são armazenados no dispositivo; não há servidor/backend remoto configurado neste projeto.
- O funcionamento deve ser testado novamente no emulador/dispositivo após instalar as dependências.
