import { API } from "./util";

// Return json from response and throw error if present
export async function jsonErrors(res) {
  let json = await res.json();
  if (!res.ok || json?.error) throw new Error(json.error ?? "An unknown error occured");
  return json;
}

export async function getWatched() {
  let res = await fetch(API + "watched");
  return res.json();
}

export async function addToWatchlist(pageid) {
  let res = await fetch(API + "watchlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pageid }),
  });
  return await jsonErrors(res);
}

export async function addToWatched(pageid) {
  let res = await fetch(API + "watched", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pageid }),
  });
  return await jsonErrors(res);
  // TODO add to local state
}

export async function removeFromWatchlist(pageid) {
  let res = await fetch(API + "watchlist/" + pageid, {
    method: "DELETE",
  });
  return await jsonErrors(res);
}

export async function removeFromWatched(pageid) {
  let res = await fetch(API + "watched/" + pageid, {
    method: "DELETE",
  });
  return await jsonErrors(res);
}
