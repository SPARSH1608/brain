// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router';
import Layout from './Layout';
import Dashboard from './pages/DashbaordPage'; // Ensure correct path
import { SignIn, SignUp } from './pages/Authpage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
