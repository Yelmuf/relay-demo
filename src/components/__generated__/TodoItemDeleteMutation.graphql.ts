/**
 * @generated SignedSource<<c4200ab089528118e464c488012291f3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
export type DeleteTodoInput = {
  clientMutationId?: string | null | undefined;
  id: string;
};
export type TodoItemDeleteMutation$variables = {
  input: DeleteTodoInput;
};
export type TodoItemDeleteMutation$data = {
  readonly deleteTodo: {
    readonly deletedTodoId: string;
  };
};
export type TodoItemDeleteMutation = {
  response: TodoItemDeleteMutation$data;
  variables: TodoItemDeleteMutation$variables;
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deletedTodoId",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TodoItemDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteTodoPayload",
        "kind": "LinkedField",
        "name": "deleteTodo",
        "plural": false,
        "selections": [
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TodoItemDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteTodoPayload",
        "kind": "LinkedField",
        "name": "deleteTodo",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteRecord",
            "key": "",
            "kind": "ScalarHandle",
            "name": "deletedTodoId"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "384be2b41f2e725c4efdf2d6f67272e1",
    "id": null,
    "metadata": {},
    "name": "TodoItemDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation TodoItemDeleteMutation(\n  $input: DeleteTodoInput!\n) {\n  deleteTodo(input: $input) {\n    deletedTodoId\n  }\n}\n"
  }
};
})();

(node as any).hash = "1d20ac78281acba7164a579c5cf08790";

export default node;
