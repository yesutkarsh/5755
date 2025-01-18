import Image from "next/image";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Homenav from "./components/HomeNav/Homenav";
import Hero from "./components/Hero/Hero";
import OpenMap from "./components/OpenMap/OpenMap";

export default async function Home() {
  // checking if user is logged in
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  const {getUser} = getKindeServerSession();
  const user = await getUser();

  return (
    <>
    {/* Seach bar */}
    <Homenav/>
    <Hero/>
    {/* <OpenMap/> */}
    </>
  );
}
