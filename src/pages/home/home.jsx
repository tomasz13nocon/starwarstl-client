import React from "react";
import { NavLink } from "react-router-dom";
import { mdiArrowDown, mdiDiceMultipleOutline } from "@mdi/js";
import { Icon } from "@mdi/react";
import RowDetails from "@components/rowDetails/rowDetails";
import Error from "@components/error";
import { API } from "@/util";
import Faq from "./faq";
import Showcase from "./showcase";
import "./styles/home.scss";

const stopAndPlay = (audioEl) => {
  if (audioEl) {
    audioEl.pause();
    audioEl.currentTime = 0;
    audioEl.play();
  }
};

export default function Home(p) {
  const [randomItem, setRandomItem] = React.useState({});
  const [randomItemState, setRandomItemState] = React.useState({ state: "fetching" });
  const landingPageContentRef = React.useRef();
  // mask for fun
  const [lightsaber, setLightsaber] = React.useState(0b1111);
  const audioOn = React.useRef();
  const audioOff = React.useRef();

  const fetchRandomItem = async () => {
    setRandomItemState({ state: "fetching" });
    let data;
    try {
      let res = await fetch(API + "media-random");
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      data = await res.json();
    } catch (e) {
      setRandomItemState({ state: "error", error: e.message });
      return;
    }

    setRandomItem(data);
    setRandomItemState({ state: "ok" });
  };

  React.useEffect(async () => {
    await fetchRandomItem();
  }, []);

  // I'm a nice guy, therefore I won't blow people's eardrums off.
  React.useEffect(() => {
    audioOn.current.volume = 0.4;
  }, []);
  React.useEffect(() => {
    audioOff.current.volume = 0.4;
  }, []);

  return (
    <main className="landing-page">
      <div className="hero-container">
        <div className="bg1"></div>
        <div className="hero">
          <div>
            {/* needed for alignment */}
            <h1>Star Wars media timeline</h1>
            <div className="cta">
              <NavLink to="/timeline" className="cta-btn">
                See Timeline
              </NavLink>
              <button
                className="cta-btn-secondary"
                onClick={() =>
                  window.scrollTo({
                    top:
                      landingPageContentRef.current?.getBoundingClientRect().top +
                      window.pageYOffset -
                      30,
                    behavior: "smooth",
                  })
                }
              >
                Learn more
              </button>
            </div>
          </div>
        </div>
        <div className="random">
          <div>
            {/* needed for alignment */}
            <button
              className={`reroll-btn ${randomItemState.state === "fetching" ? "fetching" : ""}`}
              onClick={fetchRandomItem}
            >
              <Icon path={mdiDiceMultipleOutline} size={1.5} className="icon" />
              <span>Reroll</span>
            </button>
            {randomItemState.state === "error" ? (
              <Error details={randomItemState.error} />
            ) : (
              <RowDetails
                item={randomItem}
                setFullCover={p.setFullCover}
                dataState={randomItemState.state === "fetching" ? "fetchingDetails" : "ok"}
              />
            )}
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

        <div className="lightsaber-container">
          <img
            onClick={() => {
              setLightsaber(lightsaber ^ 0b1000);
              if (lightsaber & 0b1000) stopAndPlay(audioOff.current);
              else stopAndPlay(audioOn.current);
            }}
            className="handle"
            width="183"
            src="/img/Lightsaber_anakin_rots.webp"
            alt="Anakin's lightsaber handle"
          />
          <div className={`lightsaber anakin ${lightsaber & 0b1000 ? "" : "unignited"}`}></div>
        </div>

        <Showcase />

        <div className="lightsaber-container">
          <img
            onClick={() => {
              setLightsaber(lightsaber ^ 0b0100);
              if (lightsaber & 0b0100) stopAndPlay(audioOff.current);
              else stopAndPlay(audioOn.current);
            }}
            className="handle"
            width="183"
            src="/img/LukeROTJsaber-MR.webp"
            alt="Luke's lightsaber handle"
          />
          <div className={`lightsaber luke ${lightsaber & 0b0100 ? "" : "unignited"}`}></div>
        </div>

        <Faq />
      </div>
      <audio ref={audioOn} src="/sfx/on.mp3" />
      <audio ref={audioOff} src="/sfx/off.mp3" />
    </main>
  );
}
