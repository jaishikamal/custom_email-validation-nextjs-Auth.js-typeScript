
import Link from "next/link";
const Logincomponent = () => {
    return (
        <> 
         <div className="max-w-xl mx-auto mt-7 bg-white rounded-lg">
                <div className="shadow-lg p-5 rounded-lg border-t-4 border-b-4 border-l-4 border-r-4 border-blue-500">
                    <h1 className="text-2xl mb-4 text-center">Login</h1>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="email" className="bloc font-semibold">
                                Email ID
                            </label>
                            <input type="email" className="w-full px-2 py-1 border rounded mt-2" id="email"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="bloc font-semibold">
                                password
                            </label>
                            <input type="password" className="w-full px-2 py-1 border rounded mt-2" id="password"
                             />
                        </div>
                        <div className="">
                            <button className="bg-blue-500  text-white font-bold cursor-pointer px-6 py-4 w-full text-2xl" type="submit">Login</button>
                        </div>
                    </form>
                    <div className=" text-center mt-3">
                        <Link href={`/register`}>
                            Do not have an account ? <span className="underline">Register</span>
                        </Link>
                    </div> 
                </div>
            </div>    

        </>
    )
}
 

export default Logincomponent;
