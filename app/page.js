import Image from "next/image";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Home() {
  // checking if user is logged in
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  const {getUser} = getKindeServerSession();
  const user = await getUser();

  return (
    <>
      {
        isUserAuthenticated ? (
          <div>
            <h1> Welcome, <b>{user.given_name +" "+ user.family_name}</b></h1>
            <p>You are logged in</p>
          </div>
        ):""}
      {
        !isUserAuthenticated ? (
          <div>
            <h1>Welcome</h1>
            <p>You are not logged in</p>
            <br />
            <hr />
            <RegisterLink>Signup</RegisterLink>
            <br />
            <LoginLink>Login</LoginLink>
            
          </div>
        ):""
      }
    </>
  );
}
