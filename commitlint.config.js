// Commitlint Configuration
// 🎯 Analogia: O "Dicionário de Padrões" para mensagens de commit
// Garante que todo commit siga o padrão Conventional Commits

export default {
  extends: ['@commitlint/config-conventional'],

  rules: {
    // Tipos permitidos de commit
    'type-enum': [
      2,
      'always',
      [
        'feat', // ✨ Nova funcionalidade
        'fix', // 🐛 Correção de bug
        'docs', // 📝 Documentação
        'style', // 💄 Formatação (não afeta código)
        'refactor', // ♻️ Refatoração
        'perf', // ⚡ Performance
        'test', // ✅ Testes
        'chore', // 🔧 Manutenção/config
        'ci', // 👷 CI/CD
        'build', // 📦 Build system
        'revert', // ⏪ Reverter commit
      ],
    ],

    // Regras de formatação
    'type-case': [2, 'always', 'lower-case'], // tipo sempre minúsculo
    'subject-case': [2, 'never', ['upper-case']], // descrição não começa com maiúscula
    'subject-empty': [2, 'never'], // descrição não pode ser vazia
    'subject-full-stop': [2, 'never', '.'], // sem ponto final
    'header-max-length': [2, 'always', 100], // máximo 100 caracteres no header

    // Permite corpo e rodapé vazios (opcional)
    'body-leading-blank': [1, 'always'], // linha em branco antes do corpo
    'footer-leading-blank': [1, 'always'], // linha em branco antes do footer
  },
};

/*
📚 EXEMPLOS DE USO:

✅ CORRETO:
git commit -m "feat: add shader transition effects"
git commit -m "fix: resolve texture loading race condition"
git commit -m "docs: update README with installation steps"
git commit -m "refactor: extract shader manager into separate class"
git commit -m "test: add unit tests for NavigationController"
git commit -m "perf: optimize texture loading with caching"
git commit -m "chore: update dependencies"

❌ ERRADO:
git commit -m "Update files"           // sem tipo
git commit -m "Fixed bug"              // sem descrição clara
git commit -m "WIP"                    // não descritivo
git commit -m "feat: Add feature."     // ponto final
git commit -m "FEAT: add feature"      // tipo em maiúscula

🎯 ESTRUTURA:
<tipo>(<escopo>): <descrição>

<corpo opcional>

<rodapé opcional>

Exemplo completo:
feat(navigation): add keyboard navigation support

Implements arrow keys and spacebar navigation.
Closes #123
*/
