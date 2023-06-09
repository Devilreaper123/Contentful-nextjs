import { createClient } from "contentful";
import Head from "next/head";
import { Entry } from "contentful";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const client = createClient({
  space: process.env.CONTENTFULL_SPACE_ID as string,
  accessToken: process.env.CONTENTFULL_ACCESS_KEY as string,
});
interface RecipeFields {
  slug: string;
}
interface RecipeEntry extends Entry<RecipeFields> {
  // define other fields here
}
export const getStaticPaths = async () => {
  const res = await client.getEntries<RecipeFields>({
    content_type: "recipe",
  });
  const paths = res.items.map((item: RecipeEntry) => {
    return {
      params: {
        slug: item.fields.slug,
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
};
export async function getStaticProps({ params }) {
  const { items } = await client.getEntries({
    content_type: "recipe",
    "fields.slug": params.slug,
  });
  return {
    props: {
      recipe: items[0],
    },
  };
}

export default function RecipeDetails({ recipe }) {
  const { featuredImage, title, cookingTime, ingredients, method } =
    recipe.fields;
  return (
    <>
      <Head>
        <title>{recipe.fields.title}</title>
      </Head>
      <div>
        <div className="banner">
          <Image
            src={"https:" + featuredImage.fields.file.url}
            width={featuredImage.fields.file.details.image.width}
            height={featuredImage.fields.file.details.image.height}
            alt={""}
          />
          <h2>{title}</h2>
        </div>

        <div className="info">
          <p>Takes about {cookingTime} mins to cook.</p>
          <h3>Ingredients:</h3>

          {ingredients.map((ing) => (
            <span key={ing}>{ing}</span>
          ))}
        </div>

        <div className="method">
          <h3>Method:</h3>
          <div>{documentToReactComponents(method)}</div>
        </div>

        <style jsx>{`
          h2,
          h3 {
            text-transform: uppercase;
          }
          .banner h2 {
            margin: 0;
            background: #fff;
            display: inline-block;
            padding: 20px;
            position: relative;
            top: -60px;
            left: -10px;
            transform: rotateZ(-1deg);
            box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
          }
          .info p {
            margin: 0;
          }
          .info span::after {
            content: ", ";
          }
          .info span:last-child::after {
            content: ".";
          }
        `}</style>
      </div>
    </>
  );
}
