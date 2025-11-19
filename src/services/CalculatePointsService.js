import MatchTeam from "../models/match_team.js";
import Team from "../models/team.js";

const CalculatePointsService = async ({ matchId, championshipModality }) => {
  try {
    const matchTeams = await MatchTeam.findAll({
      where: { matchId },
      include: [
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name', 'modality']
        }
      ]
    });

    if (matchTeams.length !== 2) {
      return {
        success: false,
        message: 'A partida deve ter exatamente 2 times'
      };
    }

    const [team1, team2] = matchTeams;
    const goals1 = team1.goalsTeam || 0;
    const goals2 = team2.goalsTeam || 0;

    let points1 = 0;
    let points2 = 0;

    if (championshipModality === 'Futebol') {
      // Futebol: Vitória = 3, Empate = 1, Derrota = 0
      if (goals1 > goals2) {
        points1 = 3;
        points2 = 0;
      } else if (goals2 > goals1) {
        points1 = 0;
        points2 = 3;
      } else {
        points1 = 1;
        points2 = 1;
      }
    } else if (championshipModality === 'Vôlei') {
      // Vôlei: Vitória = 3, Derrota = 0 (sem empate)
      if (goals1 > goals2) {
        points1 = 3;
        points2 = 0;
      } else if (goals2 > goals1) {
        points1 = 0;
        points2 = 3;
      }
      // Se empate em vôlei, ambos ficam com 0 (não deveria acontecer)
    }

    // Atualizar pontos
    team1.pointsTeam = points1;
    team2.pointsTeam = points2;
    await team1.save();
    await team2.save();

    return {
      success: true,
      points: {
        team1: { id: team1.teamId, points: points1 },
        team2: { id: team2.teamId, points: points2 }
      }
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao calcular pontuação',
      details: error.message
    };
  }
};

export default CalculatePointsService;

