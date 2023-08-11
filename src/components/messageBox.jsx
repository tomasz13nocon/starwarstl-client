import c from "./styles/messageImg.module.scss";

const imgs = {
  jediTexts: {
    src: "/img/The_original_Jedi_texts.webp",
    alt: "sacred jedi texts",
  },
  yoda: {
    src: "/img/yoda.webp",
    alt: "yoda in palpatine's office",
  },
  void: {
    src: "/img/TheVoid.webp",
    alt: "The Void on Abafar from D-squad Clone Wars arc",
  },
};

export default function MessageBox({ img, children }) {
  return (
    <div className={c.msgContainer} style={{ width: "100%" }}>
      {img && <img src={imgs[img].src} alt={imgs[img].alt} />}
      <div className={c.msgText}>{children}</div>
      {/* <div className="spinner-text">Reaching out to the force...</div> */}
    </div>
  );
}
