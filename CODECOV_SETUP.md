# 📊 Setup Codecov - Guia Passo a Passo

## 🎯 O que é o Codecov?

O Codecov é uma ferramenta que visualiza a cobertura de testes do seu código. Ele mostra:
- Quais linhas foram testadas ✅
- Quais linhas NÃO foram testadas ❌
- Percentual de cobertura por arquivo
- Comentários automáticos em Pull Requests

---

## 🚀 Passo 1: Criar Conta

1. Acesse: **https://codecov.io**
2. Clique em **"Sign up"**
3. Escolha **"Sign in with GitHub"**
4. Autorize o Codecov a acessar seus repositórios

---

## 🔧 Passo 2: Adicionar Repositório

1. No dashboard do Codecov, clique em **"Add new repository"**
2. Procure por: **`eryckassis/GSAP-ImageSlider`**
3. Clique em **"Setup repo"**
4. Copie o **CODECOV_TOKEN** que aparecerá (algo como: `abc123xyz...`)

---

## 🔐 Passo 3: Adicionar Token ao GitHub

1. Vá para: **https://github.com/eryckassis/GSAP-ImageSlider/settings/secrets/actions**
2. Clique em **"New repository secret"**
3. Preencha:
   - **Name:** `CODECOV_TOKEN`
   - **Value:** Cole o token copiado do Codecov
4. Clique em **"Add secret"**

---

## ✅ Passo 4: Testar a Integração

Após adicionar o secret, o Codecov será ativado automaticamente quando você:

1. Fizer um commit
2. O CI rodar os testes
3. O Jest gerar o relatório de coverage
4. O GitHub Actions enviar para o Codecov

Você verá nos PRs:
```
Codecov Report
Coverage: 75.2% (+2.1%)
Files changed: 3
```

---

## 📊 Passo 5: Ver Relatórios

1. Acesse: **https://app.codecov.io/gh/eryckassis/GSAP-ImageSlider**
2. Você verá:
   - **Sunburst**: Gráfico visual da cobertura
   - **Files**: Cobertura por arquivo
   - **Commits**: Histórico de cobertura
   - **Pull Requests**: Coverage em cada PR

---

## 🎨 BONUS: Adicionar Badge ao README

Depois que configurar, adicione o badge no README.md:

```markdown
[![codecov](https://codecov.io/gh/eryckassis/GSAP-ImageSlider/branch/master/graph/badge.svg)](https://codecov.io/gh/eryckassis/GSAP-ImageSlider)
```

Ficará assim: ![codecov](https://codecov.io/gh/eryckassis/GSAP-ImageSlider/branch/master/graph/badge.svg)

---

## 🔍 Verificar se Está Funcionando

Após configurar, faça um commit e veja se:

1. ✅ GitHub Actions roda com sucesso
2. ✅ Job "Unit Tests" envia coverage
3. ✅ Codecov recebe os dados
4. ✅ Badge atualiza com o percentual

---

## 📝 Configuração Atual

Já configuramos o `codecov.yml` com:
- ✅ Meta mínima: **70%** de cobertura
- ✅ Código novo: **80%** de cobertura
- ✅ Comentários automáticos em PRs
- ✅ Componentes separados (core, utils, config)

---

## 🆘 Troubleshooting

### Erro: "Missing token"
- Verifique se adicionou `CODECOV_TOKEN` nos GitHub Secrets
- Token deve ser do **repositório**, não do usuário

### Erro: "Coverage not found"
- Verifique se Jest está gerando `coverage/lcov.info`
- Rode localmente: `npm run test:coverage`

### Badge não atualiza
- Aguarde 5 minutos após o primeiro envio
- Limpe cache do browser
- Verifique se branch é `master` ou `main`

---

**🎯 Pronto! Após seguir esses passos, o Codecov estará funcionando!**
