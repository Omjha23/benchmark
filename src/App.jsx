
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard'; 
import { AuthProvider } from './context/AuthContext';

import Option1 from './pages/reports/Option1CurrentBillability';
import Option2 from './pages/reports/Option2UpcomingRolloff';
import Option3 from './pages/reports/Option3BenchSummary';
import Option4 from './pages/reports/Option4BenchAging';
import Option5 from './pages/reports/Option5SkillWise';
import Option6 from './pages/reports/Option6Utilization';
import Option7 from './pages/reports/Option7ManagerWiseBench';
import Option8 from './pages/reports/Option8BenchReallocationEfficiency';
import Option9 from './pages/reports/Option9AttritionFromBench';
import Option10 from './pages/reports/Option10ForecastedBenchLoad';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            {/* Nested routes for the report options */}
            <Route path="option1" element={<Option1 />} />
            <Route path="option2" element={<Option2 />} />
            <Route path="option3" element={<Option3 />} />
            <Route path="option4" element={<Option4 />} />
            <Route path="option5" element={<Option5 />} />
            <Route path="option6" element={<Option6 />} />
            <Route path="option7" element={<Option7 />} />
            <Route path="option8" element={<Option8 />} />
            <Route path="option9" element={<Option9 />} />
            <Route path="option10" element={<Option10 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
