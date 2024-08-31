import React from "react";
import { useSelector } from "react-redux";

const LatestAllArticlesData = () => {
  const articles = useSelector((state) => state.AllArticles.ArticlesData);

  articles && console.log("Articles:", articles); // Add this line

  return (
    <div className="h-screen text-black bg-red-300 w-full">
      <h1>lhhhohohih</h1>
    </div>
  );
};

export default LatestAllArticlesData;
