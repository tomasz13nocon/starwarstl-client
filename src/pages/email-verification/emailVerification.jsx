import Alert from "@components/alert";
import { useParams } from "react-router-dom";
import Spinner from "@components/spinner";
import { useAuth } from "@/context/authContext";
import c from "./styles/index.module.scss";
import { useFetch } from "@hooks/useFetch";

export default function EmailVerificaiton() {
  const { token } = useParams();
  const { actions } = useAuth();
  const [_, fetching, alert] = useFetch(actions.verifyEmail.bind(null, token), {
    onMount: true,
    successAlert: "Email veritfication successful",
  });

  return (
    <div className={c.container}>
      {fetching && (
        <>
          <h2>Veryfing email...</h2>
          <Spinner size={36} style={{ display: "block", margin: "auto" }} />
        </>
      )}
      <Alert alert={alert} />
    </div>
  );
}
