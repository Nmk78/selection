import { Github, Laptop, Mail } from "lucide-react";

const Footer = () => {
  return (
    <div className=" bg-black text-white flex flex-col items-center space-y-2 px-3 py-2">
      <h2 className="text-xl font-medium font-geistMono mb-2 mt-3">Purpose</h2>
      <div className="w-full border my-2 border-b-white" />
      <p className=" font-geistSans font-extralight text-center">
        This website has been developed as a personal project with the primary
        objective of serving as an online voting system within the <strong>Polytechnic
        University Myeik</strong>.The main purpose is to simplify and enhance the voting
        process, providing a user-friendly platform for the PU Myeik community
        to engage in online voting seamlessly.
      </p>
      <div className="w-1/2 py-3 flex justify-around">
        <a href="mailto:naymyokhant78@gmail.com">
          <Mail className="w-5 h-5" />
        </a>{" "}
        <a href="https://github.com/Nmk78/">
          <Github className="w-5 h-5" />
        </a>
        <a
          href="http://naymyokhant.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Laptop className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};

export default Footer;
