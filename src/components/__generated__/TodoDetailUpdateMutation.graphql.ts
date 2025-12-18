/**
 * @generated SignedSource<<0f085d97f3fe26f385c2c7b579181678>>
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
export type TodoDetailUpdateMutation$variables = {
  input: UpdateTodoInput;
};
export type TodoDetailUpdateMutation$data = {
  readonly updateTodo: {
    readonly todo: {
      readonly description: {
        readonly long: string | null | undefined;
      };
      readonly icon: string | null | undefined;
      readonly id: string;
    };
  };
};
export type TodoDetailUpdateMutation = {
  response: TodoDetailUpdateMutation$data;
  variables: TodoDetailUpdateMutation$variables;
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
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TodoDetailUpdateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TodoDetailUpdateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d1339ed6afe7a0c32c24a42402e7d2b0",
    "id": null,
    "metadata": {},
    "name": "TodoDetailUpdateMutation",
    "operationKind": "mutation",
    "text": "mutation TodoDetailUpdateMutation(\n  $input: UpdateTodoInput!\n) {\n  updateTodo(input: $input) {\n    todo {\n      id\n      icon\n      description {\n        long\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1fb85f4a416f3a425c400c5d2a1dfbda";

export default node;
