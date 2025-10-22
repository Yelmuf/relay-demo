import { Environment, Network, RecordSource, Store, RequestParameters, Variables } from 'relay-runtime';

async function fetchGraphQL(text: string, variables: Variables): Promise<any> {
  const response = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: text,
      variables,
    }),
  });

  return await response.json();
}

async function fetchRelay(params: RequestParameters, variables: Variables): Promise<any> {
  console.log(`fetching query ${params.name} with ${JSON.stringify(variables)}`);
  return fetchGraphQL(params.text!, variables);
}

export default new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource()),
});
