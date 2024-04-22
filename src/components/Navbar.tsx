import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Navbar = () => {
  const router = useRouter();

  return (
    <div>
      <ul className="flex gap-3 font-bold">
        <li
          className={
            router.pathname == "/create-token"
              ? " text-yellow-500 font-bold"
              : ""
          }
        >
          <Link href="/create-token">Create Token</Link>
        </li>
        <li
          className={router.pathname == "/" ? " text-yellow-500 font-bold" : ""}
        >
          <Link href="/">Pool Staking</Link>
        </li>
        <li
          className={
            router.pathname == "/pool-swap" ? " text-yellow-500 font-bold" : ""
          }
        >
          <Link href="/pool-swap">Pool Swap</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
