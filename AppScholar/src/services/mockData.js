// ── DADOS SIMULADOS (MOCKADOS) ─────────────────────────────────────────────

export const mockAlunos = [
  {
    id: '1',
    nome: 'Maria Aparecida Santos',
    matricula: 'DSM2024042',
    curso: 'Desenvolvimento de Software Multiplataforma',
    email: 'maria.santos@fatec.sp.gov.br',
    telefone: '(12) 98765-4321',
    cep: '12300-000',
    endereco: 'Rua das Flores, 123 – Centro',
    cidade: 'Jacareí',
    estado: 'SP',
  },
  {
    id: '2',
    nome: 'Carlos Eduardo Lima',
    matricula: 'DSM2024015',
    curso: 'Desenvolvimento de Software Multiplataforma',
    email: 'carlos.lima@fatec.sp.gov.br',
    telefone: '(12) 97654-3210',
    cep: '12301-100',
    endereco: 'Av. Brasil, 456 – Jd. América',
    cidade: 'Jacareí',
    estado: 'SP',
  },
];

export const mockProfessores = [
  {
    id: '1',
    nome: 'André Olímpio',
    titulacao: 'Mestre (MSc)',
    areaAtuacao: 'Desenvolvimento Mobile',
    tempoDocencia: '8 anos',
    email: 'andre.olimpio@fatec.sp.gov.br',
  },
  {
    id: '2',
    nome: 'Fernanda Costa',
    titulacao: 'Doutora (PhD)',
    areaAtuacao: 'Banco de Dados',
    tempoDocencia: '12 anos',
    email: 'fernanda.costa@fatec.sp.gov.br',
  },
];

export const mockDisciplinas = [
  {
    id: '1',
    nome: 'Programação para Dispositivos Móveis I',
    cargaHoraria: '80h',
    professor: 'André Olímpio',
    curso: 'Desenvolvimento de Software Multiplataforma',
    semestre: '3º',
  },
  {
    id: '2',
    nome: 'Banco de Dados Relacional',
    cargaHoraria: '80h',
    professor: 'Fernanda Costa',
    curso: 'Desenvolvimento de Software Multiplataforma',
    semestre: '3º',
  },
  {
    id: '3',
    nome: 'Engenharia de Software',
    cargaHoraria: '60h',
    professor: 'Ricardo Mendes',
    curso: 'Desenvolvimento de Software Multiplataforma',
    semestre: '3º',
  },
];

export const mockBoletim = [
  { id: '1', disciplina: 'Programação Mobile I', nota1: 8.5, nota2: 9.0, media: 8.75, frequencia: 92, situacao: 'Aprovado' },
  { id: '2', disciplina: 'Banco de Dados Relacional', nota1: 7.0, nota2: 8.0, media: 7.5, frequencia: 88, situacao: 'Aprovado' },
  { id: '3', disciplina: 'Engenharia de Software', nota1: 5.0, nota2: 4.5, media: 4.75, frequencia: 80, situacao: 'Rec. Final' },
  { id: '4', disciplina: 'Estrutura de Dados', nota1: 6.5, nota2: 7.5, media: 7.0, frequencia: 85, situacao: 'Aprovado' },
];
