const { ApolloServer, gql } = require('apollo-server');
const DataLoader = require('dataloader');

// Generar datos de usuarios
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
    posts: (parent, args, context) => {
      return context.postLoader.load(parent.id);
    },
  },
};

const postLoader = new DataLoader(async (userIds) => {
  const userPosts = userIds.map(userId => posts.filter(post => post.userId === userId));
  return userPosts;
});

// Configurar Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    postLoader,
  }),
});

// Iniciar el servidor
server.listen().then(({ url }) => {
  console.log(`Servidor GraphQL en ${url}`);
});
