import React, { useEffect, useState } from "react";
import copy from "../assets/copy.svg";
import linkIcon from "../assets/link.svg";
import loader from "../assets/loader.svg";
import tick from "../assets/tick.svg";
import { useLazyGetSummaryQuery } from "../services/article.js";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articleFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articleFromLocalStorage) {
      setAllArticles(articleFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticle = [newArticle, ...allArticles];
      setArticle(newArticle);
      setAllArticles(updatedAllArticle);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticle));
    }
  };

  const handleCopy = (copyURl) => {
    setCopied(copyURl);
    navigator.clipboard.writeText(copyURl);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="w-full max-w-xl mt-16">
      <div className="flex flex-col w-full gap-2">
        <form
          action=""
          className="relative flex items-center justify-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link_icon"
            className="absolute left-0 w-5 my-2 ml-3"
          />
          <input
            type="url"
            placeholder="enter a url"
            value={article.url}
            onChange={(e) => {
              setArticle({ ...article, url: e.target.value });
            }}
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            <p>↵</p>
          </button>
        </form>
        <div className="flex flex-col gap-1 overflow-y-auto max-h-60">
          {allArticles.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className="link_card"
            >
              <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copy}
                  alt="copy_icon"
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p className="flex-1 text-sm font-medium text-blue-700 truncate font-satoshi">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center max-w-full my-10">
        {isFetching ? (
          <img
            src={loader}
            alt="loader"
            className="object-contain w-20 h-20s"
          />
        ) : error ? (
          <p className="font-bold text-center text-black font-inter">
            well, gg
            <br />
            <span className="font-normal text-gray-700 font-satoshi">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h1 className="text-xl font-bold">
                Article <span className="blue_gradient"></span>Summary
              </h1>
              <div className="summary_box">
                <p>{article.summary}</p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
