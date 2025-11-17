import sequelize from "../config/database.js";
import "../models/associations.js";
import Championship from "../models/championship.js";
import Team from "../models/team.js";
import Class from "../models/class.js";
import Player from "../models/player.js";

const seed = async () => {
  try {
    await sequelize.sync();

    const championshipsToEnsure = [
      { name: "Copa Escolar", year: 2025 },
      { name: "Torneio de Inverno", year: 2025 },
      { name: "Liga Universitária", year: 2026 }
    ];

    for (const championshipData of championshipsToEnsure) {
      const existingChampionship = await Championship.findOne({
        where: championshipData
      });

      if (!existingChampionship) {
        await Championship.create(championshipData);
      }
    }

    const classesToEnsure = [
      {
        name: "Informática A",
        description: "Turma de Informática focada em desenvolvimento web",
        year: 2025,
        semester: "1",
        course: "Informática"
      },
      {
        name: "Informática B",
        description: "Turma de Informática focada em redes",
        year: 2025,
        semester: "2",
        course: "Informática"
      },
      {
        name: "Administração A",
        description: "Turma de Administração com foco em gestão esportiva",
        year: 2025,
        semester: "1",
        course: "Administração"
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
      { name: "Corujas Brancas", modality: "Futsal" },
      { name: "Panteras Vermelhas", modality: "Futsal" },
      { name: "Onças Listradas", modality: "Basquete" },
      { name: "Raposas Rápidas", modality: "Basquete" }
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
      { name: "Alex Costa", age: 18, className: "Informática A", teamName: "Lobos Azuis" },
      { name: "Bianca Souza", age: 17, className: "Informática A", teamName: "Fênix Dourada" },
      { name: "Carlos Lima", age: 19, className: "Informática B", teamName: "Tigres Verdes" },
      { name: "Daniela Santos", age: 18, className: "Informática B", teamName: "Leões Negros" },
      { name: "Eduardo Fernandes", age: 20, className: "Administração A", teamName: "Corujas Brancas" },
      { name: "Fernanda Ribeiro", age: 19, className: "Administração A", teamName: "Panteras Vermelhas" },
      { name: "Gabriel Alves", age: 21, className: "Informática A", teamName: "Onças Listradas" },
      { name: "Helena Martins", age: 18, className: "Informática B", teamName: "Raposas Rápidas" },
      { name: "Igor Pereira", age: 20, className: "Informática A", teamName: "Lobos Azuis" },
      { name: "Júlia Carvalho", age: 21, className: "Administração A", teamName: "Fênix Dourada" },
      { name: "Lucas Mendes", age: 22, className: "Informática B", teamName: "Tigres Verdes" },
      { name: "Mariana Rocha", age: 18, className: "Informática A", teamName: "Leões Negros" },
      { name: "Nicolas Prado", age: 19, className: "Informática B", teamName: "Corujas Brancas" },
      { name: "Olívia Farias", age: 17, className: "Administração A", teamName: "Panteras Vermelhas" },
      { name: "Paulo Henrique", age: 22, className: "Informática A", teamName: "Onças Listradas" },
      { name: "Queila Dias", age: 20, className: "Informática B", teamName: "Raposas Rápidas" }
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

    console.log("Seed concluído com sucesso!");
  } catch (error) {
    console.error("Erro ao executar seed:", error);
  } finally {
    await sequelize.close();
  }
};

seed();

