import dotenv from 'dotenv';

// Carrega variáveis de ambiente para teste
dotenv.config({ path: '.env.test' });

// Configurações globais para os testes
beforeAll(async () => {
  // Setup global que roda antes de todos os testes
  console.log('Setting up tests...');
});

afterAll(async () => {
  // Cleanup global que roda depois de todos os testes
  console.log('Cleaning up tests...');
});
