import type { NextPage } from "next";
import Head from "next/head";
import { SolanaPoolSwapView } from "views/SolanaPoolSwapView";

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
      <SolanaPoolSwapView />
    </div>
  );
};

export default Home;
