/**
 * @generated SignedSource<<fc92a41dddda2b346af02b89874a4cc7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
export type AddTodoInput = {
  clientMutationId?: string | null | undefined;
  icon?: string | null | undefined;
  long?: string | null | undefined;
  short: string;
};
export type TodoListAddMutation$variables = {
  input: AddTodoInput;
};
export type TodoListAddMutation$data = {
  readonly addTodo: {
    readonly todo: {
      readonly completed: boolean;
      readonly description: {
        readonly short: string;
      };
      readonly icon: string | null | undefined;
      readonly id: string;
    };
  };
};
export type TodoListAddMutation$rawResponse = {
  readonly addTodo: {
    readonly todo: {
      readonly completed: boolean;
      readonly description: {
        readonly short: string;
      };
      readonly icon: string | null | undefined;
      readonly id: string;
    };
  };
};
export type TodoListAddMutation = {
  rawResponse: TodoListAddMutation$rawResponse;
  response: TodoListAddMutation$data;
  variables: TodoListAddMutation$variables;
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
    "concreteType": "AddTodoPayload",
    "kind": "LinkedField",
    "name": "addTodo",
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
    "name": "TodoListAddMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TodoListAddMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ce3c116a0ae1c87e23afbb34a2cc8306",
    "id": null,
    "metadata": {},
    "name": "TodoListAddMutation",
    "operationKind": "mutation",
    "text": "mutation TodoListAddMutation(\n  $input: AddTodoInput!\n) {\n  addTodo(input: $input) {\n    todo {\n      id\n      completed\n      icon\n      description {\n        short\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "8a399e950822d23124187437e8666715";

export default node;
