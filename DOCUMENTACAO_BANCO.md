# Documentação do banco de dados — Reparai

## Armazenamento
Banco SQLite local chamado `reparai.db`, inicializado por `src/database/database.js`. As tabelas são criadas automaticamente pela função `initDatabase()`.

## Tabela `users`
| Campo | Tipo | Regras | Finalidade |
|---|---|---|---|
| `id` | INTEGER | Chave primária, autoincremento | Identificador do usuário |
| `name` | TEXT | Obrigatório | Nome |
| `email` | TEXT | Obrigatório, único | E-mail de login |
| `password` | TEXT | Obrigatório | Senha usada na autenticação local |

## Tabela `ocorrencias`
| Campo | Tipo | Regras | Finalidade |
|---|---|---|---|
| `id` | TEXT | Chave primária | Identificador da ocorrência |
| `categoria` | TEXT | Obrigatório | Categoria da ocorrência |
| `titulo` | TEXT | Obrigatório | Título de 10 a 50 caracteres na tela de cadastro |
| `descricao` | TEXT | Obrigatório | Descrição de 10 a 1.000 caracteres na tela de cadastro |
| `endereco` | TEXT | Obrigatório | Local da ocorrência |
| `status` | TEXT | Obrigatório; padrão `Enviada` | Etapa atual da ocorrência |
| `data` | TEXT | Obrigatório | Data/hora em formato ISO, conforme cadastro |
| `user_id` | INTEGER | Pode ser nulo em registros antigos | Identifica o usuário proprietário da ocorrência |

A inicialização verifica se a coluna `user_id` já existe e, se não existir, adiciona-a por migração. O código filtra as ocorrências pelo usuário conectado nas operações principais.

## Status utilizados
- `Enviada`
- `Em análise`
- `Em execução`
- `Resolvida`

## Dados de demonstração
Se não existir usuário com o e-mail `aluno@senac.com`, a inicialização cria `Aluno Teste`, e-mail `aluno@senac.com`, senha `1234`. As ocorrências de demonstração não são criadas automaticamente.

## Fotos
As imagens não ficam armazenadas como BLOB no SQLite. O código salva arquivos JPEG no diretório de documentos do aplicativo, usando o identificador da ocorrência como nome do arquivo.

## Observação de segurança
As senhas são armazenadas em texto simples e `user_id` não está definido como chave estrangeira na estrutura atual. Para uso real, recomenda-se autenticação segura e revisão do modelo de dados. Esta documentação descreve o código atual; não altera o banco de dados.
