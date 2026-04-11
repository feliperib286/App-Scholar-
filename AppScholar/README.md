# 🎓 App Scholar — Parte 1

**Disciplina:** Programação para Dispositivos Móveis I  
**Professor:** André Olímpio  
**Curso:** Desenvolvimento de Software Multiplataforma — Fatec Jacareí

---

## 📁 Estrutura do Projeto

```
AppScholar/
├── App.js                          # Entry point
├── app.json                        # Configuração Expo
├── package.json
└── src/
    ├── components/
    │   └── index.js                # AppInput, AppButton, FormHeader, SectionLabel
    ├── hooks/
    │   └── useAuth.js              # useContext — estado de autenticação
    ├── navigation/
    │   └── AppNavigator.js         # React Navigation (Stack)
    ├── screens/
    │   ├── LoginScreen.js          # Tela 1 — Login com validação
    │   ├── DashboardScreen.js      # Tela 2 — Dashboard / menu principal
    │   ├── CadastroAlunoScreen.js  # Tela 3 — Cadastro de alunos
    │   ├── CadastroProfessorScreen.js # Tela 4 — Cadastro de professores
    │   ├── CadastroDisciplinaScreen.js # Tela 5 — Cadastro de disciplinas
    │   └── BoletimScreen.js        # Tela 6 — Visualização de boletim
    ├── services/
    │   └── mockData.js             # Dados simulados (mockados)
    └── styles/
        └── theme.js                # Design tokens (cores, espaçamentos, tipografia)
```

---

## 🚀 Como rodar

### Pré-requisitos
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- App **Expo Go** no celular (iOS ou Android)

### Passos

```bash
# 1. Entrar na pasta
cd AppScholar

# 2. Instalar dependências
npm install

# 3. Iniciar o projeto
npx expo start
```

Escaneie o QR code com o app **Expo Go** no celular.

---

## ✅ Hooks utilizados

| Hook         | Onde                          | Para quê                                        |
|--------------|-------------------------------|-------------------------------------------------|
| `useState`   | Todas as screens              | Campos de formulário, estados de tela, erros    |
| `useEffect`  | Dashboard, Boletim            | Carregamento de dados simulados                 |
| `useContext` | `useAuth` (AuthContext)       | Estado global de autenticação + usuário logado  |

---

## 📱 Telas implementadas

1. **Login** — validação de campos vazios, feedback de erro, redirecionamento
2. **Dashboard** — cards de navegação, resumo semestral, botão de logout
3. **Cadastro de Alunos** — 9 campos com validação e feedback de sucesso
4. **Cadastro de Professores** — dropdowns customizados para titulação e tempo
5. **Cadastro de Disciplinas** — picker de professor, semestre e curso
6. **Boletim** — cards com notas, médias, frequência e situação colorida

---

## 🔌 Parte 2 (próxima etapa)

Na Parte 2, os dados mockados em `src/services/mockData.js` serão substituídos por chamadas reais à **API REST Node.js + PostgreSQL**.  
Os arquivos de serviço estarão em `src/services/api.js`.

---

*Dados simulados — sem conexão com banco de dados (conforme exigido na Parte 1)*
