## Documentação Técnica do Backend

### 1. Modelos (Models)
Os modelos representam as entidades do domínio e são implementados com Sequelize ORM. Cada modelo corresponde a uma tabela no PostgreSQL.

#### **User** (`models/user.js`)
**Propósito**: Gerencia informações de usuários do sistema (autenticação e perfis).

**Atributos**:
- `id` (INTEGER, PK, auto-increment): Identificador único.
- `name` (STRING, NOT NULL): Nome completo do usuário.
- `email` (STRING, UNIQUE, NOT NULL): Email para login (validado como email).
- `password` (STRING, NULLABLE): Senha hasheada (BCrypt) - nullable para OAuth.
- `googleId` (STRING, UNIQUE, NULLABLE): ID do Google para login OAuth.
- `role` (ENUM: 'admin', 'user'): Perfil de acesso (padrão: 'user').

**Validações**:
- Nome: 2-100 caracteres.
- Email: formato válido.
- Senha: 6-255 caracteres (quando não OAuth).

**Casos de uso**: Autenticação, controle de acesso (admin vs usuário comum), perfis Google.

---

#### **Class** (`models/class.js`)
**Propósito**: Representa turmas/classes escolares às quais jogadores pertencem.

**Atributos**:
- `id` (INTEGER, PK, auto-increment): Identificador único.
- `name` (STRING, UNIQUE, NOT NULL): Nome da turma (ex: "INFO 2024.1").
- `description` (TEXT, NULLABLE): Descrição adicional (até 500 caracteres).
- `year` (INTEGER, NOT NULL): Ano letivo (validado: 2020-2030).
- `semester` (ENUM: '1', '2', NOT NULL): Semestre letivo.
- `course` (STRING, NOT NULL): Curso (ex: "Informática").
- `maxStudents` (INTEGER, DEFAULT 30): Capacidade máxima de alunos (validado: 1-100).

**Relacionamentos**:
- **hasMany** `Player` (1:N): Uma turma possui vários jogadores.

**Validações**:
- Nome único.
- Ano entre 2020 e 2030.
- Semestre obrigatório ('1' ou '2').

**Casos de uso**: Organização de jogadores por turma, relatórios acadêmicos.

---

#### **Team** (`models/team.js`)
**Propósito**: Representa equipes esportivas que competem nos campeonatos.

**Atributos**:
- `id` (INTEGER, PK, auto-increment): Identificador único.
- `name` (STRING, NOT NULL): Nome do time.
- `modality` (STRING, NOT NULL): Modalidade esportiva (ex: "Futebol", "Vôlei").

**Relacionamentos**:
- **hasMany** `Player` (1:N): Um time possui vários jogadores.
- **belongsToMany** `Championship` através de `ChampionshipTeam` (N:N): Um time participa de múltiplos campeonatos.
- **hasMany** `MatchTeam` (1:N): Um time aparece em múltiplas partidas.

**Casos de uso**: Cadastro de times, associação a campeonatos, escalação de jogadores.

---

#### **Player** (`models/player.js`)
**Propósito**: Representa atletas que pertencem a turmas e times.

**Atributos**:
- `id` (INTEGER, PK, auto-increment): Identificador único.
- `name` (STRING, NOT NULL): Nome do jogador (2-100 caracteres).
- `age` (INTEGER, NOT NULL): Idade (validado: 16-50 anos).
- `classId` (INTEGER, FK, NOT NULL): Referência à turma.
- `teamId` (INTEGER, FK, NULLABLE): Referência ao time (opcional).

**Relacionamentos**:
- **belongsTo** `Class` (N:1): Cada jogador pertence a uma turma.
- **belongsTo** `Team` (N:1): Cada jogador pode estar em um time.

**Validações**:
- Nome não vazio (2-100 caracteres).
- Idade entre 16 e 50 anos.

**Casos de uso**: Cadastro de atletas, associação a times e turmas, relatórios por modalidade.

---

#### **Championship** (`models/championship.js`)
**Propósito**: Representa competições esportivas organizadas pela instituição.

**Atributos**:
- `id` (INTEGER, PK, auto-increment): Identificador único.
- `name` (STRING, UNIQUE, NOT NULL): Nome do campeonato (2-100 caracteres).
- `year` (INTEGER, NOT NULL): Ano de realização (validado: 2020-2030).
- `modality` (ENUM: 'Futebol', 'Vôlei', NOT NULL, DEFAULT 'Futebol'): Modalidade.
- `format` (STRING, NOT NULL, DEFAULT 'Pontos Corridos'): Formato da competição ('Pontos Corridos' ou 'Mata-Mata').

**Relacionamentos**:
- **hasMany** `Match` (1:N): Um campeonato possui várias partidas.
- **belongsToMany** `Team` através de `ChampionshipTeam` (N:N): Campeonato agrupa vários times.

**Validações**:
- Nome único.
- Ano entre 2020 e 2030.
- Modalidade: apenas 'Futebol' ou 'Vôlei'.
- Formato: apenas 'Pontos Corridos' ou 'Mata-Mata'.

**Casos de uso**: Criação de campeonatos, geração de partidas, classificação.

---

#### **Match** (`models/match.js`)
**Propósito**: Representa partidas/jogos entre dois times em um campeonato.

**Atributos**:
- `id` (INTEGER, PK, auto-increment): Identificador único.
- `championshipId` (INTEGER, FK, NOT NULL): Referência ao campeonato.
- `playDay` (DATE, NULLABLE): Data e hora da partida.
- `status` (INTEGER): Status (0: agendada, 1: em andamento, 2: finalizada).
- `round` (INTEGER, NULLABLE): Rodada (usado em mata-mata).
- `bracketOrder` (INTEGER, NULLABLE): Ordem no chaveamento (mata-mata).
- `isKnockout` (BOOLEAN, DEFAULT false): Indica se é partida eliminatória.

**Relacionamentos**:
- **belongsTo** `Championship` (N:1): Cada partida pertence a um campeonato.
- **hasMany** `MatchTeam` (1:N): Uma partida possui 2 times (via tabela intermediária).

**Casos de uso**: Registro de confrontos, resultados, cálculo de pontos.

---

#### **MatchTeam** (`models/match_team.js`)
**Propósito**: Tabela intermediária que associa times a partidas e armazena resultados.

**Atributos**:
- `id` (INTEGER, PK, auto-increment): Identificador único.
- `matchId` (INTEGER, FK, NOT NULL): Referência à partida.
- `teamId` (INTEGER, FK, NOT NULL): Referência ao time.
- `goalsTeam` (INTEGER, DEFAULT 0): Gols/pontos marcados pelo time.
- `pointsTeam` (INTEGER, DEFAULT 0): Pontos conquistados (3 vitória, 1 empate, 0 derrota).

**Relacionamentos**:
- **belongsTo** `Match` (N:1): Cada registro pertence a uma partida.
- **belongsTo** `Team` (N:1): Cada registro pertence a um time.

**Casos de uso**: Armazenamento de placares, cálculo de classificação.

---

#### **ChampionshipTeam** (`models/championship_team.js`)
**Propósito**: Tabela intermediária N:N entre campeonatos e times.

**Atributos**:
- `id` (INTEGER, PK, auto-increment): Identificador único.
- `championshipId` (INTEGER, FK, NOT NULL): Referência ao campeonato.
- `teamId` (INTEGER, FK, NOT NULL): Referência ao time.

**Relacionamentos**:
- **belongsTo** `Championship` (N:1).
- **belongsTo** `Team` (N:1).

**Índices**:
- UNIQUE (`championshipId`, `teamId`): Evita times duplicados no mesmo campeonato.

**Casos de uso**: Inscrição de times em campeonatos, listagem de participantes.

---

### 2. Controllers
Implementam a lógica de negócio e validações das requisições HTTP.

#### **authController** (`controllers/authController.js`)
**Propósito**: Gerencia autenticação e perfis de usuários.

**Métodos principais**:
- `register(req, res)`: Cria novo usuário com senha hasheada (BCrypt, 12 rounds), retorna JWT e dados do usuário.
- `login(req, res)`: Valida credenciais, compara senha com BCrypt, retorna JWT (24h validade) e dados do usuário.
- `googleLogin(req, res)`: Autentica via Google OAuth, cria ou busca usuário, retorna JWT.
- `getProfile(req, res)`: Retorna perfil do usuário autenticado (requer middleware `authenticateToken`).
- `updateProfile(req, res)`: Atualiza nome/email do usuário, valida unicidade de email.

**Validações**:
- Campos obrigatórios (nome, email, senha).
- Email único.
- Senha com BCrypt.

**Casos de uso**: Login/registro, perfil, OAuth Google.

---

#### **classController** (`controllers/classController.js`)
**Propósito**: CRUD completo de turmas.

**Métodos principais**:
- `getClasses(req, res)`: Lista todas as turmas ordenadas por ano/semestre/nome.
- `createClass(req, res)`: Cria turma com validações (nome único, ano, semestre).
- `getClassById(req, res)`: Busca turma por ID.
- `updateClass(req, res)`: Atualiza dados da turma (valida semestre).
- `deleteClass(req, res)`: Remove turma.
- `getClassesByYear(req, res)`: Filtra turmas por ano.
- `getClassesByCourse(req, res)`: Filtra turmas por curso.

**Validações**:
- Nome, ano, semestre e curso obrigatórios.
- Nome único.
- Semestre: '1' ou '2'.

**Casos de uso**: Gestão acadêmica, organização de jogadores.

---

#### **teamController** (`controllers/teamController.js`)
**Propósito**: CRUD de times esportivos.

**Métodos principais**:
- `getTeams(req, res)`: Lista todos os times.
- `createTeam(req, res)`: Cria time com nome e modalidade.
- `getTeamById(req, res)`: Busca time por ID.
- `updateTeam(req, res)`: Atualiza nome/modalidade.
- `deleteTeam(req, res)`: Remove time.

**Casos de uso**: Cadastro de equipes, associação a campeonatos.

---

#### **playerController** (`controllers/playerController.js`)
**Propósito**: CRUD de jogadores com relacionamentos.

**Métodos principais**:
- `getPlayers(req, res)`: Lista jogadores com dados de time e turma (JOIN).
- `createPlayer(req, res)`: Cria jogador, valida existência de turma e time.
- `getPlayerById(req, res)`: Busca jogador por ID com relacionamentos.
- `updatePlayer(req, res)`: Atualiza dados do jogador, valida turma/time.
- `deletePlayer(req, res)`: Remove jogador.
- `getPlayersByTeam(req, res)`: Filtra jogadores por time.
- `getPlayersByClass(req, res)`: Filtra jogadores por turma.

**Validações**:
- Nome, idade e turma obrigatórios.
- Idade: 16-50 anos.
- Turma e time devem existir.

**Casos de uso**: Escalação de times, relatórios acadêmicos.

---

#### **championshipController** (`controllers/championshipController.js`)
**Propósito**: Gerencia campeonatos, geração de partidas e ranking.

**Métodos principais**:
- `getChampionships(req, res)`: Lista campeonatos com times associados.
- `createChampionShip(req, res)`: Cria campeonato, valida nome único e modalidade.
- `getChampionshipById(req, res)`: Busca campeonato com times.
- `updateChampionship(req, res)`: Atualiza dados do campeonato.
- `deleteChampionship(req, res)`: Remove campeonato.
- `generateMatches(req, res)`: Gera partidas em formato "Pontos Corridos" (usa `GenerateMatchesService`).
- `generateKnockoutMatches(req, res)`: Cria confrontos de mata-mata com validações de pares únicos.
- `advanceKnockoutRound(req, res)`: Avança para próxima rodada do mata-mata, valida vencedores (sem empates).
- `getChampionshipTeams(req, res)`: Lista times de um campeonato.
- `addTeamToChampionship(req, res)`: Associa time ao campeonato (valida existência).
- `removeTeamFromChampionship(req, res)`: Remove associação.
- `getRanking(req, res)`: Calcula classificação com pontos, vitórias, saldo de gols.

**Validações**:
- Nome único.
- Modalidade: 'Futebol' ou 'Vôlei'.
- Formato: 'Pontos Corridos' ou 'Mata-Mata'.
- Mata-mata: pares válidos, times únicos por rodada, sem empates.

**Casos de uso**: Organização de competições, geração de tabelas, classificação.

---

#### **matchController** (`controllers/matchController.js`)
**Propósito**: Gerencia partidas e registro de resultados.

**Métodos principais**:
- `getMatches(req, res)`: Lista partidas com filtro opcional por campeonato (JOIN com times e campeonato).
- `createMatch(req, res)`: Cria partida (uso interno).
- `getMatchById(req, res)`: Busca partida por ID com times.
- `updateMatch(req, res)`: Atualiza data/status.
- `deleteMatch(req, res)`: Remove partida.
- `registerResult(req, res)`: Registra placar de partida, valida 2 times, calcula pontos automaticamente (usa `CalculatePointsService`), muda status para "finalizada".

**Validações**:
- Exatamente 2 times por partida.
- Gols: inteiros não negativos.
- Times informados devem corresponder aos da partida.

**Casos de uso**: Acompanhamento de jogos, lançamento de resultados.

---

#### **reportsController** (`controllers/reportsController.js`)
**Propósito**: Gera relatórios estatísticos com exportação CSV/XLSX.

**Métodos principais**:
- `getMatchResults(req, res)`: Relatório de resultados de partidas (Time A x Time B, placar, status).
- `getChampions(req, res)`: Relatório de campeões (1º, 2º, 3º lugares) com estatísticas completas.
- `getPlayersByModality(req, res)`: Relatório de jogadores agrupados por modalidade.
- `getTopTeams(req, res)`: Ranking dos melhores times de um campeonato (top 5 padrão).

**Formatos suportados**:
- JSON (padrão).
- CSV (via `generateCSV()`): cabeçalhos, escape de vírgulas/aspas, BOM UTF-8.
- XLSX (via `generateXLSX()` com ExcelJS): formatação de cabeçalhos, ajuste automático de largura.

**Casos de uso**: Análises gerenciais, exportação de dados, relatórios impressos.

---

#### **publicController** (`controllers/publicController.js`)
**Propósito**: Endpoints públicos (sem autenticação) para visitantes.

**Métodos principais**:
- `getChampionships(req, res)`: Lista campeonatos públicos (dados básicos).
- `getMatches(req, res)`: Lista partidas com filtro opcional por campeonato, formatado para exibição.
- `getRanking(req, res)`: Ranking público de um campeonato.

**Casos de uso**: Consulta pública de resultados e classificação.

---

### 3. Services
Encapsulam lógicas complexas e reutilizáveis.

#### **GenerateMatchesService** (`services/GenerateMatchesService.js`)
**Propósito**: Gera partidas em formato "Pontos Corridos" (todos contra todos).

**Algoritmo**:
1. Valida lista de times (mínimo 2, únicos, existentes no banco).
2. Embaralha times aleatoriamente.
3. Cria pares combinatórios (todos contra todos) usando loops aninhados.
4. Embaralha ordem das partidas.
5. Cria registros de `Match` e `MatchTeam` em transação atômica.

**Retorno**:
- Sucesso: quantidade de partidas criadas.
- Erro: mensagem de validação ou falha no banco.

**Casos de uso**: Geração automática de tabela de jogos.

---

#### **CalculatePointsService** (`services/CalculatePointsService.js`)
**Propósito**: Calcula pontos de uma partida baseado na modalidade.

**Regras**:
- **Futebol**: Vitória = 3 pts, Empate = 1 pt, Derrota = 0 pt.
- **Vôlei**: Vitória = 3 pts, Derrota = 0 pt (sem empate).

**Algoritmo**:
1. Busca os 2 times da partida (`MatchTeam`).
2. Compara gols/pontos.
3. Calcula pontos de cada time.
4. Atualiza campo `pointsTeam` no banco.

**Casos de uso**: Atualização automática de pontos após registro de placar.

---

#### **ReportsService** (`services/ReportsService.js`)
**Propósito**: Gera dados para relatórios complexos.

**Métodos principais**:
- `getMatchResults(championshipId)`: Busca partidas com times, formata resultados (Time A x Time B).
- `getChampions(championshipId)`: Calcula ranking completo, retorna top 3 com estatísticas (pontos, vitórias, saldo).
- `getPlayersByModality()`: Agrupa jogadores por modalidade do time, conta totais.
- `getTopTeams(championshipId, limit)`: Ranking com critérios de desempate (pontos → saldo → gols marcados → vitórias → derrotas).

**Utilitários**:
- `getStatusLabel(status)`: Converte código numérico em texto ("Agendada", "Finalizada").
- `formatResult(teamA, teamB)`: Formata placar ("Team A 2 x 1 Team B").

**Casos de uso**: Preparação de dados para exportação e visualização.

---

### 4. Middlewares

#### **authenticateToken** (`middleware/auth.js`)
**Propósito**: Verifica autenticação JWT em rotas protegidas.

**Fluxo**:
1. Extrai token do header `Authorization: Bearer <token>`.
2. Valida token com `jwt.verify()` usando `JWT_SECRET`.
3. Busca usuário no banco pelo `userId` decodificado.
4. Anexa usuário a `req.user`.
5. Chama `next()` para continuar.

**Erros tratados**:
- Token ausente: 401 Unauthorized.
- Token inválido: 403 Forbidden.
- Token expirado: 403 Forbidden.
- Usuário não encontrado: 401 Unauthorized.

**Casos de uso**: Proteção de rotas administrativas.

---

#### **requireAdmin** (`middleware/auth.js`)
**Propósito**: Valida se o usuário autenticado é administrador.

**Fluxo**:
1. Verifica `req.user.role === 'admin'`.
2. Se não for admin: retorna 403 Forbidden.
3. Caso contrário: chama `next()`.

**Pré-requisito**: Deve ser usado após `authenticateToken`.

**Casos de uso**: Rotas exclusivas para administradores (CRUD de recursos).

---

### 5. Rotas (Routes)
Definem os endpoints da API REST.

#### **authRoutes** (`routes/authRoutes.js`)
**Endpoints**:
- `POST /auth/register`: Registro de usuário.
- `POST /auth/login`: Login com email/senha.
- `POST /auth/google-login`: Login via Google OAuth.
- `GET /auth/profile`: Perfil do usuário autenticado (protegida).
- `PUT /auth/profile`: Atualização de perfil (protegida).

**Middlewares**: `authenticateToken` (perfil e atualização).

---

#### **teamRoutes** (`routes/teamRoutes.js`)
**Endpoints**:
- `GET /teams`: Listar times.
- `POST /teams`: Criar time.
- `GET /teams/:id`: Buscar time por ID.
- `PUT /teams/:id`: Atualizar time.
- `PATCH /teams/:id`: Atualizar parcialmente.
- `DELETE /teams/:id`: Deletar time.

**Middlewares**: `authenticateToken` + `requireAdmin` (todas as rotas).

---

#### **playerRoutes** (`routes/playerRoutes.js`)
**Endpoints**:
- `GET /players`: Listar jogadores.
- `POST /players`: Criar jogador.
- `GET /players/:id`: Buscar jogador por ID.
- `PUT /players/:id`: Atualizar jogador.
- `PATCH /players/:id`: Atualizar parcialmente.
- `DELETE /players/:id`: Deletar jogador.
- `GET /players/team/:teamId`: Jogadores de um time.
- `GET /players/class/:classId`: Jogadores de uma turma.

**Middlewares**: `authenticateToken` + `requireAdmin` (todas as rotas).

---

#### **classRoutes** (`routes/classRoutes.js`)
**Endpoints**:
- `GET /classes`: Listar turmas.
- `POST /classes`: Criar turma.
- `GET /classes/:id`: Buscar turma por ID.
- `PUT /classes/:id`: Atualizar turma.
- `PATCH /classes/:id`: Atualizar parcialmente.
- `DELETE /classes/:id`: Deletar turma.

**Middlewares**: `authenticateToken` + `requireAdmin`.

---

#### **championshipRoutes** (`routes/championshipRoutes.js`)
**Endpoints**:
- `GET /championships`: Listar campeonatos.
- `POST /championships`: Criar campeonato.
- `GET /championships/:id`: Buscar campeonato por ID.
- `PUT /championships/:id`: Atualizar campeonato.
- `PATCH /championships/:id`: Atualizar parcialmente.
- `DELETE /championships/:id`: Deletar campeonato.
- `GET /championships/:id/ranking`: Ranking do campeonato.
- `GET /championships/:id/teams`: Times do campeonato.
- `POST /championships/:id/teams`: Adicionar time ao campeonato.
- `DELETE /championships/:id/teams/:teamId`: Remover time.
- `POST /championships/:id/generate-matches`: Gerar partidas pontos corridos.
- `POST /championships/:id/knockout-matches`: Gerar confrontos mata-mata.
- `POST /championships/:id/knockout-advance`: Avançar rodada mata-mata.

**Middlewares**: `authenticateToken` + `requireAdmin`.

---

#### **matchRoutes** (`routes/matchRoutes.js`)
**Endpoints**:
- `GET /matches`: Listar partidas (query: `?championshipId=X`).
- `POST /matches`: Criar partida.
- `GET /matches/:id`: Buscar partida por ID.
- `PUT /matches/:id`: Atualizar partida.
- `PATCH /matches/:id`: Atualizar parcialmente.
- `DELETE /matches/:id`: Deletar partida.
- `POST /matches/:id/result`: Registrar resultado (placar).

**Middlewares**: `authenticateToken` + `requireAdmin`.

---

#### **reportsRoutes** (`routes/reportsRoutes.js`)
**Endpoints**:
- `GET /reports/matches/:championshipId`: Resultados de partidas (query: `?format=csv|xlsx`).
- `GET /reports/champions/:championshipId`: Campeões (query: `?format=csv|xlsx`).
- `GET /reports/players-by-modality`: Jogadores por modalidade (query: `?format=csv|xlsx`).
- `GET /reports/top-teams/:championshipId`: Melhores times (query: `?limit=5&format=csv|xlsx`).

**Middlewares**: `authenticateToken` + `requireAdmin`.

---

#### **publicRoutes** (`routes/publicRoutes.js`)
**Endpoints**:
- `GET /public/championships`: Listar campeonatos (sem autenticação).
- `GET /public/matches`: Listar partidas (query: `?championshipId=X`).
- `GET /public/championships/:id/ranking`: Ranking público.

**Middlewares**: Nenhum (rotas públicas).

---

### 6. Configurações

#### **database.js** (`config/database.js`)
**Propósito**: Configura conexão com PostgreSQL via Sequelize.

**Funcionalidades**:
- Carrega variáveis de ambiente (`.env`).
- Valida presença de variáveis obrigatórias (`DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_HOST`).
- Cria instância Sequelize.
- Testa conexão com `authenticate()`.

**Variáveis de ambiente**:
- `DATABASE_NAME`: Nome do banco.
- `DATABASE_USER`: Usuário PostgreSQL.
- `DATABASE_PASSWORD`: Senha.
- `DATABASE_HOST`: Host (ex: `localhost`).
- `DATABASE_DIALECT`: Sempre `postgres`.

**Casos de uso**: Inicialização do ORM, conexão com banco.

---

#### **associations.js** (`models/associations.js`)
**Propósito**: Centraliza relacionamentos Sequelize entre modelos.

**Relacionamentos definidos**:
- `Team` ↔ `Player` (1:N).
- `Class` ↔ `Player` (1:N).
- `Championship` ↔ `Match` (1:N).
- `Match` ↔ `MatchTeam` (1:N).
- `Team` ↔ `MatchTeam` (1:N).
- `Championship` ↔ `Team` (N:N via `ChampionshipTeam`).

**Função `syncDatabase()`**:
- Sincroniza modelos com banco (`alter: true`).
- Migração especial para adicionar coluna `modality` em `Championship` (tipo ENUM PostgreSQL).
- Ordem de sincronização: tabelas independentes → dependentes.

**Casos de uso**: Inicialização do schema, criação de tabelas, migrações.

---

#### **app.js** (`src/app.js`)
**Propósito**: Ponto de entrada da aplicação, inicializa servidor Express.

**Configurações**:
- Middlewares globais: `express.json()`, `cors()`.
- CORS dinâmico: aceita múltiplas origens (`localhost:3000`, URLs de produção), em desenvolvimento aceita qualquer origem.
- Rotas registradas: `/auth`, `/teams`, `/players`, `/classes`, `/championships`, `/matches`, `/reports`, `/public`.
- Porta: definida por `PORT` ou padrão `3001`.
- Logs: origens permitidas, NODE_ENV, FRONTEND_URL.

**Casos de uso**: Inicialização do servidor, configuração de CORS, registro de rotas.

---

## Pontos Fortes e Melhorias
**Pontos fortes**
- Separação clara de camadas (rotas, controllers, services, models).
- API com autenticação JWT e controle de acesso por perfil (admin/user).
- Relatórios com exportação CSV/XLSX para análises externas.
- Páginas públicas para consulta sem login (transparência).
- Validações consistentes nos modelos (Sequelize validators).
- Serviços reutilizáveis para lógicas complexas (geração de partidas, cálculo de pontos).
- Transações atômicas em operações críticas (geração de confrontos).

**Melhorias sugeridas**
- Padronizar respostas de erro em todos os controllers (formato único: `{ error, details }`).
- Centralizar regras de negócio de ranking/relatórios em services (evitar duplicidade entre `publicController` e `championshipController`).
- Adicionar documentação de API (Swagger/OpenAPI) para facilitar integração.
- Criar testes automatizados (unitários e de integração) para rotas e serviços críticos.
- Implementar paginação em endpoints de listagem (players, matches, teams).
- Adicionar logging estruturado (Winston, Pino) para auditoria e debugging.
- Validar tipos e formatos de dados na entrada com biblioteca dedicada (Joi, Yup).
- Implementar soft delete para registros importantes (campeonatos, partidas).
- Adicionar índices de banco para consultas frequentes (foreign keys, campos de busca).
