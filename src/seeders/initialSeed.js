import sequelize from "../config/database.js";
import "../models/associations.js";
import Championship from "../models/championship.js";
import Team from "../models/team.js";
import Class from "../models/class.js";
import Player from "../models/player.js";
import Match from "../models/match.js";
import MatchTeam from "../models/match_team.js";
import ChampionshipTeam from "../models/championship_team.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

const seed = async () => {
  try {
    await sequelize.sync();

    const championshipsToEnsure = [
      { name: "Copa Escolar", year: 2025, modality: "Futebol" },
      { name: "Torneio de Inverno", year: 2025, modality: "Futebol" },
      { name: "Liga Universitária", year: 2026, modality: "Futebol" },
      { name: "Campeonato de Vôlei 2025", year: 2025, modality: "Vôlei" },
      { name: "Copa Primavera", year: 2025, modality: "Futebol" },
      { name: "Liga de Vôlei 2026", year: 2026, modality: "Vôlei" }
    ];

    const championshipRegistry = {};

    for (const championshipData of championshipsToEnsure) {
      const [championship] = await Championship.findOrCreate({
        where: { name: championshipData.name },
        defaults: championshipData
      });
      championshipRegistry[championshipData.name] = championship;
    }

    const classesToEnsure = [
      {
        name: "Informática A",
        description: "Turma de Informática focada em desenvolvimento web",
        year: 2025,
        semester: "1",
        course: "Informática",
        maxStudents: 30
      },
      {
        name: "Informática B",
        description: "Turma de Informática focada em redes",
        year: 2025,
        semester: "2",
        course: "Informática",
        maxStudents: 30
      },
      {
        name: "Informática C",
        description: "Turma de Informática focada em segurança",
        year: 2025,
        semester: "1",
        course: "Informática",
        maxStudents: 25
      },
      {
        name: "Administração A",
        description: "Turma de Administração com foco em gestão esportiva",
        year: 2025,
        semester: "1",
        course: "Administração",
        maxStudents: 35
      },
      {
        name: "Administração B",
        description: "Turma de Administração com foco em marketing",
        year: 2025,
        semester: "2",
        course: "Administração",
        maxStudents: 35
      },
      {
        name: "Enfermagem A",
        description: "Turma de Enfermagem do primeiro semestre",
        year: 2025,
        semester: "1",
        course: "Enfermagem",
        maxStudents: 40
      },
      {
        name: "Enfermagem B",
        description: "Turma de Enfermagem do segundo semestre",
        year: 2025,
        semester: "2",
        course: "Enfermagem",
        maxStudents: 40
      },
      {
        name: "Edificações A",
        description: "Turma de Edificações focada em construção civil",
        year: 2025,
        semester: "1",
        course: "Edificações",
        maxStudents: 28
      }
    ];

    const classRegistry = {};

    for (const classData of classesToEnsure) {
      const [classItem] = await Class.findOrCreate({
        where: { name: classData.name },
        defaults: classData
      });

      classRegistry[classData.name] = classItem;
    }

    const predefinedTeams = [
      { name: "Lobos Azuis", modality: "Futebol" },
      { name: "Fênix Dourada", modality: "Futebol" },
      { name: "Tigres Verdes", modality: "Futebol" },
      { name: "Leões Negros", modality: "Futebol" },
      { name: "Águias Brancas", modality: "Futebol" },
      { name: "Dragões Vermelhos", modality: "Futebol" },
      { name: "Corujas Brancas", modality: "Futsal" },
      { name: "Panteras Vermelhas", modality: "Futsal" },
      { name: "Onças Listradas", modality: "Basquete" },
      { name: "Raposas Rápidas", modality: "Basquete" },
      { name: "Sharks Azuis", modality: "Vôlei" },
      { name: "Falcões Dourados", modality: "Vôlei" },
      { name: "Lobos do Mar", modality: "Vôlei" },
      { name: "Trovões", modality: "Vôlei" },
      { name: "Tempestade", modality: "Vôlei" }
    ];

    const teamRegistry = {};

    for (const teamData of predefinedTeams) {
      const [teamItem] = await Team.findOrCreate({
        where: { name: teamData.name },
        defaults: teamData
      });
      teamRegistry[teamData.name] = teamItem;
    }

    const playerSeeds = [
      // Informática A - Futebol
      { name: "Alex Costa", age: 18, className: "Informática A", teamName: "Lobos Azuis" },
      { name: "Bianca Souza", age: 17, className: "Informática A", teamName: "Fênix Dourada" },
      { name: "Gabriel Alves", age: 21, className: "Informática A", teamName: "Lobos Azuis" },
      { name: "Igor Pereira", age: 20, className: "Informática A", teamName: "Fênix Dourada" },
      { name: "Mariana Rocha", age: 18, className: "Informática A", teamName: "Tigres Verdes" },
      { name: "Paulo Henrique", age: 22, className: "Informática A", teamName: "Leões Negros" },
      { name: "Rafael Silva", age: 19, className: "Informática A", teamName: "Águias Brancas" },
      { name: "Sofia Oliveira", age: 20, className: "Informática A", teamName: "Dragões Vermelhos" },
      
      // Informática B - Futebol
      { name: "Carlos Lima", age: 19, className: "Informática B", teamName: "Tigres Verdes" },
      { name: "Daniela Santos", age: 18, className: "Informática B", teamName: "Leões Negros" },
      { name: "Helena Martins", age: 18, className: "Informática B", teamName: "Lobos Azuis" },
      { name: "Lucas Mendes", age: 22, className: "Informática B", teamName: "Fênix Dourada" },
      { name: "Nicolas Prado", age: 19, className: "Informática B", teamName: "Tigres Verdes" },
      { name: "Queila Dias", age: 20, className: "Informática B", teamName: "Leões Negros" },
      { name: "Thiago Santos", age: 21, className: "Informática B", teamName: "Águias Brancas" },
      { name: "Vanessa Costa", age: 19, className: "Informática B", teamName: "Dragões Vermelhos" },
      
      // Informática C - Futsal
      { name: "André Luiz", age: 20, className: "Informática C", teamName: "Corujas Brancas" },
      { name: "Beatriz Lima", age: 18, className: "Informática C", teamName: "Panteras Vermelhas" },
      { name: "Diego Almeida", age: 19, className: "Informática C", teamName: "Corujas Brancas" },
      { name: "Elena Ferreira", age: 21, className: "Informática C", teamName: "Panteras Vermelhas" },
      
      // Administração A - Basquete
      { name: "Eduardo Fernandes", age: 20, className: "Administração A", teamName: "Onças Listradas" },
      { name: "Fernanda Ribeiro", age: 19, className: "Administração A", teamName: "Raposas Rápidas" },
      { name: "Júlia Carvalho", age: 21, className: "Administração A", teamName: "Onças Listradas" },
      { name: "Olívia Farias", age: 17, className: "Administração A", teamName: "Raposas Rápidas" },
      { name: "Pedro Henrique", age: 22, className: "Administração A", teamName: "Onças Listradas" },
      { name: "Renata Alves", age: 20, className: "Administração A", teamName: "Raposas Rápidas" },
      
      // Administração B - Vôlei
      { name: "Bruno Martins", age: 19, className: "Administração B", teamName: "Sharks Azuis" },
      { name: "Camila Souza", age: 18, className: "Administração B", teamName: "Falcões Dourados" },
      { name: "Felipe Rocha", age: 21, className: "Administração B", teamName: "Lobos do Mar" },
      { name: "Giovanna Lima", age: 20, className: "Administração B", teamName: "Trovões" },
      { name: "Henrique Silva", age: 19, className: "Administração B", teamName: "Tempestade" },
      { name: "Isabela Costa", age: 22, className: "Administração B", teamName: "Sharks Azuis" },
      
      // Enfermagem A - Vôlei
      { name: "João Pedro", age: 20, className: "Enfermagem A", teamName: "Falcões Dourados" },
      { name: "Karina Mendes", age: 19, className: "Enfermagem A", teamName: "Lobos do Mar" },
      { name: "Leonardo Dias", age: 21, className: "Enfermagem A", teamName: "Trovões" },
      { name: "Mariana Farias", age: 18, className: "Enfermagem A", teamName: "Tempestade" },
      { name: "Natália Prado", age: 20, className: "Enfermagem A", teamName: "Sharks Azuis" },
      
      // Enfermagem B - Vôlei
      { name: "Otávio Alves", age: 19, className: "Enfermagem B", teamName: "Falcões Dourados" },
      { name: "Patrícia Santos", age: 22, className: "Enfermagem B", teamName: "Lobos do Mar" },
      { name: "Ricardo Pereira", age: 21, className: "Enfermagem B", teamName: "Trovões" },
      { name: "Sabrina Oliveira", age: 18, className: "Enfermagem B", teamName: "Tempestade" },
      
      // Edificações A - Futebol
      { name: "Túlio Costa", age: 20, className: "Edificações A", teamName: "Águias Brancas" },
      { name: "Úrsula Lima", age: 19, className: "Edificações A", teamName: "Dragões Vermelhos" },
      { name: "Vitor Almeida", age: 21, className: "Edificações A", teamName: "Lobos Azuis" },
      { name: "Wagner Silva", age: 22, className: "Edificações A", teamName: "Fênix Dourada" },
      { name: "Yasmin Ferreira", age: 18, className: "Edificações A", teamName: "Tigres Verdes" },
      { name: "Zeca Rocha", age: 20, className: "Edificações A", teamName: "Leões Negros" }
    ];

    for (const playerData of playerSeeds) {
      const classItem = classRegistry[playerData.className];
      const teamItem = teamRegistry[playerData.teamName];

      if (!classItem || !teamItem) {
        continue;
      }

      await Player.findOrCreate({
        where: {
          name: playerData.name,
          classId: classItem.id
        },
        defaults: {
          age: playerData.age,
          classId: classItem.id,
          teamId: teamItem.id
        }
      });
    }

    // Criar usuários
    const usersToEnsure = [
      {
        name: "Admin Sistema",
        email: "admin@campeonato.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin"
      },
      {
        name: "João Silva",
        email: "joao.silva@campeonato.com",
        password: await bcrypt.hash("user123", 10),
        role: "user"
      },
      {
        name: "Maria Santos",
        email: "maria.santos@campeonato.com",
        password: await bcrypt.hash("user123", 10),
        role: "user"
      },
      {
        name: "Pedro Oliveira",
        email: "pedro.oliveira@campeonato.com",
        password: await bcrypt.hash("user123", 10),
        role: "user"
      }
    ];

    for (const userData of usersToEnsure) {
      await User.findOrCreate({
        where: { email: userData.email },
        defaults: userData
      });
    }

    // Criar relacionamentos ChampionshipTeam
    // Copa Escolar - Futebol
    const copaEscolar = championshipRegistry["Copa Escolar"];
    const timesFutebol = [
      teamRegistry["Lobos Azuis"],
      teamRegistry["Fênix Dourada"],
      teamRegistry["Tigres Verdes"],
      teamRegistry["Leões Negros"],
      teamRegistry["Águias Brancas"],
      teamRegistry["Dragões Vermelhos"]
    ];
    for (const team of timesFutebol) {
      await ChampionshipTeam.findOrCreate({
        where: {
          championshipId: copaEscolar.id,
          teamId: team.id
        }
      });
    }

    // Torneio de Inverno - Futebol
    const torneioInverno = championshipRegistry["Torneio de Inverno"];
    const timesInverno = [
      teamRegistry["Lobos Azuis"],
      teamRegistry["Fênix Dourada"],
      teamRegistry["Tigres Verdes"],
      teamRegistry["Leões Negros"]
    ];
    for (const team of timesInverno) {
      await ChampionshipTeam.findOrCreate({
        where: {
          championshipId: torneioInverno.id,
          teamId: team.id
        }
      });
    }

    // Liga Universitária - Futebol
    const ligaUniversitária = championshipRegistry["Liga Universitária"];
    for (const team of timesFutebol) {
      await ChampionshipTeam.findOrCreate({
        where: {
          championshipId: ligaUniversitária.id,
          teamId: team.id
        }
      });
    }

    // Campeonato de Vôlei 2025
    const campeonatoVolei = championshipRegistry["Campeonato de Vôlei 2025"];
    const timesVolei = [
      teamRegistry["Sharks Azuis"],
      teamRegistry["Falcões Dourados"],
      teamRegistry["Lobos do Mar"],
      teamRegistry["Trovões"],
      teamRegistry["Tempestade"]
    ];
    for (const team of timesVolei) {
      await ChampionshipTeam.findOrCreate({
        where: {
          championshipId: campeonatoVolei.id,
          teamId: team.id
        }
      });
    }

    // Copa Primavera - Futebol
    const copaPrimavera = championshipRegistry["Copa Primavera"];
    const timesPrimavera = [
      teamRegistry["Lobos Azuis"],
      teamRegistry["Fênix Dourada"],
      teamRegistry["Águias Brancas"],
      teamRegistry["Dragões Vermelhos"]
    ];
    for (const team of timesPrimavera) {
      await ChampionshipTeam.findOrCreate({
        where: {
          championshipId: copaPrimavera.id,
          teamId: team.id
        }
      });
    }

    // Liga de Vôlei 2026
    const ligaVolei = championshipRegistry["Liga de Vôlei 2026"];
    for (const team of timesVolei) {
      await ChampionshipTeam.findOrCreate({
        where: {
          championshipId: ligaVolei.id,
          teamId: team.id
        }
      });
    }

    // Criar partidas (Matches)
    const matchesToCreate = [];

    // Partidas para Copa Escolar
    const dataBase = new Date(2025, 2, 15); // 15 de março de 2025
    matchesToCreate.push({
      championshipId: copaEscolar.id,
      playDay: new Date(dataBase.getTime()),
      status: 2 // Finalizada
    });
    matchesToCreate.push({
      championshipId: copaEscolar.id,
      playDay: new Date(dataBase.getTime() + 7 * 24 * 60 * 60 * 1000), // +7 dias
      status: 2 // Finalizada
    });
    matchesToCreate.push({
      championshipId: copaEscolar.id,
      playDay: new Date(dataBase.getTime() + 14 * 24 * 60 * 60 * 1000), // +14 dias
      status: 1 // Em andamento
    });
    matchesToCreate.push({
      championshipId: copaEscolar.id,
      playDay: new Date(dataBase.getTime() + 21 * 24 * 60 * 60 * 1000), // +21 dias
      status: 0 // Agendada
    });

    // Partidas para Torneio de Inverno
    const dataInverno = new Date(2025, 5, 1); // 1 de junho de 2025
    matchesToCreate.push({
      championshipId: torneioInverno.id,
      playDay: new Date(dataInverno.getTime()),
      status: 2 // Finalizada
    });
    matchesToCreate.push({
      championshipId: torneioInverno.id,
      playDay: new Date(dataInverno.getTime() + 7 * 24 * 60 * 60 * 1000),
      status: 2 // Finalizada
    });
    matchesToCreate.push({
      championshipId: torneioInverno.id,
      playDay: new Date(dataInverno.getTime() + 14 * 24 * 60 * 60 * 1000),
      status: 0 // Agendada
    });

    // Partidas para Campeonato de Vôlei
    const dataVolei = new Date(2025, 3, 10); // 10 de abril de 2025
    matchesToCreate.push({
      championshipId: campeonatoVolei.id,
      playDay: new Date(dataVolei.getTime()),
      status: 2 // Finalizada
    });
    matchesToCreate.push({
      championshipId: campeonatoVolei.id,
      playDay: new Date(dataVolei.getTime() + 5 * 24 * 60 * 60 * 1000),
      status: 2 // Finalizada
    });
    matchesToCreate.push({
      championshipId: campeonatoVolei.id,
      playDay: new Date(dataVolei.getTime() + 10 * 24 * 60 * 60 * 1000),
      status: 1 // Em andamento
    });
    matchesToCreate.push({
      championshipId: campeonatoVolei.id,
      playDay: new Date(dataVolei.getTime() + 15 * 24 * 60 * 60 * 1000),
      status: 0 // Agendada
    });

    // Partidas para Copa Primavera
    const dataPrimavera = new Date(2025, 8, 20); // 20 de setembro de 2025
    matchesToCreate.push({
      championshipId: copaPrimavera.id,
      playDay: new Date(dataPrimavera.getTime()),
      status: 0 // Agendada
    });
    matchesToCreate.push({
      championshipId: copaPrimavera.id,
      playDay: new Date(dataPrimavera.getTime() + 7 * 24 * 60 * 60 * 1000),
      status: 0 // Agendada
    });

    const matchRegistry = [];
    for (const matchData of matchesToCreate) {
      const [match] = await Match.findOrCreate({
        where: {
          championshipId: matchData.championshipId,
          playDay: matchData.playDay
        },
        defaults: matchData
      });
      matchRegistry.push(match);
    }

    // Criar MatchTeam (times participantes das partidas com resultados)
    // Partidas finalizadas da Copa Escolar
    if (matchRegistry[0]) {
      // Match 1: Lobos Azuis vs Fênix Dourada
      await MatchTeam.findOrCreate({
        where: {
          matchId: matchRegistry[0].id,
          teamId: teamRegistry["Lobos Azuis"].id
        },
        defaults: {
          goalsTeam: 3,
          pointsTeam: 3
        }
      });
      await MatchTeam.findOrCreate({
        where: {
          matchId: matchRegistry[0].id,
          teamId: teamRegistry["Fênix Dourada"].id
        },
        defaults: {
          goalsTeam: 1,
          pointsTeam: 0
        }
      });
    }

    if (matchRegistry[1]) {
      // Match 2: Tigres Verdes vs Leões Negros
      await MatchTeam.findOrCreate({
        where: {
          matchId: matchRegistry[1].id,
          teamId: teamRegistry["Tigres Verdes"].id
        },
        defaults: {
          goalsTeam: 2,
          pointsTeam: 1
        }
      });
      await MatchTeam.findOrCreate({
        where: {
          matchId: matchRegistry[1].id,
          teamId: teamRegistry["Leões Negros"].id
        },
        defaults: {
          goalsTeam: 2,
          pointsTeam: 1
        }
      });
    }

    if (matchRegistry[2]) {
      // Match 3: Águias Brancas vs Dragões Vermelhos (em andamento)
      await MatchTeam.findOrCreate({
        where: {
          matchId: matchRegistry[2].id,
          teamId: teamRegistry["Águias Brancas"].id
        },
        defaults: {
          goalsTeam: 1,
          pointsTeam: 0
        }
      });
      await MatchTeam.findOrCreate({
        where: {
          matchId: matchRegistry[2].id,
          teamId: teamRegistry["Dragões Vermelhos"].id
        },
        defaults: {
          goalsTeam: 0,
          pointsTeam: 0
        }
      });
    }

    // Partidas finalizadas do Torneio de Inverno
    if (matchRegistry[4]) {
      // Match 5: Lobos Azuis vs Tigres Verdes
      await MatchTeam.findOrCreate({
        where: {
          matchId: matchRegistry[4].id,
          teamId: teamRegistry["Lobos Azuis"].id
        },
        defaults: {
          goalsTeam: 4,
          pointsTeam: 3
        }
      });
      await MatchTeam.findOrCreate({
        where: {
          matchId: matchRegistry[4].id,
          teamId: teamRegistry["Tigres Verdes"].id
        },
        defaults: {
          goalsTeam: 2,
          pointsTeam: 0
        }
      });
    }

    if (matchRegistry[5]) {
      // Match 6: Fênix Dourada vs Leões Negros
      await MatchTeam.findOrCreate({
        where: {
          matchId: matchRegistry[5].id,
          teamId: teamRegistry["Fênix Dourada"].id
        },
        defaults: {
          goalsTeam: 1,
          pointsTeam: 0
        }
      });
      await MatchTeam.findOrCreate({
        where: {
          matchId: matchRegistry[5].id,
          teamId: teamRegistry["Leões Negros"].id
        },
        defaults: {
          goalsTeam: 3,
          pointsTeam: 3
        }
      });
    }

    // Partidas de Vôlei
    if (matchRegistry[7]) {
      // Match 8: Sharks Azuis vs Falcões Dourados
      await MatchTeam.findOrCreate({
        where: {
          matchId: matchRegistry[7].id,
          teamId: teamRegistry["Sharks Azuis"].id
        },
        defaults: {
          goalsTeam: 3, // sets ganhos
          pointsTeam: 3
        }
      });
      await MatchTeam.findOrCreate({
        where: {
          matchId: matchRegistry[7].id,
          teamId: teamRegistry["Falcões Dourados"].id
        },
        defaults: {
          goalsTeam: 0,
          pointsTeam: 0
        }
      });
    }

    if (matchRegistry[8]) {
      // Match 9: Lobos do Mar vs Trovões
      await MatchTeam.findOrCreate({
        where: {
          matchId: matchRegistry[8].id,
          teamId: teamRegistry["Lobos do Mar"].id
        },
        defaults: {
          goalsTeam: 3,
          pointsTeam: 3
        }
      });
      await MatchTeam.findOrCreate({
        where: {
          matchId: matchRegistry[8].id,
          teamId: teamRegistry["Trovões"].id
        },
        defaults: {
          goalsTeam: 1,
          pointsTeam: 0
        }
      });
    }

    if (matchRegistry[9]) {
      // Match 10: Tempestade vs Sharks Azuis (em andamento)
      await MatchTeam.findOrCreate({
        where: {
          matchId: matchRegistry[9].id,
          teamId: teamRegistry["Tempestade"].id
        },
        defaults: {
          goalsTeam: 1,
          pointsTeam: 0
        }
      });
      await MatchTeam.findOrCreate({
        where: {
          matchId: matchRegistry[9].id,
          teamId: teamRegistry["Sharks Azuis"].id
        },
        defaults: {
          goalsTeam: 2,
          pointsTeam: 0
        }
      });
    }

    console.log("Seed concluído com sucesso!");
  } catch (error) {
    console.error("Erro ao executar seed:", error);
  } finally {
    await sequelize.close();
  }
};

seed();

