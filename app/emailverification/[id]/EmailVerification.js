"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/Loading";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EmailVerification({ id }) {
  const router = useRouter();
  const [randomNumber, setRandomNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/auth/verifymail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, randomNumber }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      const resData = await res.json();
      setIsLoading(false);
      toast({
        title: "Email verification successful",
        className: "bg-green-500 text-white",
      });
      if (resData.type === "passwordChangeRequest")
        router.push("/changepassword");
      else router.push("/login");
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Email verification failed",
        description: error.message || error,
        className: "bg-red-500 text-white",
      });
    }
  };

  const resendMail = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/auth/verifymail?id=${id}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      setIsLoading(false);
      toast({
        title: "Verification mail sent successful",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Failed to send verification mail",
        description: error.message || error,
        className: "bg-red-500 text-white",
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-4/5 mx-auto h-full my-4">
      {isLoading && <Loading />}
      <h1 className="text-center font-bold text-2xl py-2">
        {" "}
        Email Verification
      </h1>
      <p className="text-lg text-center">
        An email has been sent to your email account. Please, check your inbox
        and input the 6 digit OTP here. The OTP will expire in 24 hours.
      </p>

      <Input
        onChange={(e) => setRandomNumber(e.target.value)}
        className="bg-primary-200 border border-primary-700 w-48 mx-auto mt-5 mb-2 p-3 text-center"
        placeholder="Enter 6 Digit Code Here"
      />
      <Button onClick={onSubmit} className="bg-primary-600 w-fit">
        Submit
      </Button>
      <p>
        Didn't receive the mail?{" "}
        <Button
          onClick={resendMail}
          className="m-0 p-0 bg-transparent hover:bg-transparent text-primary-800"
        >
          Resend
        </Button>
      </p>
      <div className="text-md text-center my-2 bg-primary-100 rounded-lg p-4 shadow-xl font-semibold text-red-800 text-pretty">
        <h2 className="text-lg font-bold mb-2">!!Important!!</h2>
        <p>
          Please, check your <span className="font-bold">Spam</span> folder too.
          The Verification Link and Code both will be present in the email.{" "}
          <span className="font-bold">
            If more than 30 minutes has passed, try again.
          </span>
        </p>
      </div>
    </div>
  );
}
