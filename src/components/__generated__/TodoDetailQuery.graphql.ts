/**
 * @generated SignedSource<<97d09894b20efea0a71b52300809f8ac>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
export type TodoDetailQuery$variables = {
  id: string;
};
export type TodoDetailQuery$data = {
  readonly todo: {
    readonly completed: boolean;
    readonly description: {
      readonly long: string | null | undefined;
    };
    readonly icon: string | null | undefined;
    readonly id: string;
  } | null | undefined;
};
export type TodoDetailQuery = {
  response: TodoDetailQuery$data;
  variables: TodoDetailQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "Todo",
    "kind": "LinkedField",
    "name": "todo",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "completed",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "icon",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "TodoDescription",
        "kind": "LinkedField",
        "name": "description",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "long",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TodoDetailQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TodoDetailQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "26bf803ce059462028fb773595779f2b",
    "id": null,
    "metadata": {},
    "name": "TodoDetailQuery",
    "operationKind": "query",
    "text": "query TodoDetailQuery(\n  $id: ID!\n) {\n  todo(id: $id) {\n    id\n    completed\n    icon\n    description {\n      long\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "47ad2cdf33d5c189b6a27530c01be435";

export default node;
