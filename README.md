<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 1 Ano em 12 Semanas

Sistema de gestão de execução baseado na metodologia de Brian Moran, focado em ciclos de 12 semanas para máxima produtividade.

## 📋 Sobre o Projeto

Este aplicativo ajuda você a implementar a metodologia "12 Week Year", transformando metas anuais em ciclos executáveis de 12 semanas com acompanhamento semanal de progresso e scorecard.

### Funcionalidades Principais

- **Visão Estratégica**: Defina sua visão aspiracional e de 3 anos
- **Ciclos de 12 Semanas**: Crie e gerencie múltiplos ciclos com metas específicas
- **Planejamento Tático**: Quebre metas em táticas semanais executáveis
- **Scorecard**: Acompanhe seu desempenho semanal com pontuação
- **Histórico de Ciclos**: Revise ciclos completados e aprendizados

## 🚀 Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1l2EvqbjRvyuQt-HybRRv3HkfUqlb6wqg

## Run Locally

**Prerequisites:** Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Lucide React** - Icons
- **Recharts** - Data visualization
- **@google/genai** - Google Generative AI integration

## 📁 Project Structure

```
├── components/     # Reusable UI components (Layout, etc.)
├── views/          # Page-level components (Vision, Plan, Week, Scorecard, etc.)
├── lib/            # Utility functions and helpers
├── App.tsx         # Main application component
├── types.ts        # TypeScript type definitions
├── constants.tsx   # Application constants
└── index.tsx       # Application entry point
```

## 📖 How to Use

1. **Vision View**: Define your long-term vision and 3-year goals
2. **Cycles View**: Create new 12-week cycles or view past cycles
3. **Plan View**: Set your 12-week vision and define goals with weekly tactics
4. **Week View**: Track weekly progress on your tactics
5. **Scorecard View**: Review your performance score and insights
6. **Profile View**: Manage app settings and data

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```
GEMINI_API_KEY=your_api_key_here
```

## 📄 License

Private project

