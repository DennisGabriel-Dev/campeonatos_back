import ReportsService from '../services/ReportsService.js';
import ExcelJS from 'exceljs';

const ReportsController = {
  /**
   * GET /api/reports/matches/:championshipId
   * Retorna resultados das partidas (Time A x Time B)
   */
  async getMatchResults(req, res) {
    try {
      const { championshipId } = req.params;
      const { format } = req.query; // csv, xlsx ou json (padrão)

      const result = await ReportsService.getMatchResults(Number(championshipId));

      if (!result.success) {
        return res.status(404).json(result);
      }

      // Se format for csv ou xlsx, gerar arquivo
      if (format === 'csv') {
        return generateCSV(res, result.data, 'resultados_partidas', [
          { header: 'ID Partida', key: 'matchId' },
          { header: 'Data', key: 'date' },
          { header: 'Status', key: 'status' },
          { header: 'Time A', key: 'teamA.name' },
          { header: 'Gols Time A', key: 'teamA.goals' },
          { header: 'Pontos Time A', key: 'teamA.points' },
          { header: 'Time B', key: 'teamB.name' },
          { header: 'Gols Time B', key: 'teamB.goals' },
          { header: 'Pontos Time B', key: 'teamB.points' },
          { header: 'Resultado', key: 'result' }
        ]);
      }

      if (format === 'xlsx') {
        return generateXLSX(res, result.data, 'resultados_partidas', [
          { header: 'ID Partida', key: 'matchId', width: 12 },
          { header: 'Data', key: 'date', width: 15 },
          { header: 'Status', key: 'status', width: 15 },
          { header: 'Time A', key: 'teamA.name', width: 20 },
          { header: 'Gols Time A', key: 'teamA.goals', width: 12 },
          { header: 'Pontos Time A', key: 'teamA.points', width: 12 },
          { header: 'Time B', key: 'teamB.name', width: 20 },
          { header: 'Gols Time B', key: 'teamB.goals', width: 12 },
          { header: 'Pontos Time B', key: 'teamB.points', width: 12 },
          { header: 'Resultado', key: 'result', width: 25 }
        ]);
      }

      res.status(200).json(result.data);
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao gerar relatório de resultados',
        details: error.message
      });
    }
  },

  /**
   * GET /api/reports/champions/:championshipId
   * Retorna campeões do campeonato (1º, 2º, 3º lugares)
   */
  async getChampions(req, res) {
    try {
      const { championshipId } = req.params;
      const { format } = req.query;

      const result = await ReportsService.getChampions(Number(championshipId));

      if (!result.success) {
        return res.status(404).json(result);
      }

      // Preparar dados para exportação
      const exportData = [
        {
          posicao: '1º',
          time: result.data.champion?.teamName || 'N/A',
          pontos: result.data.champion?.points || 0,
          vitorias: result.data.champion?.wins || 0,
          empates: result.data.champion?.draws || 0,
          derrotas: result.data.champion?.losses || 0,
          golsMarcados: result.data.champion?.goalsFor || 0,
          golsSofridos: result.data.champion?.goalsAgainst || 0,
          saldoGols: result.data.champion?.goalDifference || 0
        },
        {
          posicao: '2º',
          time: result.data.runnerUp?.teamName || 'N/A',
          pontos: result.data.runnerUp?.points || 0,
          vitorias: result.data.runnerUp?.wins || 0,
          empates: result.data.runnerUp?.draws || 0,
          derrotas: result.data.runnerUp?.losses || 0,
          golsMarcados: result.data.runnerUp?.goalsFor || 0,
          golsSofridos: result.data.runnerUp?.goalsAgainst || 0,
          saldoGols: result.data.runnerUp?.goalDifference || 0
        },
        {
          posicao: '3º',
          time: result.data.thirdPlace?.teamName || 'N/A',
          pontos: result.data.thirdPlace?.points || 0,
          vitorias: result.data.thirdPlace?.wins || 0,
          empates: result.data.thirdPlace?.draws || 0,
          derrotas: result.data.thirdPlace?.losses || 0,
          golsMarcados: result.data.thirdPlace?.goalsFor || 0,
          golsSofridos: result.data.thirdPlace?.goalsAgainst || 0,
          saldoGols: result.data.thirdPlace?.goalDifference || 0
        }
      ];

      if (format === 'csv') {
        return generateCSV(res, exportData, 'campeoes', [
          { header: 'Posição', key: 'posicao' },
          { header: 'Time', key: 'time' },
          { header: 'Pontos', key: 'pontos' },
          { header: 'Vitórias', key: 'vitorias' },
          { header: 'Empates', key: 'empates' },
          { header: 'Derrotas', key: 'derrotas' },
          { header: 'Gols Marcados', key: 'golsMarcados' },
          { header: 'Gols Sofridos', key: 'golsSofridos' },
          { header: 'Saldo de Gols', key: 'saldoGols' }
        ]);
      }

      if (format === 'xlsx') {
        return generateXLSX(res, exportData, 'campeoes', [
          { header: 'Posição', key: 'posicao', width: 10 },
          { header: 'Time', key: 'time', width: 25 },
          { header: 'Pontos', key: 'pontos', width: 10 },
          { header: 'Vitórias', key: 'vitorias', width: 10 },
          { header: 'Empates', key: 'empates', width: 10 },
          { header: 'Derrotas', key: 'derrotas', width: 10 },
          { header: 'Gols Marcados', key: 'golsMarcados', width: 15 },
          { header: 'Gols Sofridos', key: 'golsSofridos', width: 15 },
          { header: 'Saldo de Gols', key: 'saldoGols', width: 15 }
        ]);
      }

      res.status(200).json(result.data);
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao gerar relatório de campeões',
        details: error.message
      });
    }
  },

  /**
   * GET /api/reports/players-by-modality
   * Retorna quantidade de jogadores por modalidade
   */
  async getPlayersByModality(req, res) {
    try {
      const { format } = req.query;

      const result = await ReportsService.getPlayersByModality();

      if (!result.success) {
        return res.status(500).json(result);
      }

      if (format === 'csv') {
        return generateCSV(res, result.data.byModality, 'jogadores_por_modalidade', [
          { header: 'Modalidade', key: 'modality' },
          { header: 'Total de Jogadores', key: 'totalPlayers' },
          { header: 'Total de Times', key: 'totalTeams' }
        ]);
      }

      if (format === 'xlsx') {
        return generateXLSX(res, result.data.byModality, 'jogadores_por_modalidade', [
          { header: 'Modalidade', key: 'modality', width: 20 },
          { header: 'Total de Jogadores', key: 'totalPlayers', width: 20 },
          { header: 'Total de Times', key: 'totalTeams', width: 15 }
        ]);
      }

      res.status(200).json(result.data);
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao gerar relatório de jogadores por modalidade',
        details: error.message
      });
    }
  },

  /**
   * GET /api/reports/top-teams/:championshipId
   * Retorna melhores times de uma competição
   */
  async getTopTeams(req, res) {
    try {
      const { championshipId } = req.params;
      const { limit = 5, format } = req.query;

      const result = await ReportsService.getTopTeams(Number(championshipId), Number(limit));

      if (!result.success) {
        return res.status(404).json(result);
      }

      // Preparar dados para exportação
      const exportData = result.data.ranking.map(team => ({
        posicao: team.position,
        time: team.teamName,
        pontos: team.points,
        vitorias: team.wins,
        empates: team.draws,
        derrotas: team.losses,
        golsMarcados: team.goalsFor,
        golsSofridos: team.goalsAgainst,
        saldoGols: team.goalDifference,
        partidasJogadas: team.matchesPlayed,
        percentualVitorias: `${team.winRate}%`
      }));

      if (format === 'csv') {
        return generateCSV(res, exportData, 'melhores_times', [
          { header: 'Posição', key: 'posicao' },
          { header: 'Time', key: 'time' },
          { header: 'Pontos', key: 'pontos' },
          { header: 'Vitórias', key: 'vitorias' },
          { header: 'Empates', key: 'empates' },
          { header: 'Derrotas', key: 'derrotas' },
          { header: 'Gols Marcados', key: 'golsMarcados' },
          { header: 'Gols Sofridos', key: 'golsSofridos' },
          { header: 'Saldo de Gols', key: 'saldoGols' },
          { header: 'Partidas Jogadas', key: 'partidasJogadas' },
          { header: '% Vitórias', key: 'percentualVitorias' }
        ]);
      }

      if (format === 'xlsx') {
        return generateXLSX(res, exportData, 'melhores_times', [
          { header: 'Posição', key: 'posicao', width: 10 },
          { header: 'Time', key: 'time', width: 25 },
          { header: 'Pontos', key: 'pontos', width: 10 },
          { header: 'Vitórias', key: 'vitorias', width: 10 },
          { header: 'Empates', key: 'empates', width: 10 },
          { header: 'Derrotas', key: 'derrotas', width: 10 },
          { header: 'Gols Marcados', key: 'golsMarcados', width: 15 },
          { header: 'Gols Sofridos', key: 'golsSofridos', width: 15 },
          { header: 'Saldo de Gols', key: 'saldoGols', width: 15 },
          { header: 'Partidas Jogadas', key: 'partidasJogadas', width: 18 },
          { header: '% Vitórias', key: 'percentualVitorias', width: 12 }
        ]);
      }

      res.status(200).json(result.data);
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao gerar relatório de melhores times',
        details: error.message
      });
    }
  }
};

/**
 * Função auxiliar para gerar CSV
 */
function generateCSV(res, data, filename, columns) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}_${Date.now()}.csv"`);

  // Transformar dados para o formato CSV
  const transformedData = data.map(row => {
    const newRow = {};
    columns.forEach(col => {
      const keys = col.key.split('.');
      let value = row;
      keys.forEach(key => {
        value = value?.[key];
      });
      newRow[col.header] = value ?? '';
    });
    return newRow;
  });

  // Adicionar cabeçalhos
  const headers = columns.map(col => col.header);
  const csvContent = [
    headers.join(','),
    ...transformedData.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escapar valores que contêm vírgula ou aspas
        if (value && (value.toString().includes(',') || value.toString().includes('"'))) {
          return `"${value.toString().replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',')
    )
  ].join('\n');

  // Adicionar BOM para UTF-8 (garantir caracteres especiais no Excel)
  res.write('\ufeff');
  res.write(csvContent);
  res.end();
}

/**
 * Função auxiliar para gerar XLSX
 */
async function generateXLSX(res, data, filename, columns) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Relatório');

  // Adicionar cabeçalhos
  worksheet.columns = columns.map(col => ({
    header: col.header,
    key: col.key,
    width: col.width || 15
  }));

  // Formatar cabeçalhos
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };

  // Adicionar dados
  data.forEach(row => {
    const newRow = {};
    columns.forEach(col => {
      const keys = col.key.split('.');
      let value = row;
      keys.forEach(key => {
        value = value?.[key];
      });
      newRow[col.key] = value ?? '';
    });
    worksheet.addRow(newRow);
  });

  // Ajustar largura das colunas automaticamente
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: false }, (cell) => {
      const columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = maxLength < 10 ? 10 : maxLength + 2;
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}_${Date.now()}.xlsx"`);

  await workbook.xlsx.write(res);
  res.end();
}

export default ReportsController;

