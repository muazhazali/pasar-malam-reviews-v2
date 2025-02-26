import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Shops } from './pages/Shops';
import { Reviews } from './pages/Reviews';
import { ShopDetails } from './pages/ShopDetails';
import { SubmitReview } from './pages/SubmitReview';
import { AuthProvider } from './contexts/AuthContext';

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
            <Route path="/reviews/new" element={<SubmitReview />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
