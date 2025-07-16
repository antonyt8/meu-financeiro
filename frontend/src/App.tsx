import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import './index.css';

// Componente para rotas protegidas
const ProtectedRoute: React.FC<{ component: React.ComponentType<any>; [key: string]: any }> = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useAuth();
  return (
    <Route
      {...rest}
      render={props =>
        loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          </div>
        ) : isAuthenticated ? (
          <Layout>
            <Component {...props} />
          </Layout>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

// Componente para rotas públicas (login/register)
const PublicRoute: React.FC<{ component: React.ComponentType<any>; [key: string]: any }> = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useAuth();
  return (
    <Route
      {...rest}
      render={props =>
        loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          </div>
        ) : !isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/dashboard" />
        )
      }
    />
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          {/* Rotas públicas */}
          <PublicRoute path="/login" component={Login} />
          <PublicRoute path="/register" component={Register} />

          {/* Rotas protegidas */}
          <ProtectedRoute path="/dashboard" component={Dashboard} />

          {/* Redirecionar raiz para dashboard */}
          <Redirect exact from="/" to="/dashboard" />
          {/* Rota 404 */}
          <Redirect to="/dashboard" />
        </Switch>
      </AuthProvider>
    </Router>
  );
};

export default App;
