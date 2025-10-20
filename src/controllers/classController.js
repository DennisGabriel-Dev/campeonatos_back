import Class from "../models/class.js";

const ClassController = {
  async getClasses(req, res) {
    try {
      const classes = await Class.findAll({
        order: [['year', 'DESC'], ['semester', 'DESC'], ['name', 'ASC']]
      });
      res.status(200).json(classes);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  },

  async createClass(req, res) {
    try {
      const { name, description, year, semester, course, maxStudents } = req.body;

      if (!name || !year || !semester || !course) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios: name, year, semester, course' 
        });
      }

      const newClass = await Class.create({ 
        name,
        description,
        year,
        semester,
        course,
        maxStudents: maxStudents || 30
      });

      res.status(201).json(newClass);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(409).json({ 
          error: 'Já existe uma turma com este nome' 
        });
      } else if (error.name === 'SequelizeValidationError') {
        res.status(400).json({ 
          error: 'Dados inválidos', 
          details: error.errors.map(err => err.message) 
        });
      } else {
        res.status(500).json({ 
          error: 'Erro interno do servidor', 
          details: error.message 
        });
      }
    }
  },

  async getClassById(req, res) {
    try {
      const { id } = req.params;
      const classItem = await Class.findByPk(id);

      if (classItem) {
        res.status(200).json(classItem);
      } else {
        res.status(404).json({ error: 'Turma não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  },

  async updateClass(req, res) {
    try {
      const { id } = req.params;
      const { name, description, year, semester, course, maxStudents } = req.body;
      
      const classItem = await Class.findByPk(id);
      if (!classItem) {
        return res.status(404).json({ error: 'Turma não encontrada' });
      }

      // Validação do semestre se fornecido
      if (semester && !['1', '2'].includes(semester)) {
        return res.status(400).json({ 
          error: 'Semestre deve ser "1" ou "2"' 
        });
      }

      // Atualiza apenas os campos fornecidos
      const updatedData = {};
      if (name !== undefined) updatedData.name = name;
      if (description !== undefined) updatedData.description = description;
      if (year !== undefined) updatedData.year = year;
      if (semester !== undefined) updatedData.semester = semester;
      if (course !== undefined) updatedData.course = course;
      if (maxStudents !== undefined) updatedData.maxStudents = maxStudents;

      await classItem.update(updatedData);
      
      const updatedClass = await Class.findByPk(id);
      res.status(200).json(updatedClass);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(409).json({ 
          error: 'Já existe uma turma com este nome' 
        });
      } else if (error.name === 'SequelizeValidationError') {
        res.status(400).json({ 
          error: 'Dados inválidos', 
          details: error.errors.map(err => err.message) 
        });
      } else {
        res.status(500).json({ 
          error: 'Erro interno do servidor', 
          details: error.message 
        });
      }
    }
  },

  async deleteClass(req, res) {
    try {
      const { id } = req.params;
      const classItem = await Class.findByPk(id);
      
      if (classItem) {
        await classItem.destroy();
        res.status(200).json({ 
          message: 'Turma deletada com sucesso' 
        });
      } else {
        res.status(404).json({ error: 'Turma não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  },

  async getClassesByYear(req, res) {
    try {
      const { year } = req.params;
      
      const classes = await Class.findAll({
        where: { year },
        order: [['semester', 'DESC'], ['name', 'ASC']]
      });
      
      res.status(200).json(classes);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  },

  async getClassesByCourse(req, res) {
    try {
      const { course } = req.params;
      
      const classes = await Class.findAll({
        where: { course },
        order: [['year', 'DESC'], ['semester', 'DESC'], ['name', 'ASC']]
      });
      
      res.status(200).json(classes);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      });
    }
  }
};

export default ClassController;
