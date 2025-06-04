import React from 'react';
import { Layout } from './components/Layout';
import { AppProvider } from './contexts/AppContext';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <AppProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </AppProvider>
  );
}

export default App;