import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="absolute top-1/2 bg-black right-1/2 translate-x-1/2 -translate-y-1/2">
      <SignUp />
    </div>
  );
}