"use client";
import Link from "next/link";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { IoMdCall } from "react-icons/io";

const Home: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <h1 className="text-7xl font-bold tracking-tighter">
        Siriphong Chotirat
      </h1>
      <p className="text-lg">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, a!
      </p>
      <div className="flex flex-row space-x-4">
        <Link
          href={"https://github.com/FirstFirstFirstFirst"}
          target="_blank"
          className="flex flex-row items-center justify-center gap-4 border-2 border-black p-2 rounded-lg"
        >
          <FaGithub className="w-10 h-10" />
          <div className="font-bold">Github</div>
        </Link>
        <Link
          href={"https://www.facebook.com/profile.php?id=100017849800727"}
          target="_blank"
          className="flex flex-row items-center justify-center gap-4 border-2 border-black p-2 rounded-lg"
        >
          <FaFacebook className="w-10 h-10" />
          <div className="font-bold">Facebook</div>
        </Link>
        <Link
          href={"tel: +66 828308918"}
          className="flex flex-row items-center justify-center gap-4 border-2 border-black p-2 rounded-lg"
        >
          <IoMdCall className="w-10 h-10" />
          <div className="font-bold">+66 828308918</div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
