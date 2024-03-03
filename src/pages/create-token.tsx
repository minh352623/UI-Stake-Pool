import type { NextPage } from "next";
import Head from "next/head";
import { SolanaCreataTokenView } from "views/SolanaCreateTokenView";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title> Swapper!</title>
        <meta
          name="description"
          content="A demo site for Remi"
        />
      </Head>
      <SolanaCreataTokenView />
    </div>
  );
};

export default Home;
