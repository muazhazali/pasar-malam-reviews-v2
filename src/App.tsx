import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Shops } from './pages/Shops';
import { Reviews } from './pages/Reviews';
import { ShopDetails } from './pages/ShopDetails';
import { WriteReview } from './pages/WriteReview';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shops" element={<Shops />} />
            <Route path="/shops/:id" element={<ShopDetails />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/write-review" element={<WriteReview />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
