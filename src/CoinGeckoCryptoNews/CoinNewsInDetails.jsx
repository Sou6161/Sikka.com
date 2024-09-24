import React, { useEffect, useState } from "react";
import { Newspaper, ExternalLink } from "lucide-react";

const CoinNewsInDetails = () => {
  const [cryptoNews, setCryptoNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCryptoNews = async () => {
      try {
        const response = await fetch(
          "https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=695cd6c649b0429497ecd26612fcea73328264e00c7eaac6580269c9f3bdc667"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const data = await response.json();
        setCryptoNews(data.Data.slice(0, 10));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCryptoNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <>
      <div className="mt-10 border-b-[1px] medium:w-[70vw] xlarge:w-[90vw] xlarge:relative xlarge:left-[3vw] xlarge:-top-[190vh] medium:mx-auto border-red-600 bg-red-200"></div>
      <div className="flex justify-center mt-10 xlarge:relative xlarge:-top-[190vh] xlarge:left-[2vw]">
        <button
          id="bottone1"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <strong className="flex items-center text-black">
            <Newspaper className="w-5 h-5 mr-2 text-black" />
            Latest Crypto News
          </strong>
        </button>
      </div>
      <div className="mt-10 p-2  xsmall:p-3  rounded-lg backdrop-blur-md backdrop-filter  outline-offset-2 overflow-x-auto hide-scrollbar xlarge:ml-[5vw] xlarge:w-[90vw]  xlarge:border-l-2 xlarge:border-r-2 xlarge:relative xlarge:-top-[190vh]  ">
        <ul className="pb-4 mt-2 flex-nowrap space-x-1  xsmall:space-x-1 medium:ml-[6vw] xlarge:flex ">
          {cryptoNews.map((article, index) => (
            <li
              key={index}
              className="flex-shrink-0 small:mt-5 w-[80vw] xsmall:w-[80vw] small:w-[80vw] medium:w-[70vw] large:w-[75vw] xlarge:w-[40vw] 2xlarge:w-[30vw]  xlarge:-ml-[10vw] rounded-lg overflow-hidden transition-transform duration-300"
            >
              <img
                className="w-full h-[28vh]  small:w-[75vw]   small:h-[35vh] small:ml-[5vw] medium:w-[65vw] medium:h-[40vh] large:w-[70vw] large:h-[50vh] xlarge:w-[30vw] xlarge:h-[30vh] 2xlarge:w-[25vw] border-2 border-purple-600 rounded-t-lg object-cover"
                src={article.imageurl}
                alt="https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled.png"
              />
              <div className="py-4 px-2 flex flex-col flex-grow small:ml-[4vw]">
                <h2 className="text-white font-semibold mb-2 line-clamp-2 text-sm xsmall:text-base small:text-lg">
                  {article.title}
                </h2>
                <p className="text-amber-400 font-semibold mb-4 line-clamp-3 text-xs xsmall:text-sm small:text-base">
                  {article.body.split(" ").slice(0, 20).join(" ")}...
                </p>
                <div className="mt-auto">
                  <h3 className="text-green-400 font-semibold text-xs xsmall:text-sm">
                    {article?.source_info?.name}
                  </h3>
                  <h3 className="text-green-400 font-semibold mb-2 text-xs xsmall:text-sm">
                    Published: {formatPublishDate(article?.published_on)}
                  </h3>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 text-xs xsmall:text-sm"
                  >
                    Read More <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                  <div className=" w-[80vw] xlarge:border-0 border-[1px] mt-5" ></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-10 border-t-[1px] xlarge:-mt-[182vh] xlarge:ml-[2vw] xlarge:w-[95vw]  border-red-400"></div>
    </>
  );
};

const formatPublishDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);

  if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (minutes < 1440) {
    return `${Math.floor(minutes / 60)} hours ago`;
  } else {
    return `${Math.floor(minutes / 1440)} days ago`;
  }
};

export default CoinNewsInDetails;
