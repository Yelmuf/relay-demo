import {
  Environment,
  Network,
  RecordSource,
  Store,
  RequestParameters,
  Variables,
  GraphQLResponse,
} from "relay-runtime";
import { missingFieldHandlers } from "./missing-field-handlers";
import { requiredFieldLogger } from "./required-field-logger";
import { createRequestHandler } from "./createRequestHandler";
import { delay, fetchGraphQL } from "./utils";

async function fetchFn(
  params: RequestParameters,
  variables: Variables,
): Promise<GraphQLResponse> {
  console.debug(
    `[fetchFn] querying ${params.name} with ${JSON.stringify(variables)}`,
  );

  if (params.name === "TodoDetailQuery") {
    await delay(1500);
  } else {
    await delay(1000);
  }

  const response = await fetchGraphQL(params.text!, variables);
  console.debug(`[fetchFn] got response for query ${params.name}`, response);

  return response;
}

export default new Environment({
  network: Network.create(createRequestHandler(fetchFn)),
  // network: Network.create(fetchRelay),
  store: new Store(new RecordSource(), {
    // gcReleaseBufferSize: 30,
    gcReleaseBufferSize: 0,
    // queryCacheExpirationTime: 60 * 1000,

    // @ts-ignore This logger is not in TS types :\
    log: (e) => {
      console.debug(`[Relay Store] ${e.name}`, e);
    },
  }),
  relayFieldLogger: requiredFieldLogger,
  missingFieldHandlers,
  log: (e) => {
    console.debug(`[Relay Environment] ${e.name}`, e);

    // This is where it starts
    if (e.name === "execute.complete" && e.executeId === 100003) {
      // debugger;
    }
  },
});
