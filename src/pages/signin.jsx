export default function Signin() {
  return (
    <>
      <h1>Create an account</h1>
      <form method="post">
        <label htmlFor="username">username</label>
        <br />
        <input id="username" name="username" />
        <br />
        <label htmlFor="password">password</label>
        <br />
        <input type="password" id="password" name="password" />
        <br />
        <input type="submit" value="Continue" />
      </form>
    </>
  );
}
