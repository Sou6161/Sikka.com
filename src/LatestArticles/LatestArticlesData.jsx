import React, { useState, useEffect } from "react";
import ArticlesData from "../JsonArticlesData/ArticlesData.json";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addArticlesData } from "../ReduxSlice/LatestAllArticlesSlice";
import { ExternalLink } from "lucide-react";
import { MdArticle } from "react-icons/md";

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

    setArticles(articleData.slice(0, 10));
  }, []);

  useEffect(() => {
    // articles && console.log("Articles state updated:", articles);
  }, [articles]);

  return (
    <div>
      <button
        id="bottone1"
        className="bg-blue-500 mt-[6vh] 2xlarge:mt-[10vh] ml-[10vw] 2xlarge:ml-[35vw] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        <strong className="flex items-center text-black">
          <MdArticle className="w-5 h-5 mr-2 text-black" />
          Latest Crypto Articles
        </strong>
      </button>
      <div className="container flex overflow-x-auto mx-auto px-4 py-4 2xlarge:py-[5vh] hide-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 2xlarge:inline-flex">
          {articles?.map((article, index) => (
            <div
              key={index}
              className="flex flex-col   2xlarge:w-[20vw] bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
            >
              <img
                className="w-full p-2 h-48 2xlarge:w-[30vw] object-center rounded-t-lg border-b border-purple-600"
                src={article.image}
                alt="not available"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-[4vw] 2xlarge:text-[1vw] text-amber-400 font-semibold mb-3 line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-lime-400 font-light">By {article.author}</p>
                <p className="text-lime-400 font-light mb-4">
                  Published: {article.publishedDate}
                </p>
                <div className="mt-auto">
                  <Link
                    to={article.link}
                    className="inline-flex items-center text-blue-400 hover:text-red-400 transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read More <ExternalLink className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Link to="/learn/crypto-articles">
        <button type="button" className="btn mx-[19vw] 2xlarge:mx-[35vw] mt-5">
          <strong className="strong2">See More Articles</strong>
          <div id="container-stars">
            <div id="stars"></div>
          </div>
          <div id="glow">
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
        </button>
      </Link>
    </div>
  );
};

export default LatestArticlesData;
