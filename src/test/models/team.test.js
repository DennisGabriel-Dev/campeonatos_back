import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.test.js';

// Definir o modelo Team para testes
const Team = sequelize.define('Team', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  modality: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

describe('Team Model', () => {
  beforeAll(async () => {
    // Sincronizar o banco de dados antes dos testes
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Fechar conexão após os testes
    await sequelize.close();
  });

  beforeEach(async () => {
    // Limpar dados antes de cada teste
    await Team.destroy({ where: {} });
  });

  describe('Criação de Team', () => {
    test('deve criar um team com dados válidos', async () => {
      const teamData = {
        name: 'Barcelona',
        modality: 'Futebol'
      };

      const team = await Team.create(teamData);

      expect(team.id).toBeDefined();
      expect(team.name).toBe(teamData.name);
      expect(team.modality).toBe(teamData.modality);
      expect(team.createdAt).toBeDefined();
      expect(team.updatedAt).toBeDefined();
    });

    test('deve falhar ao criar team sem nome', async () => {
      const teamData = {
        modality: 'Futebol'
      };

      await expect(Team.create(teamData)).rejects.toThrow();
    });

    test('deve falhar ao criar team sem modalidade', async () => {
      const teamData = {
        name: 'Barcelona'
      };

      await expect(Team.create(teamData)).rejects.toThrow();
    });
  });

  describe('Busca de Teams', () => {
    beforeEach(async () => {
      // Criar alguns teams para os testes de busca
      await Team.bulkCreate([
        { name: 'Barcelona', modality: 'Futebol' },
        { name: 'Lakers', modality: 'Basquete' },
        { name: 'Real Madrid', modality: 'Futebol' }
      ]);
    });

    test('deve buscar todos os teams', async () => {
      const teams = await Team.findAll();
      expect(teams).toHaveLength(3);
    });

    test('deve buscar team por ID', async () => {
      const teams = await Team.findAll();
      const firstTeam = teams[0];

      const foundTeam = await Team.findByPk(firstTeam.id);

      expect(foundTeam).toBeDefined();
      expect(foundTeam.name).toBe(firstTeam.name);
    });

    test('deve buscar teams por modalidade', async () => {
      const footballTeams = await Team.findAll({
        where: { modality: 'Futebol' }
      });

      expect(footballTeams).toHaveLength(2);
      footballTeams.forEach(team => {
        expect(team.modality).toBe('Futebol');
      });
    });
  });

  describe('Atualização de Team', () => {
    test('deve atualizar um team existente', async () => {
      const team = await Team.create({
        name: 'Barcelona',
        modality: 'Futebol'
      });

      const updatedData = {
        name: 'FC Barcelona',
        modality: 'Football'
      };

      await team.update(updatedData);

      expect(team.name).toBe(updatedData.name);
      expect(team.modality).toBe(updatedData.modality);
    });

    test('deve atualizar apenas campos especificados', async () => {
      const team = await Team.create({
        name: 'Barcelona',
        modality: 'Futebol'
      });

      const originalModality = team.modality;

      await team.update({ name: 'FC Barcelona' });

      expect(team.name).toBe('FC Barcelona');
      expect(team.modality).toBe(originalModality);
    });
  });

  describe('Exclusão de Team', () => {
    test('deve excluir um team existente', async () => {
      const team = await Team.create({
        name: 'Barcelona',
        modality: 'Futebol'
      });

      await team.destroy();

      const foundTeam = await Team.findByPk(team.id);
      expect(foundTeam).toBeNull();
    });

    test('deve excluir múltiplos teams', async () => {
      await Team.bulkCreate([
        { name: 'Barcelona', modality: 'Futebol' },
        { name: 'Real Madrid', modality: 'Futebol' }
      ]);

      const deletedCount = await Team.destroy({
        where: { modality: 'Futebol' }
      });

      expect(deletedCount).toBe(2);

      const remainingTeams = await Team.findAll();
      expect(remainingTeams).toHaveLength(0);
    });
  });
});
