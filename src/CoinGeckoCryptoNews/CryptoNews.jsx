import React, { useEffect, useState } from "react";

const CryptoNews = () => {
  const [cryptoNews, setCryptoNews] = useState(null);

//   useEffect(() => {
//     const fetchCryptoNews = async () => {
//       const response = await fetch("https://newsapi.org/v2/everything?q=crypto&from=2024-08-28&to=2024-08-28&sortBy=popularity&apiKey=fbecde2b44f445b4b1fa9f89ae474dd3");
//       const cryptoNewsData = await response.json();
//       console.log(cryptoNewsData);
//       setCryptoNews(cryptoNewsData);
//     };
//     fetchCryptoNews();
//   }, []);


  useEffect(()=>{
    const fetchCryptoNewstest = async () => {
        const response = await fetch("https://gnews.io/api/v4/search?q=crypto&lang=en&country=us&max=10&apikey=495c586fb6860dbee66aaa1af7f8488c");
        const cryptoNewsDatatest = await response.json();
        console.log(cryptoNewsDatatest);
      };
      fetchCryptoNewstest();
  },[])

  return (
    <>
      <div className="mt-10 border-b-[1px] border-red-600 bg-red-200"></div>
      <div className="mt-5 w-[90vw] h-[100vh] bg-yellow-200">
        Latest Crypto News
        {cryptoNews && (
          <ul>
            {cryptoNews.articles.map((article, index) => (
              <li key={index}>
                <img src={article?.urlToImage} alt="" />
                <h2>{article.title}</h2>
                <p>{article.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default CryptoNews;