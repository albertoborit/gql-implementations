const { ApolloServer, gql } = require('apollo-server');

const usersGenerated = () => {
  const limit = 100000;
  const arrayOfUsersGenerated = [];
  for (let i = 0; i < limit; i++) {
    arrayOfUsersGenerated.push({ id: i, name: "name" + i });
  }
  return arrayOfUsersGenerated;
};

// Generar datos de posts
const postsGenerated = () => {
  const limit = 100000;
  const arrayOfPostsGenerated = [];
  for (let i = 0; i < limit; i++) {
    arrayOfPostsGenerated.push({ id: "p" + i, title: "title" + i, userId: i });
  }
  return arrayOfPostsGenerated;
};

// Datos generados
const users = usersGenerated();
const posts = postsGenerated();

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    userId: ID!
  }

  type Query {
    users: [User!]!
  }
`;

const resolvers = {
  Query: {
    users: () => users,
  },
  User: {
    posts: (parent) => {
      return posts.filter(post => post.userId === parent.id);
    },
  },
};


// Configurar Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Iniciar el servidor
server.listen().then(({ url }) => {
  console.log(`Servidor 2 GraphQL en ${url}`);
});
