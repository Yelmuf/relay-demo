/**
 * @generated SignedSource<<602e0e5b3453b8b365b8c9b8c598bc91>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
export type UpdateTodoInput = {
  clientMutationId?: string | null | undefined;
  icon?: string | null | undefined;
  id: string;
  long?: string | null | undefined;
  short?: string | null | undefined;
};
export type TodoItemUpdateMutation$variables = {
  input: UpdateTodoInput;
};
export type TodoItemUpdateMutation$data = {
  readonly updateTodo: {
    readonly todo: {
      readonly description: {
        readonly short: string;
      };
      readonly id: string;
    };
  };
};
export type TodoItemUpdateMutation = {
  response: TodoItemUpdateMutation$data;
  variables: TodoItemUpdateMutation$variables;
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
    "concreteType": "UpdateTodoPayload",
    "kind": "LinkedField",
    "name": "updateTodo",
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
            "concreteType": "TodoDescription",
            "kind": "LinkedField",
            "name": "description",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "short",
                "storageKey": null
              }
            ],
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
    "name": "TodoItemUpdateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TodoItemUpdateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a21299f8825274e79fdb45307bd355f0",
    "id": null,
    "metadata": {},
    "name": "TodoItemUpdateMutation",
    "operationKind": "mutation",
    "text": "mutation TodoItemUpdateMutation(\n  $input: UpdateTodoInput!\n) {\n  updateTodo(input: $input) {\n    todo {\n      id\n      description {\n        short\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b3996b23efbc3c8671e7c9123d8739b2";

export default node;
