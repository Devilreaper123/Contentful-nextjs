import { createClient } from "contentful";
import Head from "next/head";
import RecipeCard from "../components/RecipeCard";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
export async function getStaticProps() {
  const client = createClient({
    space: process.env.CONTENTFULL_SPACE_ID,
    accessToken: process.env.CONTENTFULL_ACCESS_KEY,
  });

  const res = await client.getEntries({
    content_type: "recipe",
  });
  return {
    props: {
      recipes: res.items,
    },
  };
}
export default function Recipes({ recipes }) {
  return (
    <>
      <Head>
        <title>Home</title>
        
      </Head>
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.sys.id} recipe={recipe} />
        ))}
        <style jsx>{`
          .recipe-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 20px 60px;
          }
        `}</style>
      </div>
    </>
  );
}
