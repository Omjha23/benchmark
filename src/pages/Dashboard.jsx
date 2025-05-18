

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserFromToken } from '../services/api';
import UserDashboard from '../components/dashboard/UserDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';

const Dashboard = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
   
    if (user) {
      setLoading(false);
      return;
    }

    
    const fetchUser = async () => {
      try {
        const response = await getUserFromToken(); 
        if (response?.data) {
          login(response.data); 
        } else {
          setError('Failed to retrieve user information');
        }
      } catch (err) {
        console.error('Error fetching user from token:', err);
        setError('An error occurred while retrieving user information.');
      } finally {
        setLoading(false); 
      }
    };

    fetchUser();
  }, [user, login]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  
  return user?.isAdmin ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;
