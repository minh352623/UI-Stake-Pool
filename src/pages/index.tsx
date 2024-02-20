import type { NextPage } from "next";
import Head from "next/head";
import { SolanaPoolStakeView } from "views";

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
      <SolanaPoolStakeView />
    </div>
  );
};

export default Home;
