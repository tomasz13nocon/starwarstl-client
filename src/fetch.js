import { API } from "./util";

// Return json from response and throw error if present
export async function jsonErrors(res) {
  let json = await res.json();
  if (!res.ok || json?.error) throw new Error(json.error ?? "An unexpected error occured");
  return json;
}

export async function createList(name) {
  let res = await fetch(API + "lists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return await jsonErrors(res);
}

export async function addToList(listName, pageid) {
  let res = await fetch(API + "lists/" + listName, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pageid }),
  });
  return await jsonErrors(res);
  // TODO add to local state (old todo)
}

export async function removeFromList(listName, pageid) {
  let res = await fetch(API + "lists/" + listName + "/" + pageid, {
    method: "DELETE",
  });
  return await jsonErrors(res);
}
