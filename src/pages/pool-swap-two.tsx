import type { NextPage } from "next";
import Head from "next/head";
import { SolanaSwapVersionTwo } from "views/SolanaSwapVersionTwo";

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
      <SolanaSwapVersionTwo />
    </div>
  );
};

export default Home;
