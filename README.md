# Consultoria Mobile

Aplicativo mobile React Native com Expo para o sistema de consultoria.

## 🚀 Tecnologias

- **React Native** com **Expo**
- **TypeScript**
- **React Navigation** (Navegação)
- **Axios** (Cliente HTTP)
- **AsyncStorage** (Armazenamento local)

## 📁 Estrutura do Projeto (Arquitetura Modular)

O projeto segue arquitetura modular baseada em features, similar ao padrão Next.js:

```
app/                    # UI, layouts e roteamento (nunca lógica de negócio)
├── App.tsx            # Componente raiz do app
└── navigation/        # Configuração de navegação

src/
├── modules/           # Módulos de features (arquitetura modular)
│   ├── auth/         # Módulo de autenticação
│   │   ├── api/      # Chamadas HTTP específicas
│   │   ├── components/ # UI específica (LoginScreen)
│   │   ├── contexts/ # Contextos React
│   │   ├── hooks/    # Hooks específicos (useAuth)
│   │   ├── services/ # Lógica de negócio (AuthService)
│   │   ├── types/    # Tipagens da feature
│   │   └── index.ts  # Exportações do módulo
│   ├── checkins/     # Módulo de check-ins
│   ├── exercises/    # Módulo de exercícios
│   ├── training/     # Módulo de treinos
│   └── home/         # Módulo home
│
└── shared/           # Código reutilizável
    ├── api/          # Cliente HTTP e interfaces
    ├── config/       # Configurações (API, etc)
    ├── constants/    # Constantes compartilhadas
    ├── libs/         # Bibliotecas (StorageService)
    ├── services/     # Inicialização de serviços
    └── types/        # Tipos compartilhados
```

### 📌 Regras da Arquitetura

Cada módulo (`src/modules/[feature]`) deve conter:
- `api/` → rotas, controllers, server actions ou chamadas HTTP
- `services/` → lógica de negócio
- `repositories/` → acesso a banco/dados (se necessário)
- `components/` → UI específica da feature (React/React Native)
- `hooks/` → hooks específicos
- `utils/` → funções auxiliares
- `types/` → tipagens da feature
- `validations/` → schemas/zod/DTOs (se necessário)

A pasta `src/shared` contém tudo que é reutilizável:
- `api/` → Cliente HTTP, interfaces
- `config/` → Configurações globais
- `libs/` → Bibliotecas e utilitários
- `constants/` → Constantes compartilhadas
- `types/` → Tipos compartilhados
- `services/` → Inicialização de serviços singleton

A pasta `app/` contém apenas UI, layouts e roteamento, nunca lógica de negócio.

## 🏗️ Arquitetura SOLID

O projeto segue os princípios SOLID:

- **Single Responsibility**: Cada serviço tem uma única responsabilidade
- **Open/Closed**: Fácil de estender sem modificar código existente
- **Liskov Substitution**: Interfaces permitem substituição de implementações
- **Interface Segregation**: Interfaces específicas e coesas
- **Dependency Inversion**: Dependências de abstrações, não implementações

## ⚙️ Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar URL da API

Edite `src/shared/config/api.ts` e ajuste a URL base da API:

```typescript
export const API_CONFIG = {
  baseURL: __DEV__
    ? 'http://localhost:3000/api/mobile'  // Desenvolvimento
    : 'https://your-production-url.com/api/mobile',  // Produção
  timeout: 10000,
};
```

**Importante**:
- Para testar no dispositivo físico, use o IP da sua máquina ao invés de `localhost`
- Para emulador Android: `http://10.0.2.2:3000/api/mobile`
- Para iOS Simulator: `http://localhost:3000/api/mobile`

### 3. Executar o projeto

```bash
# Iniciar o servidor de desenvolvimento
npm start

# Executar no Android
npm run android

# Executar no iOS (requer macOS)
npm run ios
```

## 📱 Funcionalidades

- ✅ Autenticação (Login/Logout)
- ✅ Gerenciamento de token JWT
- ✅ Integração com API
- ✅ Armazenamento local seguro
- ✅ Navegação entre telas
- ✅ Arquitetura modular baseada em features

## 🔌 Endpoints da API

O app consome os seguintes endpoints:

- `POST /api/mobile/auth/login` - Login
- `GET /api/mobile/auth/me` - Dados do usuário
- `GET /api/mobile/checkins` - Listar check-ins
- `POST /api/mobile/checkins` - Criar check-in
- `GET /api/mobile/exercises` - Listar exercícios
- `GET /api/mobile/training` - Listar treinos

## 🎨 Estilização

O projeto usa **StyleSheet** do React Native para estilização. Use `StyleSheet.create()` para criar estilos:

```tsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
});
```

## 📝 Adicionando uma Nova Feature

Siga este padrão ao adicionar uma nova feature:

1. Crie o módulo em `src/modules/[feature-name]/`
2. Organize seguindo a estrutura:
   - `api/` - chamadas HTTP
   - `services/` - lógica de negócio
   - `components/` - UI
   - `hooks/` - hooks
   - `types/` - tipagens
   - `index.ts` - exportações
3. Use código compartilhado de `src/shared/`
4. Evite duplicação - sempre verifique se já existe algo similar

## 📝 Próximos Passos

- [ ] Implementar telas de check-ins
- [ ] Implementar telas de treinos
- [ ] Implementar telas de exercícios
- [ ] Adicionar tratamento de erros global
- [ ] Adicionar loading states
- [ ] Implementar refresh token
- [ ] Adicionar testes

## 🤝 Contribuindo

Siga os princípios SOLID e evite duplicação de código. Sempre analise o código existente antes de implementar novas funcionalidades. Toda nova feature deve seguir o padrão modular descrito acima.
