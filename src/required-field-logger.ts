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
      logWarning(
        `Missing value for field marked as non-nullable with @required(action: LOG)`,
        {
          fieldPath: event.fieldPath,
          owner: event.owner,
          category: kind,
        }
      );
      break;
    case "missing_required_field.throw":
      logError(
        `Missing value for field marked as non-nullable with @required(action: THROW)`,
        {
          fieldPath: event.fieldPath,
          owner: event.owner,
          category: kind,
        }
      );
      break;
    case "missing_expected_data.log":
      // logWarning(
      //   `No value for field in store although expected by the parent query`,
      //   {
      //     fieldPath: event.fieldPath,
      //     owner: event.owner,
      //     category: kind,
      //   }
      // );
      console.warn(`${kind} | ${event.owner} > ${event.fieldPath}`);
      break;
    case "missing_expected_data.throw":
      logError(
        `No value for field in store within @throwOnFieldError fragment`,
        {
          fieldPath: event.fieldPath,
          owner: event.owner,
          category: kind,
          handled: event.handled,
        }
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
