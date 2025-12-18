/**
 * @generated SignedSource<<ef0486578aca7a1943ded2b333b8f925>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
export type ToggleTodoInput = {
  clientMutationId?: string | null | undefined;
  id: string;
};
export type TodoItemToggleMutation$variables = {
  input: ToggleTodoInput;
};
export type TodoItemToggleMutation$data = {
  readonly toggleTodo: {
    readonly todo: {
      readonly completed: boolean;
      readonly id: string;
    };
  };
};
export type TodoItemToggleMutation = {
  response: TodoItemToggleMutation$data;
  variables: TodoItemToggleMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "ToggleTodoPayload",
    "kind": "LinkedField",
    "name": "toggleTodo",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
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
    "name": "TodoItemToggleMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TodoItemToggleMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "9122137e81a59b1e391578e340bcb462",
    "id": null,
    "metadata": {},
    "name": "TodoItemToggleMutation",
    "operationKind": "mutation",
    "text": "mutation TodoItemToggleMutation(\n  $input: ToggleTodoInput!\n) {\n  toggleTodo(input: $input) {\n    todo {\n      id\n      completed\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "bd973c1a171dbc515586d846f49d3db7";

export default node;
