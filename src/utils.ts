export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchGraphQL(
  text: string,
  variables: Record<string, unknown>
): Promise<any> {
  const response = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: text,
      variables,
    }),
  });

  return await response.json();
}
