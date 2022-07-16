import React from "react";

/**
 * Wraps a link to wookieepedia around its contents.
 * If title is not specified "children" will be used as title.
 * @param {string} props.title Exact title of the wookieepedia article
 * @param {boolean} [props.legends=false] Wheter to link to the legends version of the article
 * 	(only for media that has a legends entry!)
 * @returns null if `title` is absent **and** `children` is not string
 */
export default React.memo(function WookieeLink({
  title,
  legends = false,
  children,
}) {
  if (title === undefined) {
    if (typeof children !== "string") {
      //console.error("If title is not present the contents need to be a string!");
      return null;
    }
    title = children;
  }
  let linkTitle = title.replace(" ", "_");
  return (
    <>
      {children}
      <a
        href={
          "https://starwars.fandom.com/wiki/" +
          encodeURIComponent(linkTitle) +
          (legends ? "/legends" : "")
        }
        target="_blank"
        className="wookiee-link"
        title="See on Wookieepedia"
      >
        <img src="Wiki-shrinkable.png" alt="wookieepedia icon" />
      </a>
    </>
  );
});
