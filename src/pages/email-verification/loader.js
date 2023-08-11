import { API } from "@/util";
import { useParams } from "react-router-dom";

export default async function loader({ params }) {
  // TODO This and the route should be colocated with auth stuff
  // TODO NOW profile page with "resend verification email"
  return fetch(API + "auth/email-verification/" + params.token);
}
