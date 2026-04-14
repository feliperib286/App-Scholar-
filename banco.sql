CREATE TABLE Aluno (
  idaluno INTEGER NOT NULL,
  nome VARCHAR(255),
  matricula VARCHAR(45),
  curso VARCHAR(45),
  email VARCHAR(45),
  telefone VARCHAR(20),
  cep VARCHAR(20),
  endereco VARCHAR(100),
  cidade VARCHAR(50),
  estado VARCHAR(2),
  PRIMARY KEY(idaluno)
);

CREATE TABLE Disciplina (
  iddisciplina INTEGER NOT NULL,
  nome VARCHAR(45),
  carga_horaria VARCHAR(20),
  curso VARCHAR(45),
  semestre VARCHAR(2),
  PRIMARY KEY(iddisciplina)
);

CREATE TABLE Professores (
  idProfessores INTEGER NOT NULL,
  nome VARCHAR(255),
  titulacao VARCHAR(45),
  area VARCHAR(45),
  tempo_docencia VARCHAR(20),
  email VARCHAR(45),
  PRIMARY KEY(idProfessores)
);

CREATE TABLE Disciplina_has_Aluno (
  Disciplina_iddisciplina INTEGER NOT NULL,
  Aluno_idaluno INTEGER NOT NULL,
  PRIMARY KEY(Disciplina_iddisciplina, Aluno_idaluno),
  FOREIGN KEY (Disciplina_iddisciplina) REFERENCES Disciplina(iddisciplina),
  FOREIGN KEY (Aluno_idaluno) REFERENCES Aluno(idaluno)
);

CREATE TABLE Disciplina_has_Professores (
  Disciplina_iddisciplina INTEGER NOT NULL,
  Professores_idProfessores INTEGER NOT NULL,
  PRIMARY KEY(Disciplina_iddisciplina, Professores_idProfessores),
  FOREIGN KEY (Disciplina_iddisciplina) REFERENCES Disciplina(iddisciplina),
  FOREIGN KEY (Professores_idProfessores) REFERENCES Professores(idProfessores)
);

CREATE TABLE Notas (
  idNotas INTEGER NOT NULL,
  Aluno_idaluno INTEGER NOT NULL,
  Disciplina_iddisciplina INTEGER NOT NULL,
  nota1 DECIMAL(4,2), -- Recomendado usar decimal para notas
  nota2 DECIMAL(4,2),
  media FLOAT,
  situacao VARCHAR(20),
  PRIMARY KEY(idNotas),
  FOREIGN KEY (Disciplina_iddisciplina) REFERENCES Disciplina(iddisciplina),
  FOREIGN KEY (Aluno_idaluno) REFERENCES Aluno(idaluno)
);

-- Índices adicionais para performance
CREATE INDEX idx_disciplina_aluno ON Disciplina_has_Aluno(Disciplina_iddisciplina);
CREATE INDEX idx_aluno_disciplina ON Disciplina_has_Aluno(Aluno_idaluno);
