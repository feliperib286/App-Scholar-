const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database/db');

// Usando variável de ambiente para segurança, com um fallback padrão
const JWT_SECRET = process.env.JWT_SECRET || 'appscholar_secret';
const JWT_EXPIRES = '24h';

// ==========================================
// ROTA DE LOGIN
// ==========================================
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  // 1. Validação básica
  if (!email || !senha) {
    return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
  }

  try {
    // 2. Busca o usuário no banco (ignorando espaços e maiúsculas no email)
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const usuario = result.rows[0];

    // 3. Verifica a senha comparando com o hash do banco
    const senhaOk = await bcrypt.compare(senha, usuario.palavra_passe);

    if (!senhaOk) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    // 4. REGRA DO PRIMEIRO ACESSO
    if (usuario.primeiro_acesso) {
      return res.json({ 
        precisaTrocarSenha: true, 
        id: usuario.id,
        mensagem: 'Primeiro acesso detectado. Por favor, altere sua senha.' 
      });
    }

    // 5. Gera o Token JWT se não for o primeiro acesso
    const token = jwt.sign(
      { id: usuario.id, role: usuario.role, nome: usuario.nome },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    // 6. Retorna o token e os dados para o frontend usar no cabeçalho
    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome || usuario.email.split('@')[0], // Pega o começo do email se não tiver nome
        email: usuario.email,
        role: usuario.role,
      },
    });

  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// ==========================================
// ROTA PARA TROCAR SENHA NO PRIMEIRO ACESSO
// ==========================================
exports.trocarSenhaPrimeiroAcesso = async (req, res) => {
  const { id, novaSenha } = req.body;
  
  if (!id || !novaSenha) {
    return res.status(400).json({ erro: 'ID do usuário e nova senha são obrigatórios.' });
  }

  try {
    // Criptografa a nova senha antes de salvar
    const hashSenha = await bcrypt.hash(novaSenha, 10);
    
    // Atualiza a senha e marca que não é mais o primeiro acesso
    await pool.query(
      'UPDATE usuarios SET palavra_passe = $1, primeiro_acesso = FALSE WHERE id = $2',
      [hashSenha, id]
    );
    
    res.json({ mensagem: 'Senha alterada com sucesso! Faça login novamente.' });
  } catch (erro) {
    console.error('Erro ao alterar senha:', erro);
    res.status(500).json({ erro: 'Erro ao alterar a senha no banco de dados.' });
  }
};

// ==========================================
// MIDDLEWARE DE AUTENTICAÇÃO (PROTEÇÃO DE ROTAS)
// ==========================================
exports.autenticar = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Separa o "Bearer" do token

  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado. Token não informado.' });
  }

  try {
    // Descodifica o token e joga os dados na requisição (req.user)
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next(); // Permite que a requisição siga para o Controller
  } catch (err) {
    return res.status(403).json({ erro: 'Token inválido ou expirado.' });
  }
};