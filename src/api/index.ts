import {
  ApolloClient,
  split,
  HttpLink,
  gql,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  const adminSecret = localStorage.getItem("x-hasura-admin-secret");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      ...(adminSecret && { "x-hasura-admin-secret": adminSecret }),
    },
  };
});

const httpLink = new HttpLink({
  uri: "https://smart-primer.herokuapp.com/v1/graphql",
});

const wsLink = new WebSocketLink({
  uri: "wss://smart-primer.herokuapp.com/v1/graphql",
  options: {
    lazy: true,
    reconnect: true,
    connectionParams: () => {
      const token = localStorage.getItem("token");
      const adminSecret = localStorage.getItem("x-hasura-admin-secret");
      return {
        headers: {
          authorization: token ? `Bearer ${token}` : "",
          ...(adminSecret && { "x-hasura-admin-secret": adminSecret }),
        },
      };
    },
  },
});

export const client = new ApolloClient({
  link: split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    authLink.concat(httpLink)
  ),
  cache: new InMemoryCache(),
});

const ADD_EVENT = gql`
  mutation AddEvent(
    $type: String!
    $page: String!
    $userId: Int!
    $data: String!
  ) {
    insert_event(
      objects: { type: $type, page: $page, user_id: $userId, data: $data }
    ) {
      affected_rows
    }
  }
`;

export const reportAnswer = async (page: string, userId: number, data: any) => {
  await client.mutate({
    mutation: ADD_EVENT,
    variables: {
      type: "answer",
      page,
      userId,
      data: JSON.stringify(data),
    },
  });
};

export const reportGiveUpAttempt = async (page: string, userId: number) => {
  await client.mutate({
    mutation: ADD_EVENT,
    variables: {
      type: "giveup",
      page,
      userId,
      data: JSON.stringify({}),
    },
  });
};
