import React, { useState } from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ApolloProvider } from '@apollo/client';
import client from './utils/apolloClient'; // Ensure the path matches your project structure

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <ApolloProvider client={client}>
      <>
        <Navbar showModal={showModal} setShowModal={setShowModal} />
        <Outlet />
      </>
    </ApolloProvider>
  );
}

export default App;
