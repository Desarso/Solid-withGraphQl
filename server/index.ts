import { createServer, createPubSub, Repeater, pipe, map } from "graphql-yoga";

const TODOS_CHANNEL = "TODOS_CHANNEL";

const pubsub = createPubSub();

let todos = [
  {
    id: "1",
    text: "Learn GraphQL + Solid",
    done: false,
  },
];

const typeDefs = `
    type Todo {
        id: ID!
        done: Boolean!
        text: String!
    }
    type Query {
        getTodos: [Todo!]!
    }
    type Mutation {
        addTodo(text: String!): Todo!
        setDone(id: ID!, done: Boolean!): Todo!
        deleteTodo(id: ID!): [Todo!]!
    }
    type Subscription {
        todos: [Todo!]!
    }
    `;
const resolvers = {
  Query: {
    getTodos: () => todos,
  },
  Mutation: {
    addTodo: (_: unknown, { text }: { text: string }) => {
      const newTodo = {
        id: Math.random().toString(),
        text,
        done: false,
      };
      todos.push(newTodo);
      pubsub.publish(TODOS_CHANNEL, { todos });
      return newTodo;
    },
    deleteTodo: (_: unknown, { id }: { id: string }) => {
      todos = todos.filter((todo) => todo.id !== id);
      pubsub.publish(TODOS_CHANNEL, { todos });
      return todos;
    },
    setDone: (_: unknown, { id, done }: { id: string; done: boolean }) => {
      const todo = todos.find((todo) => todo.id === id);
      if (!todo) {
        throw new Error(`Couldn't find todo with id ${id}`);
      }
      if (todo) {
        todo.done = done;
      }
      pubsub.publish(TODOS_CHANNEL, { todos });
      return todo;
    },
  },
  Subscription: {
    todos: {
      subscribe: () =>   pipe(
        Repeater.merge([
          undefined,
          pubsub.subscribe(TODOS_CHANNEL),
        ]),
        map(() => todos)
      ),
      resolve: (payload: any) => payload,

     
    },
  },
};

const server = createServer({
  schema: {
    typeDefs,
    resolvers,
  },
});

server
  .start()
  .then(() => console.log("Server is running on https://localhost:4000"));
