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
  }
  type Role {
    _id: ID!
    role: String!
  }

  type UserWithRoles {
    _id: ID
    name: String!
    email: String!
    userRoles: Role
  }

  type Query {
    getUsers: [User!]!
    getRoles: [Role!]!
    getUsersAndRoles: [UserWithRoles!]!
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
        const result = await User.aggregate([
          {
            $lookup: {
              from: "roles", // Nombre de la colección de roles
              localField: "roleId", // Campo en la colección de usuarios
              foreignField: "_id", // Campo en la colección de roles
              as: "userRoles" // Nombre del nuevo campo que contendrá los roles
            }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              userRoles: { $arrayElemAt: ["$userRoles", 0] } // Extraer el primer elemento del array de roles
            }
          }
        ]);
        return result;
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
