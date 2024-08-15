import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { mdiArrowDown } from "@mdi/js";
import Faq from "./faq";
import Showcase from "./showcase";
import c from "./styles/home.module.scss";
import Icon from "@components/icon";
import clsx from "clsx";
import { useFetch } from "@hooks/useFetch";
import { fetchHelper } from "@/util";
import Ellipsis from "@components/ellipsis";
import Alert from "@components/alert";
import dayjs from "dayjs";
import Tooltip from "@components/tooltip";
import Spinner from "@components/spinner";
import WookieeLink from "@components/wookieeLink";

const stopAndPlay = (audioEl) => {
  if (audioEl) {
    audioEl.pause();
    audioEl.currentTime = 0;
    audioEl.play();
  }
};

export default function Home() {
  const landingPageContentRef = React.useRef();
  // mask for fun
  const [lightsaber, setLightsaber] = React.useState(0b1111);
  const audioOn = React.useRef();
  const audioOff = React.useRef();

  React.useEffect(() => {
    audioOn.current.volume = 0.4;
  }, []);
  React.useEffect(() => {
    audioOff.current.volume = 0.4;
  }, []);

  return (
    <main className={c.landingPage}>
      <div className={c.heroContainer}>
        <div className={c.bg1}></div>
        <div className={c.hero}>
          <div>
            {/* needed for alignment */}
            <h1>Star Wars media timeline</h1>
            <div className={c.cta}>
              <NavLink to="/timeline" className={c.ctaBtn}>
                See Timeline
              </NavLink>
              <button
                className={c.ctaBtnSecondary}
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
        <div className={c.metaContainer}>
          <MetaInfo />
        </div>
        <div className={c.bg2}></div>
      </div>

      <div className={c.landingPageContent} ref={landingPageContentRef}>
        <div className={c.features}>
          <div className={c.feature}>
            <div className={c.one}>
              <p>Timeline order sourced from Wookieepedia</p>
            </div>
            <Icon path={mdiArrowDown} />
            <div className={c.two}>
              <p>Community-decided order instead of one person’s opinionated timeline</p>
            </div>
          </div>
          <div className={c.feature}>
            <div className={c.one}>
              <p>All data automatically fetched</p>
            </div>
            <Icon path={mdiArrowDown} />
            <div className={c.two}>
              <p>Timeline stays up to date and won’t get abandoned</p>
            </div>
          </div>
          <div className={c.feature}>
            <div className={c.one}>
              <p>Fast dynamic table made with modern technology</p>
            </div>
            <Icon path={mdiArrowDown} />
            <div className={c.two}>
              <p>Get exactly what you’re looking for, blazingly fast</p>
            </div>
          </div>
        </div>

        <div className={c.lightsaberContainer}>
          <img
            onClick={() => {
              setLightsaber(lightsaber ^ 0b1000);
              if (lightsaber & 0b1000) stopAndPlay(audioOff.current);
              else stopAndPlay(audioOn.current);
            }}
            className={c.handle}
            width="183"
            src="/img/Lightsaber_anakin_rots.webp"
            alt="Anakin's lightsaber handle"
          />
          <div className={clsx(c.lightsaber, c.anakin, lightsaber & 0b1000 || c.unignited)}></div>
        </div>

        <Showcase />

        <div className={c.lightsaberContainer}>
          <img
            onClick={() => {
              setLightsaber(lightsaber ^ 0b0100);
              if (lightsaber & 0b0100) stopAndPlay(audioOff.current);
              else stopAndPlay(audioOn.current);
            }}
            className={c.handle}
            width="183"
            src="/img/LukeROTJsaber-MR.webp"
            alt="Luke's lightsaber handle"
          />
          <div className={clsx(c.lightsaber, c.luke, lightsaber & 0b0100 || c.unignited)}></div>
        </div>

        <Faq />
      </div>
      <audio ref={audioOn} src="/sfx/on.mp3" />
      <audio ref={audioOff} src="/sfx/off.mp3" />
    </main>
  );
}

function MetaInfo() {
  const [info, setInfo] = useState();
  const [_, fetching, alert] = useFetch(
    async () => {
      let res = await fetchHelper("/meta");
      setInfo(res);
    },
    { onMount: true },
  );

  if (alert) return <Alert alert={alert} />;

  const updatedAgo = dayjs(info?.dataUpdatedAt).fromNow();
  const updatedTime = dayjs(info?.dataUpdatedAt).local().format("lll"); //"ddd, D MMM YYYY HH:mm");

  return (
    <>
      <div className={c.metaInfo}>
        {fetching ? (
          <Spinner />
        ) : (
          <>
            <div className={c.section}>
              <span>Timeline last updated: </span>
              <span className={c.bold}>
                {updatedAgo}
                <Tooltip>{updatedTime}</Tooltip>
              </span>
            </div>
            <div className={c.section}>
              The timeline has <span className={c.bold}>{info.mediaCount}</span> canon media entries
              featuring <span className={c.bold}>{info.characterCount}</span> unique characters like{" "}
              <WookieeLink title={info.randomCharacter}>
                <span className={c.bold}>{info.randomCharacter}</span>
              </WookieeLink>
              .
            </div>
          </>
        )}
      </div>
    </>
  );
}
