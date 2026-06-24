"use client"
import { useState } from "react";
import Link from "next/link";
import LoaderComponents from "../Loader";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/auth";

const Registrationcomponent = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const router = useRouter()

  const formSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!name || !email || !password) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoader(true);
      const result = await registerUser(name, address, email, password);

      if (result.success) {
        setLoader(false);
        alert("User created successfully");
        router.push("/");
      } else {
        setLoader(false);
        setError(result.message || "Failed to create user");
      }
    } catch (error) {
      setLoader(false);
      console.error("Error creating user:", error);
      setError("An unexpected error occurred");
    }
  }

  return (
    <>
      {
        loader && <LoaderComponents />
      }
      <div className="max-w-xl mx-auto mt-7 bg-white rounded-lg">
        <div className="shadow-lg p-5 rounded-lg border-t-4 border-b-4 border-l-4 border-r-4 border-blue-500">
          <h1 className="text-2xl mb-4 text-center">Registration Form</h1>
          <form className="flex flex-col gap-3 bg-gray-200 p-4 rounded-lg " onSubmit={formSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block font-semibold">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-2 py-1 border rounded mt-2"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block font-semibold">
                Address
              </label>
              <input
                type="text"
                className="w-full px-2 py-1 border rounded mt-2"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
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
              <button className="bg-blue-500  text-white font-bold cursor-pointer px-6 py-4 w-full text-2xl" type="submit">Register</button>
            </div>
          </form>
          {
            error && <p className="text-red-500 text-center mt-2">{error}</p>
          }
          <div className=" text-center mt-3">
            <Link href={`/`}>
              Already have an account ? <span className="underline">Login</span>
            </Link>
          </div>
        </div>
      </div>

    </>
  )
}


export default Registrationcomponent;
