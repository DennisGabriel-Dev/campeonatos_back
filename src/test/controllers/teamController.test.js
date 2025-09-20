import { jest } from '@jest/globals';

// Mock completo do modelo Team
const mockTeam = {
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  destroy: jest.fn(),
  update: jest.fn(),
  save: jest.fn()
};

// Mock do módulo team.js
jest.unstable_mockModule('../../models/team.js', () => ({
  default: mockTeam
}));

const TeamController = (await import('../../controllers/teamController.js')).default;

// Mocks para req e res
const mockRequest = (body = {}, params = {}) => ({
  body,
  params
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('TeamController', () => {
  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
  });

  describe('getTeams', () => {
    test('deve retornar lista vazia quando não há teams', async () => {
      mockTeam.findAll.mockResolvedValue([]);

      const req = mockRequest();
      const res = mockResponse();

      await TeamController.getTeams(req, res);

      expect(mockTeam.findAll).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(JSON.stringify([]));
    });

    test('deve retornar todos os teams', async () => {
      const teamsData = [
        { id: 1, name: 'Barcelona', modality: 'Futebol' },
        { id: 2, name: 'Lakers', modality: 'Basquete' }
      ];

      mockTeam.findAll.mockResolvedValue(teamsData);

      const req = mockRequest();
      const res = mockResponse();

      await TeamController.getTeams(req, res);

      expect(mockTeam.findAll).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalled();
      const responseData = JSON.parse(res.send.mock.calls[0][0]);
      expect(responseData).toHaveLength(2);
      expect(responseData[0].name).toBe('Barcelona');
      expect(responseData[1].name).toBe('Lakers');
    });

    test('deve lidar com erro do banco de dados', async () => {
      mockTeam.findAll.mockRejectedValue(new Error('Database error'));
      
      const req = mockRequest();
      const res = mockResponse();

      await expect(TeamController.getTeams(req, res)).rejects.toThrow('Database error');
      expect(mockTeam.findAll).toHaveBeenCalled();
    });
  });

  describe('createTeam', () => {
    test('deve criar um novo team com dados válidos', async () => {
      const teamData = {
        name: 'Barcelona',
        modality: 'Futebol'
      };

      const createdTeam = { id: 1, ...teamData, createdAt: new Date(), updatedAt: new Date() };
      mockTeam.create.mockResolvedValue(createdTeam);

      const req = mockRequest(teamData);
      const res = mockResponse();

      await TeamController.createTeam(req, res);

      expect(mockTeam.create).toHaveBeenCalledWith(teamData);
      expect(res.send).toHaveBeenCalled();
      const responseData = JSON.parse(res.send.mock.calls[0][0]);
      expect(responseData.name).toBe(teamData.name);
      expect(responseData.modality).toBe(teamData.modality);
      expect(responseData.id).toBeDefined();
    });

    test('deve falhar ao criar team sem dados obrigatórios', async () => {
      mockTeam.create.mockRejectedValue(new Error('notNull Violation: name cannot be null'));
      
      const req = mockRequest({ name: 'Barcelona' }); // Sem modality
      const res = mockResponse();

      await expect(TeamController.createTeam(req, res)).rejects.toThrow();
      expect(mockTeam.create).toHaveBeenCalled();
    });
  });

  describe('getTeamById', () => {
    test('deve retornar team existente por ID', async () => {
      const team = { id: 1, name: 'Barcelona', modality: 'Futebol' };
      mockTeam.findByPk.mockResolvedValue(team);

      const req = mockRequest({}, { id: '1' });
      const res = mockResponse();

      await TeamController.getTeamById(req, res);

      expect(mockTeam.findByPk).toHaveBeenCalledWith('1');
      expect(res.send).toHaveBeenCalled();
      const responseData = JSON.parse(res.send.mock.calls[0][0]);
      expect(responseData.id).toBe(team.id);
      expect(responseData.name).toBe(team.name);
    });

    test('deve retornar 404 para team inexistente', async () => {
      mockTeam.findByPk.mockResolvedValue(null);

      const req = mockRequest({}, { id: '999' });
      const res = mockResponse();

      await TeamController.getTeamById(req, res);

      expect(mockTeam.findByPk).toHaveBeenCalledWith('999');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ error: 'Team not found' });
    });
  });

  describe('updateTeam', () => {
    test('deve atualizar team existente', async () => {
      const originalTeam = { id: 1, name: 'Barcelona', modality: 'Futebol', save: jest.fn() };
      const updateData = { name: 'FC Barcelona', modality: 'Football' };

      mockTeam.findByPk.mockResolvedValue(originalTeam);
      originalTeam.save.mockResolvedValue();

      // Simular a atualização dos campos
      originalTeam.name = updateData.name;
      originalTeam.modality = updateData.modality;

      const req = mockRequest(updateData, { id: '1' });
      const res = mockResponse();

      await TeamController.updateTeam(req, res);

      expect(mockTeam.findByPk).toHaveBeenCalledWith('1');
      expect(originalTeam.save).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalled();
      const responseData = JSON.parse(res.send.mock.calls[0][0]);
      expect(responseData.name).toBe(updateData.name);
      expect(responseData.modality).toBe(updateData.modality);
    });

    test('deve retornar 404 para team inexistente', async () => {
      mockTeam.findByPk.mockResolvedValue(null);

      const req = mockRequest({ name: 'New Name' }, { id: '999' });
      const res = mockResponse();

      await TeamController.updateTeam(req, res);

      expect(mockTeam.findByPk).toHaveBeenCalledWith('999');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ error: 'Team not found' });
    });
  });

  describe('deleteTeam', () => {
    test('deve excluir team existente', async () => {
      const team = { id: 1, name: 'Barcelona', modality: 'Futebol', destroy: jest.fn() };
      mockTeam.findByPk.mockResolvedValue(team);
      team.destroy.mockResolvedValue();

      const req = mockRequest({}, { id: '1' });
      const res = mockResponse();

      await TeamController.deleteTeam(req, res);

      expect(mockTeam.findByPk).toHaveBeenCalledWith('1');
      expect(team.destroy).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({ message: 'Team deleted successfully' });
    });

    test('deve retornar 404 para team inexistente', async () => {
      mockTeam.findByPk.mockResolvedValue(null);

      const req = mockRequest({}, { id: '999' });
      const res = mockResponse();

      await TeamController.deleteTeam(req, res);

      expect(mockTeam.findByPk).toHaveBeenCalledWith('999');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ error: 'Team not found' });
    });
  });

  describe('Tratamento de Erros', () => {
    test('deve propagar erros de banco de dados no createTeam', async () => {
      mockTeam.create.mockRejectedValue(new Error('Database connection failed'));

      const req = mockRequest({ name: 'Test', modality: 'Test' });
      const res = mockResponse();

      await expect(TeamController.createTeam(req, res)).rejects.toThrow('Database connection failed');
      expect(mockTeam.create).toHaveBeenCalled();
    });

    test('deve propagar erros de banco de dados no findByPk', async () => {
      mockTeam.findByPk.mockRejectedValue(new Error('Database connection failed'));

      const req = mockRequest({}, { id: '1' });
      const res = mockResponse();

      await expect(TeamController.getTeamById(req, res)).rejects.toThrow('Database connection failed');
      expect(mockTeam.findByPk).toHaveBeenCalled();
    });
  });
});