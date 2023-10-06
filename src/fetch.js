import { API } from "./util";

export async function addToWatchlist() {
  return {};
}

// PUT /lists/1234
export async function addToWatched(pageid) {
  console.log(pageid);

  let res = await fetch(API + "watched", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pageid }),
  });
  // let json = await jsonErrors(res);
  console.log(await res.json());

  // let res = await fetch(API + "watched", {
  //   method: "GET",
  //   headers: { "Content-Type": "application/json" },
  // });
  // console.log(await res.json());

  // let res = await fetch(API + "auth/user", {
  //   method: "GET",
  //   headers: { "Content-Type": "application/json" },
  // });
  // console.log(await res.json());
}
