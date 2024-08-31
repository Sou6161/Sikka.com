import React, { useEffect, useState } from "react";

const CryptoNews = () => {
  const [cryptoNews, setCryptoNews] = useState(null);
  const [Crypto5News, setCrypto5News] = useState(null);

  // useEffect(() => {
  //   const fetchCryptoNews = async () => {
  //     const response = await fetch(
  //       "https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=695cd6c649b0429497ecd26612fcea73328264e00c7eaac6580269c9f3bdc667"
  //     );
  //     const cryptoNewsData = await response.json();
  //     console.log(cryptoNewsData);
  //     setCryptoNews(cryptoNewsData);
  //     setCrypto5News(cryptoNewsData.Data.slice(0, 5)); // Get the first 5 articles
  //   };
  //   fetchCryptoNews();
  // }, []);

  return (
    <>
      <div className="mt-10 border-b-[1px] border-red-600 bg-red-200"></div>
      <button id="bottone1" className=" mt-10">
        <strong className=" ">Latest Crypto News</strong>
      </button>
      <div className="mt-10 p-2 h-auto bg-[#1f2937] border-[2px] border-cyan-400 rounded-lg backdrop-blur-md backdrop-filter outline outline-2 outline-yellow-400/50 outline-offset-2">
        {Crypto5News && (
          <ul>
            {Crypto5News.map((article, index) => (
              <li key={index}>
                <img
                  className="w-[90vw] h-[28vh] border-2 border-purple-600 rounded-lg object-center mt-2"
                  src={article.imageurl}
                  alt=""
                />
                <h2 className="mt-5 text-white  font-semibold">
                  {article.title}
                </h2>
                <p className="mt-5 text-amber-400  font-semibold">
                  {article.body.split(" ").slice(0, 20).join(" ")}...
                </p>
                <h1 className=" mt-5 text-green-400 font-semibold">
                  {article?.source_info?.name}
                </h1>
                <h1 className="text-green-400 font-semibold mb-10">
                  Published :{" "}
                  {(() => {
                    const date = new Date(article?.published_on * 1000);
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
                  })()}
                </h1>
              </li>
            ))}
          </ul>
        )}
      </div><div className="mt-10 border-t-[1px] border-red-400 bg-re-200"></div>
    </>
  );
};

export default CryptoNews;
