import React from "react";
import { NavLink } from "react-router-dom";
import { API } from "./common";
import "./styles/landing.scss";
import "./styles/timeline.scss";
import TimelineRowDetails from "./timelineRowDetails";
import Faq from "./faq";
import { Icon } from "@mdi/react";
import { mdiArrowDown, mdiDiceMultipleOutline, mdiVolumeHigh } from '@mdi/js';
import Error from "./error";

export default function Landing(p) {
  const [randomItem, setRandomItem] = React.useState({});
  const [randomItemState, setRandomItemState] = React.useState({ state: "fetching" });
  const landingPageContentRef = React.useRef();

  const fetchRandomItem = async () => {
    setRandomItemState({ state: "fetching" });
    let data;
    try {
      let res = await fetch(API + "media-random");
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      data = await res.json();
    }
    catch (e) {
      setRandomItemState({ state: "error", error: e.message });
      return;
    }

    setRandomItem(data);
    setRandomItemState({ state: "ok" });
  };

  React.useEffect(async () => {
    await fetchRandomItem();
  }, []);

  return (
    <main className="landing-page">
      <div className="hero-container">
        <div className="bg1"></div>
        <div className="hero">
          <div>{/* needed for alignment */}
            <h1>Star Wars media timeline</h1>
            <div className="cta">
              <NavLink to="/timeline" className="btn">See Timeline</NavLink>
    <button className="btn-secondary" onClick={() => window.scrollTo({ top: landingPageContentRef.current?.getBoundingClientRect().top + window.pageYOffset - 30, behavior: "smooth" })}>Learn more</button>
            </div>
          </div>
        </div>
        <div className="random">
          <div>{/* needed for alignment */}
            {/* <h2 className="random-title">Random media</h2> */}
            <button className={`reroll-btn ${randomItemState.state === "fetching" ? "fetching" : ""}`} onClick={fetchRandomItem}><Icon path={mdiDiceMultipleOutline} size={1.5} className="icon" /><span>Reroll</span></button>
            {randomItemState.state === "error" ?
              <Error details={randomItemState.error} />
              :
              <TimelineRowDetails item={randomItem} setFullCover={p.setFullCover} />
          }
          </div>
        </div>
        <div className="bg2"></div>
      </div>

      <div className="landing-page-content" ref={landingPageContentRef}>
        <div className="features">
          <div className="feature">
            <div className="one">
              <p>Timeline order sourced from Wookieepedia</p>
            </div>
    <Icon path={mdiArrowDown} className="icon" />
            <div className="two">
              <p>Community-decided order instead of one person’s opinionated timeline</p>
            </div>
          </div>
          <div className="feature">
            <div className="one">
              <p>All data automatically fetched</p>
            </div>
    <Icon path={mdiArrowDown} className="icon" />
            <div className="two">
              <p>Timeline stays up to date and won’t get abandoned</p>
            </div>
          </div>
          <div className="feature">
            <div className="one">
              <p>Fast dynamic table made with modern technology</p>
            </div>
    <Icon path={mdiArrowDown} className="icon" />
            <div className="two">
              <p>Get exactly what you’re looking for, blazingly fast</p>
            </div>
          </div>
        </div>

      <Faq />
      </div>
    </main>
  );
}
