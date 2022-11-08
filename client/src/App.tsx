import { For } from "solid-js/web";
import { Component, createResource, createSignal} from "solid-js";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';


// const subscriptionClient = new SubscriptionClient("ws://localhost:4000/graphql", {
//   reconnect: true,
// });

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

const Get_Todos = gql`
  query getTodos {
    todos {
      id
      text
      done 
    }
  }`;


const [todos, { refetch }] = createResource(() =>
  client
    .query({
     query: gql`
      query name{
        getTodos{
          id 
          done
          text
        }
      }
      `,
    })
    .then((result) => {
      console.log(result);
      return result.data.getTodos;
    })
);

const App: Component = () => {
  const [text, setText] = createSignal("");

  const toggle = async (id: any, done: boolean) => {
    await client
      .mutate({
         mutation: gql`
      mutation ($id: ID!, $done: Boolean!){
        setDone(id: $id, done: $done){
          id
        }
      }
      `,
          variables: {
            id: id,
            done: !done,
      }
      })
    refetch();
  };

  // const onDelete = async (id: string) => {
  //   await client
  //     .mutation(
  //       `
  //     mutation($id: ID!){
  //       deleteTodo(id: $id){
  //         id
  //       }
  //     }
  //     `,
  //       {
  //         id,
  //       }
  //     )
  //     .toPromise();
  //   await refetch();
  // };

  // const onAdd = async () => {
  //   await client
  //     .mutation(
  //       `
  //     mutation($text: String!){
  //       addTodo(text: $text){
  //         text
  //         id
  //       }
  //     }
  //     `,
  //       {
  //         text: text(),
  //       }
  //     )
  //     .toPromise();
  //   refetch();
  //   setText("");
  // };

  return (
    <div>
      <For each={todos()}>
        {({ id, done, text }: { id: any; done: boolean; text: string }) => (
          <div>
            <input type="checkbox" checked={done} onClick={() => toggle(id, done)} />
            <span>{text}</span>
            <button onclick={() => console.log("implement deletion")}>Delete Me</button>
          </div>
        )}
      </For>
      <input
        type="text"
        value={text()}
        oninput={(evt) => setText(evt.currentTarget.value)}
      />
      <button onclick={() => console.log("implement mutations")}>Add</button>
    </div>
  );
};

export default App;
