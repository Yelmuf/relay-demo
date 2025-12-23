import {
  Environment,
  Network,
  RecordSource,
  Store,
  RequestParameters,
  Variables,
  GraphQLResponse,
  GraphQLSingularResponse,
  CacheConfig,
  Observable,
} from "relay-runtime";
import { Sink } from "relay-runtime/lib/network/RelayObservable";
import { missingFieldHandlers } from "./missing-field-handlers";
import { requiredFieldLogger } from "./required-field-logger";

async function fetchGraphQL(text: string, variables: Variables): Promise<any> {
  const response = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: text,
      variables,
    }),
  });

  return await response.json();
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchFn(
  params: RequestParameters,
  variables: Variables
): Promise<GraphQLResponse> {
  console.debug(
    `[fetchFn] querying ${params.name} with ${JSON.stringify(variables)}`
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

const isSingularResponse = (
  response: GraphQLResponse
): response is GraphQLSingularResponse => !Array.isArray(response);

const handleGraphQLErrors = (
  response: GraphQLResponse,
  sink: Sink<unknown>,
  operationName: string,
  requestId: string
): boolean => {
  if (!("errors" in response) || !response.errors) {
    return false;
  }

  // Log errors for debugging
  try {
    console.error(`Received errors in the response`, {
      category: "request-handler",
      operationName,
      requestId,
    });
  } catch (error) {
    console.error(`Received errors in the response`, {
      category: "request-handler",
      operationName,
      requestId,
      error,
    });
  }

  // If no data is returned, fail the operation
  if (!response.data) {
    const errorMessage =
      response.errors.length === 1
        ? response.errors[0].message
        : `Multiple GraphQL errors: ${response.errors
            .map((e) => e.message)
            .join(", ")}`;
    sink.error(new Error(errorMessage));

    return true;
  }

  // If we have partial data, continue but log the errors
  return false;
};

const responseHandler =
  (sink: Sink<unknown>, request: RequestParameters, requestId: string) =>
  (response: GraphQLResponse | undefined) => {
    const operationName = request.name;

    if (!response) {
      throw new Error("No response from the server");
    }

    // Handle GraphQL errors first
    const hasFatalErrors = handleGraphQLErrors(
      response,
      sink,
      operationName,
      requestId
    );
    if (hasFatalErrors) {
      return;
    }

    // logAnyResponseIssues(operationName, response, requestId);

    // Process the response
    if (isSingularResponse(response)) {
      sink.next(response);
    } else {
      response.forEach((res) => sink.next(res));
    }
  };

const generateRequestId = (): string => {
  return Math.random().toString(16).slice(2);
};

export type Fetcher = (
  request: RequestParameters,
  variables: Variables,
  cacheConfig?: CacheConfig,
  requestId?: string
) => Promise<GraphQLResponse>;

// Inspired by https://github.com/adeira/universe/blob/28fe9302025ef46269a51c582aa8c97ac9ede1b9/src/relay/src/createRequestHandler.js
const createRequestHandler =
  (customFetcher: Fetcher) =>
  (
    request: RequestParameters,
    variables: Variables,
    cacheConfig: CacheConfig
  ) => {
    const observable = Observable.create((sink) => {
      const requestId = cacheConfig.transactionId ?? generateRequestId();
      void customFetcher(request, variables, cacheConfig, requestId)
        .then(responseHandler(sink, request, requestId))
        .catch((error: Error) => {
          sink.error(error);
        })
        .then(() => {
          sink.complete();
        });
    });

    return observable;
  };

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
