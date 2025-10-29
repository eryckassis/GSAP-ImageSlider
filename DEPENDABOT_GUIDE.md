# 🤖 Dependabot - Guia de Uso

## 🎯 O que é o Dependabot?

O Dependabot é um bot do GitHub que:
- ✅ Monitora suas dependências automaticamente
- ✅ Detecta atualizações disponíveis
- ✅ Cria Pull Requests automáticos
- ✅ Inclui changelog e release notes
- ✅ Mantém seu projeto seguro e atualizado

---

## 🚀 Como Funciona

O Dependabot já está **100% configurado** neste projeto!

### 📅 Agenda

- **Quando:** Toda segunda-feira às 9h (horário de Brasília)
- **O que:** Verifica atualizações de:
  - Dependências NPM (package.json)
  - GitHub Actions (workflows)

### 📦 Tipos de Update

O Dependabot cria PRs separados para:

1. **Development Dependencies** (devDependencies)
   - ESLint, Prettier, Jest, Playwright, etc.
   - Updates minor e patch automáticos

2. **Production Dependencies** (dependencies)
   - GSAP, Three.js, Tweakpane, etc.
   - Updates minor e patch automáticos

3. **GitHub Actions**
   - actions/checkout, actions/setup-node, etc.
   - Updates automáticos

---

## 🔄 Fluxo Automático

```
Segunda, 9h → Dependabot verifica atualizações
              ↓
         Encontrou updates?
              ↓
    Cria PR automático com:
    - Título: "chore(deps): bump package from 1.0.0 to 1.1.0"
    - Changelog completo
    - Release notes
    - Compatibilidade
              ↓
         CI roda automaticamente
              ↓
    ✅ Tudo passou? → Você faz merge
    ❌ Falhou? → Investiga e corrige
```

---

## 📝 Exemplo de PR do Dependabot

```markdown
Bumps [eslint](https://github.com/eslint/eslint) from 9.0.0 to 9.1.0

Release notes:
- Fix: Something important
- Feat: New awesome feature
- Docs: Updated documentation

Commits:
- abc1234 Fix: Critical bug
- def5678 Feat: Add new rule

Compatibility: ✅ Compatible
```

---

## ✅ O que Fazer com PRs do Dependabot

### 1️⃣ **Minor e Patch Updates** (1.0.0 → 1.0.1 ou 1.1.0)

```bash
# Se CI passou ✅
git merge dependabot/npm_and_yarn/eslint-9.1.0

# Ou via GitHub:
# Clique em "Merge pull request"
```

### 2️⃣ **Major Updates** (1.0.0 → 2.0.0)

⚠️ **CUIDADO!** Major updates podem quebrar código.

```bash
# 1. Revisar CHANGELOG
# 2. Testar localmente
git fetch origin
git checkout dependabot/npm_and_yarn/jest-31.0.0
npm install
npm run test

# 3. Se tudo OK, fazer merge
# 4. Se quebrou, fechar PR e investigar
```

---

## 🔒 Configuração de Segurança

### Ignora Major Updates Automáticos

O Dependabot **NÃO cria PRs** para major updates automaticamente.

Você precisa atualizar manualmente:

```bash
npm update eslint@latest  # Atualiza para latest
npm run test              # Testa
git commit -m "chore(deps): update eslint to v10.0.0"
```

### Labels Automáticos

Todos os PRs do Dependabot têm:
- 🏷️ `dependencies`
- 🏷️ `automated`

Filtrar PRs:
```
is:pr label:dependencies
```

---

## 🎨 Commits Semânticos

Todos os commits seguem Conventional Commits:

- NPM: `chore(deps): bump package from 1.0.0 to 1.1.0`
- Actions: `ci: bump actions/checkout from 3 to 4`

---

## 🔧 Customizações Possíveis

### Mudar Frequência

Edite `.github/dependabot.yml`:

```yaml
schedule:
  interval: "daily"    # Opções: daily, weekly, monthly
  day: "monday"
  time: "09:00"
```

### Adicionar Mais Ecossistemas

```yaml
- package-ecosystem: "docker"
  directory: "/"
  schedule:
    interval: "weekly"
```

### Limitar PRs Abertos

```yaml
open-pull-requests-limit: 5  # Máximo de PRs abertos
```

---

## 📊 Estatísticas

Após alguns meses, você verá:

- 📈 **Updates automáticos:** ~10-15 por semana
- 🔒 **Vulnerabilidades corrigidas:** Automaticamente
- ⏱️ **Tempo economizado:** ~2-3 horas/semana

---

## 🆘 Troubleshooting

### PR não foi criado
- Verifique se Dependabot está habilitado: Settings → Code security
- Veja logs em: Insights → Dependency graph → Dependabot

### PR com conflitos
- Rebase automático: GitHub faz isso automaticamente
- Se persistir, feche e reabra o PR

### Muitos PRs abertos
- Ajuste `open-pull-requests-limit`
- Faça merge dos antigos primeiro

---

## 🎯 Best Practices

1. ✅ **Sempre rode CI** antes de mergear
2. ✅ **Revise changelogs** de major updates
3. ✅ **Teste localmente** em caso de dúvida
4. ✅ **Mantenha branches atualizadas**
5. ✅ **Feche PRs obsoletos**

---

**🎉 Pronto! O Dependabot está trabalhando para você!**

Próximo PR automático: **Segunda-feira, 9h**
