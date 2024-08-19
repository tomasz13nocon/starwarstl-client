import Shell from "@layouts/shell";
import c from "./styles/changelog.module.scss";
import dayjs from "dayjs";
import { updates } from "@/changelogData";
// import Markdown from "react-markdown";
// import changelogMd from "./changelog.md?raw";

// TODO: move these to markdown

export default function Changelog() {
  console.log(updates[0].date);
  return (
    <Shell>
      <main className={c.changelog}>
        <h1 className={c.title}>Changelog</h1>

        {updates.map(({ date, title, changelog }, i) => (
          <article className={c.versionSection} key={i}>
            <hgroup className={c.versionHeading}>
              <h2 className={c.versionNumber}>{date ? dayjs(date).local().format("ll") : title}</h2>
            </hgroup>
            {changelog}
          </article>
        ))}
      </main>
    </Shell>
  );
}
