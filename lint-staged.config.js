// Lint-Staged Configuration
// 🎯 Analogia: O "Inspetor de Qualidade" que verifica apenas o que mudou
// Roda linters apenas nos arquivos que foram alterados (staged)

export default {
  // Arquivos JavaScript
  '*.js': [
    'eslint --fix', // Corrige problemas de linting
    'prettier --write', // Formata o código
  ],

  // Arquivos JSON, CSS
  '*.{json,css}': [
    'prettier --write', // Formata apenas
  ],
};

/*
🚀 COMO FUNCIONA:

1. Você faz alterações nos arquivos
2. git add arquivo.js
3. git commit -m "feat: nova funcionalidade"
4. Husky intercepta o commit
5. lint-staged roda nos arquivos staged:
   - ESLint corrige problemas
   - Prettier formata
6. Se tudo OK ✅ -> commit acontece
7. Se tem erro ❌ -> commit é bloqueado

💡 BENEFÍCIO:
Ao invés de rodar lint em TODO o projeto (lento),
roda apenas nos arquivos que você modificou (rápido)!

Exemplo:
- Projeto com 100 arquivos
- Você modificou apenas 2 arquivos
- lint-staged roda apenas nesses 2 ⚡
*/
