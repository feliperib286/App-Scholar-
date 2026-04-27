import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─────────────────────────────────────────────────────────────
// ATENÇÃO: troque pelo IP da sua máquina na rede local.
// No Android Emulator use: http://10.0.2.2:3000
// No dispositivo físico use o IP da sua máquina, ex: http://192.168.1.100:3000
// ─────────────────────────────────────────────────────────────
const BASE_URL = 'http://10.68.55.27:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Interceptor: injeta o token JWT em toda requisição
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@appscholar:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── AUTH ─────────────────────────────────────────────────────
export async function apiLogin(email, senha) {
  const response = await api.post('/login', { email, senha });
  return response.data; // { token, usuario }
}

// ── ALUNOS ───────────────────────────────────────────────────
export async function apiGetAlunos() {
  const response = await api.get('/alunos');
  return response.data;
}

export async function apiCriarAluno(dados) {
  const response = await api.post('/alunos', dados);
  return response.data;
}

export async function apiAtualizarAluno(id, dados) {
  const response = await api.put(`/alunos/${id}`, dados);
  return response.data;
}

export async function apiRemoverAluno(id) {
  const response = await api.delete(`/alunos/${id}`);
  return response.data;
}

// ── PROFESSORES ──────────────────────────────────────────────
export async function apiGetProfessores() {
  const response = await api.get('/professores');
  return response.data;
}

export async function apiCriarProfessor(dados) {
  const response = await api.post('/professores', dados);
  return response.data;
}

// ── DISCIPLINAS ──────────────────────────────────────────────
export async function apiGetDisciplinas() {
  const response = await api.get('/disciplinas');
  return response.data;
}

export async function apiCriarDisciplina(dados) {
  const response = await api.post('/disciplinas', dados);
  return response.data;
}

// ── BOLETIM ───────────────────────────────────────────────────
export async function apiGetBoletim(matricula) {
  const response = await api.get(`/boletim/${matricula}`);
  return response.data;
}

// ── NOTAS ─────────────────────────────────────────────────────
export async function apiLancarNota(dados) {
  const response = await api.post('/notas', dados);
  return response.data;
}

// ── APIS EXTERNAS ─────────────────────────────────────────────

// API 1: ViaCEP – busca endereço pelo CEP
export async function buscarCep(cep) {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) throw new Error('CEP inválido');
  const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  if (response.data.erro) throw new Error('CEP não encontrado');
  return response.data;
  // Retorna: { logradouro, bairro, localidade, uf, ... }
}

// API 2: IBGE – busca lista de estados
export async function buscarEstados() {
  const response = await axios.get(
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
  );
  return response.data; // [{ id, sigla, nome }, ...]
}

// API 2: IBGE – busca cidades de um estado (pela sigla, ex: 'SP')
export async function buscarCidades(uf) {
  const response = await axios.get(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`
  );
  return response.data; // [{ id, nome }, ...]
}

export default api;
