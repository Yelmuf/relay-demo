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
  const response = await fetch("http://localhost:4000/graphql", {
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

async function fetchRelay(
  params: RequestParameters,
  variables: Variables,
): Promise<any> {
  console.log(
    `fetching query ${params.name} with ${JSON.stringify(variables)}`,
  );

  if (params.name === "TodoDetailQuery") {
    await delay(1500); // artificial delay
    // debugger;
  } else {
    await delay(1000); // artificial delay
  }

  return await fetchGraphQL(params.text!, variables);
}

const isSingularResponse = (
  response: GraphQLResponse,
): response is GraphQLSingularResponse => !Array.isArray(response);

const logError = (message: string, meta: object) => {
  console.error(message, { module: "graphql-client", ...meta });
};

const handleGraphQLErrors = (
  response: GraphQLResponse,
  sink: Sink<unknown>,
  operationName: string,
  requestId: string,
): boolean => {
  if (!("errors" in response) || !response.errors) {
    return false;
  }

  // Log errors for debugging
  try {
    logError(`Received errors in the response`, {
      // errors: JSON.stringify(response.errors, getCircularReplacer(), 2),
      category: "request-handler",
      operationName,
      requestId,
    });
  } catch (error) {
    logError(`Received errors in the response`, {
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
      requestId,
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
  requestId?: string,
) => Promise<GraphQLResponse>;

export type CacheConfigMetadata =
  | {
      live?: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        polling_interval: number;
      };
      analyticsHeaderData?: Record<string, unknown>;
      skipBoardSpecificHeaders?: boolean;
      signal?: AbortSignal;
    }
  | undefined;

const isCacheConfigMetadata = (
  metadata: unknown,
): metadata is CacheConfigMetadata => {
  return (
    metadata !== null && typeof metadata === "object" && "live" in metadata
  );
};

// Inspired by https://github.com/adeira/universe/blob/28fe9302025ef46269a51c582aa8c97ac9ede1b9/src/relay/src/createRequestHandler.js
const createRequestHandler =
  (customFetcher: Fetcher) =>
  (
    request: RequestParameters,
    variables: Variables,
    cacheConfig: CacheConfig,
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

    const metadata = request.metadata;
    const cacheConfigMetadata = isCacheConfigMetadata(metadata)
      ? metadata
      : null;

    // support for @live_query(polling_interval: Int)
    // see https://pb.dev/docs/graphql-documentation/request_polling/
    const polling = cacheConfigMetadata?.live;

    // Nah
    // if (polling && polling.polling_interval > 0) {
    //   return createPollingObservable(observable, polling.polling_interval);
    // }

    return observable;
  };

export default new Environment({
  // network: Network.create(createRequestHandler(fetchRelay)),
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource(), {
    gcReleaseBufferSize: 0,
    queryCacheExpirationTime: 0,

    // @ts-ignore This logger is not in TS types :\
    log: (e) => console.debug(`[R-Store] ${e.name}`, e),
  }),
  relayFieldLogger: requiredFieldLogger,
  missingFieldHandlers,
  log: (e) => console.debug(`[R] ${e.name}`, e),
});
