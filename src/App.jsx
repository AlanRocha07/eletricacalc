import Home from './pages/Home';

// Ponto de entrada da aplicação.
// Quando você implementar autenticação (Supabase), este é o lugar
// para verificar se o usuário está logado antes de renderizar a Home.
// Exemplo futuro:
//   if (!user) return <LoginPage />;
//   return <Home />;

export default function App() {
  return <Home />;
}
