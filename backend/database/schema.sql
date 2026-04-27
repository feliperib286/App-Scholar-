-- Limpa tudo
DROP TABLE IF EXISTS notas CASCADE;
DROP TABLE IF EXISTS disciplinas CASCADE;
DROP TABLE IF EXISTS professores CASCADE;
DROP TABLE IF EXISTS alunos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Recria tabelas
CREATE TABLE usuarios (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(100) NOT NULL UNIQUE,
  senha_hash  VARCHAR(255) NOT NULL,
  perfil      VARCHAR(20)  NOT NULL DEFAULT 'aluno',
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE alunos (
  id         SERIAL PRIMARY KEY,
  nome       VARCHAR(255) NOT NULL,
  matricula  VARCHAR(45)  NOT NULL UNIQUE,
  curso      VARCHAR(100),
  email      VARCHAR(100),
  telefone   VARCHAR(20),
  cep        VARCHAR(10),
  endereco   VARCHAR(150),
  cidade     VARCHAR(80),
  estado     VARCHAR(2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE professores (
  id             SERIAL PRIMARY KEY,
  nome           VARCHAR(255) NOT NULL,
  titulacao      VARCHAR(60),
  area           VARCHAR(100),
  tempo_docencia VARCHAR(30),
  email          VARCHAR(100),
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE disciplinas (
  id            SERIAL PRIMARY KEY,
  nome          VARCHAR(100) NOT NULL,
  carga_horaria VARCHAR(20),
  professor_id  INTEGER REFERENCES professores(id) ON DELETE SET NULL,
  curso         VARCHAR(100),
  semestre      VARCHAR(5),
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notas (
  id            SERIAL PRIMARY KEY,
  aluno_id      INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  disciplina_id INTEGER NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
  nota1         DECIMAL(4,2),
  nota2         DECIMAL(4,2),
  media         DECIMAL(4,2),
  situacao      VARCHAR(20),
  created_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE(aluno_id, disciplina_id)
);

-- Usuários (senha: password)
INSERT INTO usuarios (email, senha_hash, perfil) VALUES
('admin@fatec.sp.gov.br', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('teste@fatec.sp.gov.br', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'aluno');

-- Professores
INSERT INTO professores (nome, titulacao, area, tempo_docencia, email) VALUES
('André Olímpio',  'Mestre (MSc)',  'Desenvolvimento Mobile', '8 a 12 anos',     'andre.olimpio@fatec.sp.gov.br'),
('Fernanda Costa', 'Doutor (PhD)',  'Banco de Dados',         'Mais de 12 anos', 'fernanda.costa@fatec.sp.gov.br'),
('Ricardo Mendes', 'Especialista', 'Engenharia de Software', '4 a 7 anos',      'ricardo.mendes@fatec.sp.gov.br');

-- Disciplinas
INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre) VALUES
('Programação para Dispositivos Móveis I', '80h', 1, 'Desenvolvimento de Software Multiplataforma', '3º'),
('Banco de Dados Relacional',              '80h', 2, 'Desenvolvimento de Software Multiplataforma', '3º'),
('Engenharia de Software',                 '60h', 3, 'Desenvolvimento de Software Multiplataforma', '3º'),
('Estrutura de Dados',                     '80h', 1, 'Desenvolvimento de Software Multiplataforma', '3º');

-- Alunos
INSERT INTO alunos (nome, matricula, curso, email, telefone, cep, endereco, cidade, estado) VALUES
('Maria Aparecida Santos', 'DSM2024042', 'Desenvolvimento de Software Multiplataforma', 'maria.santos@fatec.sp.gov.br', '(12) 98765-4321', '12300-000', 'Rua das Flores, 123 – Centro', 'Jacareí', 'SP'),
('Carlos Eduardo Lima',    'DSM2024015', 'Desenvolvimento de Software Multiplataforma', 'carlos.lima@fatec.sp.gov.br',  '(12) 97654-3210', '12301-100', 'Av. Brasil, 456 – Jd. América', 'Jacareí', 'SP');

-- Notas da Maria
INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, media, situacao) VALUES
(1, 1, 8.5, 9.0,  8.75, 'Aprovado'),
(1, 2, 7.0, 8.0,  7.5,  'Aprovado'),
(1, 3, 5.0, 4.5,  4.75, 'Rec. Final'),
(1, 4, 6.5, 7.5,  7.0,  'Aprovado');

senha:Senha: password

