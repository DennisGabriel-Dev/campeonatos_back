# Campeonatos Backend
## 1. Instale as depedências:
```
npm install
```
## 2. Configure a .env
```
DATABASE_USER=<usuario_db>
DATABASE_PASSWORD=<senha_db>
DATABASE_NAME=<nome_db>
DATABASE_HOST=localhost
DATABASE_DIALECT=postgres

JWT_SECRET=<chave_secreta_jwt>
PORT=<porta>
NODE_ENV=development

# URL do Frontend
FRONTEND_URL=http://localhost:3000  
```
obs: antes de executar, o banco de dados com o nome presente no DATABASE_NAME deve estar criado previamente no postgreSQL.


## 3. Dentro do Repositório executar:
```
nodemon ./src/app.js
```
ou
```
node ./src/app.js
``` 
