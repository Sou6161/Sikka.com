import React from "react";
import { Calendar, Clock, User, ChevronRight } from "lucide-react";
import { MdArticle } from "react-icons/md";
import articleData from "../../JsonArticlesData/ResearchArticlesData.json";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import Footer from "../../Footer/Footer";

const AllResearchArticles = () => {
  // Helper function to format relative date
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (seconds < 60) {
      return `Just now`;
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else if (days < 7) {
      return `${days} days ago`;
    } else if (weeks < 4) {
      return `${weeks} weeks ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };
  // Function to extract plain text from HTML
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // Format date helper function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Transform the feed entries into our desired format
  const articles = articleData.feed.entry.map((entry) => ({
    id: entry.id,
    title: entry.title,
    url: entry.url,
    published: entry.published,
    updated: entry.updated,
    author: entry.author,
    summary:
      entry.summary || stripHtml(entry.content?.__text).substring(0, 300),
  }));

  return (
    <>
      <div className=" bg-black">
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className="container mx-auto px-4 py-8 bg-black">
        <button
          id="bottone1"
          className="bg-blue-500 mt-[6vh] 2xlarge:mt-[10vh] ml-[10vw] 2xlarge:ml-[35vw] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <strong className="flex items-center text-black">
            <MdArticle className="w-5 h-5 mr-2 text-black" />
            Latest Crypto Articles
          </strong>
        </button>

        {/* Articles Grid */}
        <div className="grid gap-6 mb-8 mt-5">
          {articles.map((article) => (
            <div
              key={article.id}
              className=" rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
            >
              {/* Header */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  <a
                    href={article.url}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {article.title}
                  </a>
                </h2>
              </div>

              {/* Content */}
              <div>
                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-white mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>
                      Published: {formatRelativeDate(article.updated)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>
                      Updated: {formatRelativeDate(article.published)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>Author: {article.author.name}</span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-amber-400">
                  {article.summary.length > 200
                    ? `${article.summary.substring(0, 200)}...`
                    : article.summary}
                </p>

                {/* Read More Link */}
                <div className="mt-4">
                  <a
                    href={article.url}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read more
                    <ChevronRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default AllResearchArticles;
