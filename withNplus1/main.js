const mongoose = require('mongoose');
const { ApolloServer, gql } = require('apollo-server');
const User = require('./user');
const Role = require('./role');

// Conectarse a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/nplus1', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', function () {
    console.log('Conexión exitosa a MongoDB');
});

// Definir el esquema GraphQL
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    roleId: ID!
    role: String!
  }

  type Role {
    id: ID!
    role: String!
  }

  type UserWithRoles {
    user: User!
    roles: [Role!]!
  }

  type Query {
    getUsers: [User!]!
    getRoles: [Role!]!
    getUsersAndRoles: UsersAndRoles!
  }

  type UsersAndRoles {
    users: [User!]!
    roles: [Role!]!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.find();
        return users;
      } catch (error) {
        throw new Error('No se pudieron obtener los usuarios');
      }
    },
    getRoles: async () => {
      try {
        const roles = await Role.find();
        return roles;
      } catch (error) {
        throw new Error('No se pudieron obtener los roles');
      }
    },
    getUsersAndRoles: async () => {
      try {
        const users = await User.find();
        const roles = await Role.find();
        return { users, roles };
      } catch (error) {
        throw new Error('No se pudieron obtener los usuarios y roles');
      }
    },
  },
};

// Configurar Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  cache: false
});

// Iniciar el servidor
server.listen().then(({ url }) => {
  console.log(`Servidor GraphQL en ${url}`);
});
