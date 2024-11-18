import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ArticlesData from "../../JsonArticlesData/ArticlesData.json";
import { addArticlesData } from "../../ReduxSlice/LatestAllArticlesSlice";
import { MdArticle } from "react-icons/md";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";

const AllCryptoArticles = () => {
  const dispatch = useDispatch();
  const articles = useSelector((state) => state?.AllArticles?.ArticlesData);

  // Add this useEffect to ensure data is available even on direct navigation
  useEffect(() => {
    if (!articles || articles.length === 0) {
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
      dispatch(addArticlesData(articleData));
    }
  }, [dispatch, articles]);

  useEffect(() => {
    if (articles) {
      console.log("Articles:", articles);
    }
  }, [articles]);

  return (
    <>
      <div className=" bg-black">
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className=" bg-black">
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
                  <p className="text-lime-400 font-light">
                    By {article.author}
                  </p>
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
      </div>
    </>
  );
};

export default AllCryptoArticles;
