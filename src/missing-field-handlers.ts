/* eslint-disable @productboard/custom-rules/ban-imports */
import { ROOT_TYPE } from 'relay-runtime';
import type { EnvironmentConfig } from 'relay-runtime/lib/store/RelayModernEnvironment';

export const missingFieldHandlers: EnvironmentConfig['missingFieldHandlers'] = [
  {
    kind: 'linked',
    handle: (field, recordProxy, variables) => {
      if (
        !!recordProxy &&
        recordProxy.getType() === ROOT_TYPE &&
        field.name === 'node' &&
        'id' in variables &&
        variables.id
      ) {
        return variables.id as string;
      }

      return undefined;
    },
  },
  {
    kind: 'pluralLinked',
    handle: (field, recordProxy, variables) => {
      if (
        !!recordProxy &&
        recordProxy.getType() === ROOT_TYPE &&
        field.name === 'nodes' &&
        'ids' in variables
      ) {
        return variables.ids as Array<string>;
      }

      return undefined;
    },
  },
];
