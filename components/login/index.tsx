"use client"
import Link from "next/link";
import { useState } from "react";
import LoaderComponents from "../Loader";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


const Logincomponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const loginSubmitForm = async () => {
    try {
      setLoader(true);
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (!res?.ok) {
        setLoader(false);
        setError("Invalid credentials");
        return;
      } else {
        setLoader(false);
        router.replace("/Dashboard");
      }
    } catch (error) {
      setLoader(false);
      console.log('error', error);
      setError("An error occurred during login");
    }
  }

  const formSubmit = (e: any) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill email and password");
      return;
    }

    loginSubmitForm();
  }

  return (
    <>
      {loader && <LoaderComponents />}
      <div className="max-w-xl mx-auto mt-7 bg-white rounded-lg">
        <div className="shadow-lg p-5 rounded-lg border-t-4 border-b-4 border-l-4 border-r-4 border-blue-500">
          <h1 className="text-2xl mb-4 text-center">Login</h1>
          <form className="flex flex-col gap-3 bg-gray-200 p-4 rounded-lg" onSubmit={formSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block font-semibold">
                Email ID <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full px-2 py-1 border rounded mt-2"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block font-semibold">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                className="w-full px-2 py-1 border rounded mt-2"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="">
              <button
                className="bg-blue-500 text-white font-bold cursor-pointer px-6 py-4 w-full text-2xl"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          <div className="text-center mt-3">
            <Link href={`/register`}>
              Do not have an account? <span className="underline">Register</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}


export default Logincomponent;
