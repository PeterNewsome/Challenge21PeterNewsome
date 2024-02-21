const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schema'); // Importing typeDefs and resolvers from the schema directory
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Create a new instance of ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // Use the authMiddleware function to check for the token in the request headers and add the user to the context
    const auth = await authMiddleware({ req });
    return {
      user: auth.user, // Now `user` will be available in your resolvers
    };
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function startServer() {
  // Start Apollo Server
  await server.start();

  // Apply Apollo GraphQL middleware and set the path to /graphql
  server.applyMiddleware({ app });

  // Serve up static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`🚀 GraphQL ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

startServer();
