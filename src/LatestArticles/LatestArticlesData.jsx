import React, { useState, useEffect } from "react";
import ArticlesData from "../JsonArticlesData/ArticlesData.json";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addArticlesData } from "../ReduxSlice/LatestAllArticlesSlice";

const LatestArticlesData = () => {
  const [articles, setArticles] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const entries = ArticlesData.feed.entry;
    const articleData = entries.map((entry) => ({
      title: entry.title,
      image: entry.content.__text.match(/src="([^"]+)"/)
        ? entry.content.__text.match(/src="([^"]+)"/)[1]
        : null,
      author: entry.author.name,
      publishedDate: new Date(entry.published).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      link: entry.link._href,
    }));

    // console.log("Updated articleData:", articleData);

    // Dispatch the articleData to the Redux store
    dispatch(addArticlesData(articleData));

    setArticles(articleData.slice(0, 5));
  }, []);

  useEffect(() => {
    // articles && console.log("Articles state updated:", articles);
  }, [articles]);

  return (
    <div>
      <button id="bottone1" className="mt-10">
        <strong>Latest Articles</strong>
      </button>
      <div>
        {articles &&
          articles.map((article, index) => (
            <div key={index}>
              <img className="mt-5 rounded-lg border-[2px] border-purple-600" src={article.image} alt="" />
              <h2 className="mt-5 mb-5 text-amber-400 font-semibold">{article.title}</h2>
              <p className="text-lime-400 font-light">By {article.author}</p>
              <p className="text-lime-400 mb-5 font-light">
                Published : {article.publishedDate}
              </p>
              <p className="text-blue-600 hover:underline  hover:text-red-600 mb-10">
                <Link to={article.link} key={index}>
                  Read More
                </Link>
              </p>
              <div className="w-[90vw] border-[1px] border-gray-600"></div>
            </div>
          ))}
      </div>
      <Link to="/learn/see-more-articles">
        <button type="button" className="btn mx-[15vw] mt-5">
          <strong className="strong2">See More Articles</strong>
          <div id="container-stars">
            <div id="stars"></div>
          </div>

          <div id="glow">
            <div class="circle"></div>
            <div class="circle"></div>
          </div>
        </button>
      </Link>
    </div>
  );
};

export default LatestArticlesData;
