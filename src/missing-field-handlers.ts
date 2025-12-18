/* eslint-disable @productboard/custom-rules/ban-imports */
import { ROOT_TYPE } from "relay-runtime";
import type { EnvironmentConfig } from "relay-runtime/lib/store/RelayModernEnvironment";

export const missingFieldHandlers: EnvironmentConfig["missingFieldHandlers"] = [
  {
    kind: "linked",
    handle: (field, recordProxy, variables) => {
      console.log(
        "[missingFieldHandlers] linked: checking of data is missing for field ",
        field.name,
        field
      );
      if (
        !!recordProxy &&
        recordProxy.getType() === ROOT_TYPE &&
        field.name === "node" &&
        "id" in variables &&
        variables.id
      ) {
        console.log(
          "[missingFieldHandlers] linked: data is found for field ",
          field
        );
        return variables.id as string;
      }

      console.log(
        "[missingFieldHandlers] linked: data is missing for field ",
        field
      );

      return undefined;
    },
  },
  {
    kind: "pluralLinked",
    handle: (field, recordProxy, variables) => {
      console.log(
        "[missingFieldHandlers] pluralLinked: checking of data is missing for field ",
        field.name,
        field
      );
      if (
        !!recordProxy &&
        recordProxy.getType() === ROOT_TYPE &&
        field.name === "nodes" &&
        "ids" in variables
      ) {
        console.log(
          "[missingFieldHandlers] pluralLinked: data is found for field ",
          field
        );
        return variables.ids as Array<string>;
      }

      console.log(
        "[missingFieldHandlers] pluralLinked: data is missing for field ",
        field
      );

      return undefined;
    },
  },
];
