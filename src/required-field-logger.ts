// eslint-disable-next-line @productboard/custom-rules/ban-imports
import type { RelayFieldLogger } from "relay-runtime";

const logError = (message: string, meta: object) => {
  console.error(message, { module: "graphql-client", ...meta });
};

const logWarning = (message: string, meta: object) => {
  console.warn(message, { module: "graphql-client", ...meta });
};

const exhaustiveCheck = (kind: never) => {
  logError("Unknown type of requiredFieldLogger", { kind });
};

export const requiredFieldLogger: RelayFieldLogger = (event) => {
  const { kind } = event;

  // https://relay.dev/docs/next/api-reference/field-logger/
  switch (kind) {
    case "missing_required_field.log":
    case "missing_required_field.throw":
    case "missing_expected_data.log":
      console.warn(`${kind} | ${event.owner} > ${event.fieldPath}`);
      break;
    case "missing_expected_data.throw":
      console.warn(
        `${kind} | (${event.handled ? "" : "un"}handled) | ${event.owner} > ${
          event.fieldPath
        }`
      );
      break;
    case "relay_resolver.error":
    case "relay_field_payload.error":
      break;

    default:
      exhaustiveCheck(kind);
      break;
  }
};
