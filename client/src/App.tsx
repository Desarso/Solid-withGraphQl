import { Component, createSignal, For } from "solid-js";
import { createClient, subscriptionExchange, defaultExchanges } from "@urql/core";
import { createResource } from "solid-js";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { pipe, subscribe } from "wonka";

// const subscriptionClient = new SubscriptionClient("ws://localhost:4000/graphql", {
//   reconnect: true,
// });

const client = createClient({
  url: "http://localhost:4000/graphql",
  // exchanges: [
  //   ...defaultExchanges,
  //   subscriptionExchange({
  //     forwardSubscription: (operation) => 
  //     subscriptionClient.request(operation),
  //   }),
  // ]

});


const [todos, { refetch }] = createResource(() =>
  client
    .query(
      `
      query{
        getTodos{
          id 
          done
          text
        }
      }
      `,
      { id: "test" }
    )
    .toPromise()
    .then((req) => {
      // console.log(req.operation.context.meta?.cacheOutcome);
      // console.log(req);
      if (req.operation.context.meta?.cacheOutcome === "hit") {
        return [];
      }
      return req.data.getTodos;
    })
);

const App: Component = () => {
  const [text, setText] = createSignal("");

  const toggle = async (id: string) => {
    await client
      .mutation(
        `
      mutation($id: ID!, $done: Boolean!){
        setDone(id: $id, done: $done){
          id
        }
      }
      `,
        {
          id,
          done: !todos().find((todo: any) => todo.id === id).done,
        }
      )
      .toPromise();
    refetch();
  };

  const onDelete = async (id: string) => {
    await client
      .mutation(
        `
      mutation($id: ID!){
        deleteTodo(id: $id){
          id
        }
      }
      `,
        {
          id,
        }
      )
      .toPromise();
    await refetch();
  };

  const onAdd = async () => {
    await client
      .mutation(
        `
      mutation($text: String!){
        addTodo(text: $text){
          text
          id
        }
      }
      `,
        {
          text: text(),
        }
      )
      .toPromise();
    refetch();
    setText("");
  };

  return (
    <div>
      <For each={todos()}>
        {({ id, done, text }: { id: string; done: boolean; text: string }) => (
          <div>
            <input type="checkbox" checked={done} onClick={() => toggle(id)} />
            <span>{text}</span>
            <button onclick={() => onDelete(id)}>Delete Me</button>
          </div>
        )}
      </For>
      <input
        type="text"
        value={text()}
        oninput={(evt) => setText(evt.currentTarget.value)}
      />
      <button onclick={onAdd}>Add</button>
    </div>
  );
};

export default App;
