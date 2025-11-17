import Match from "../models/match.js";
import MatchTeam from "../models/match_team.js";
import Team from "../models/team.js";
import sequelize from "../config/database.js";

const GenerateMatches = async ({ championship, teamIds }) => {
  if (!championship) {
    return {
      message: 'Campeonato não informado',
      success: false,
      status: 400
    };
  }

  if (!Array.isArray(teamIds) || teamIds.length < 2) {
    return {
      message: 'Informe pelo menos dois times para gerar partidas',
      success: false,
      status: 400
    };
  }

  const normalizedTeamIds = [...new Set(
    teamIds
      .map((teamId) => Number(teamId))
      .filter((teamId) => Number.isInteger(teamId) && teamId > 0)
  )];

  if (normalizedTeamIds.length < 2) {
    return {
      message: 'Não há times suficientes após validar os IDs informados',
      success: false,
      status: 400
    };
  }

  const existingTeams = await Team.findAll({
    where: { id: normalizedTeamIds },
    attributes: ['id']
  });

  if (existingTeams.length !== normalizedTeamIds.length) {
    return {
      message: 'Alguns times informados não foram encontrados',
      success: false,
      status: 404
    };
  }

  const teamIdList = normalizedTeamIds.sort(() => Math.random() - 0.5);
  const matchPairs = [];

  for (let index = 0; index < teamIdList.length; index += 1) {
    for (let inner = index + 1; inner < teamIdList.length; inner += 1) {
      matchPairs.push([teamIdList[index], teamIdList[inner]]);
    }
  }

  matchPairs.sort(() => Math.random() - 0.5);

  const transaction = await sequelize.transaction();

  try {
    const createdMatches = [];

    for (const [homeTeamId, awayTeamId] of matchPairs) {
      const match = await Match.create({
        championshipId: championship.id,
        status: 0
      }, { transaction });

      await MatchTeam.bulkCreate([
        {
          matchId: match.id,
          teamId: homeTeamId
        },
        {
          matchId: match.id,
          teamId: awayTeamId
        }
      ], { transaction });

      createdMatches.push(match);
    }

    await transaction.commit();

    return {
      message: 'Partidas geradas com sucesso',
      success: true,
      status: 201,
      data: {
        matchesCreated: createdMatches.length
      }
    };
  } catch (error) {
    await transaction.rollback();
    return {
      message: 'Erro ao gerar partidas',
      success: false,
      status: 500,
      details: error.message
    };
  }
};

export default GenerateMatches;