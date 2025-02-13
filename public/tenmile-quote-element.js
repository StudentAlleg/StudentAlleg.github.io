import { GameBoyElement } from "./game-boy-element.js";

/* global UPNG msgpack5 JSZip */

export class TenmileQuoteElement extends GameBoyElement {
  constructor() {
    super();
    this.setAttribute("title", this.innerHTML);
    this._setupQuote();
  }

  async _setupQuote() {
    const gb = this;
    const src = this.getAttribute("src");

    // Based on in https://tenmile.quote.games/js/quotes.js

    const BORDER_SIZE = 12;
    const SAVESTATE_FRAMEBUFFER = 71;

    const response = await fetch(src);
    const buffer = await response.arrayBuffer();
    const rgba = new Uint8Array(UPNG.toRGBA8(UPNG.decode(buffer))[0]);

    const decodedBytes = [];

    for (let i = 0; i < rgba.length / 4; i++) {
      let byte =
        ((rgba[4 * i + 0] & 0x3) << 6) +
        ((rgba[4 * i + 1] & 0x3) << 4) +
        ((rgba[4 * i + 2] & 0x3) << 2) +
        ((rgba[4 * i + 3] & 0x3) << 0);
      decodedBytes.push(byte);
    }

    const zip = await JSZip.loadAsync(new Uint8Array(decodedBytes));

    const rom = await zip.file("ROM.bin").async("uint8array");
    const mask = await zip.file("ROM.mask").async("uint8array");

    const initialState = msgpack5().decode(
      await zip.file("initialState.msgpack").async("uint8array")
    );

    // hacks!
    //  - the [SAVESTATE_FRAMEBUFFER] entry should be recovered from the quote image
    //  - the intended data for [0] isn't present in the quote,but we could approximate
    //    it from the quote image data
    initialState[SAVESTATE_FRAMEBUFFER] = null;
    initialState[0] = Array.from(new Uint8Array(160 * 144 * 4).fill(255));

    const actions = msgpack5().decode(
      await zip.file("actions.msgpack").async("uint8array")
    );

    const buttonNames = [
      "right",
      "left",
      "up",
      "down",
      "a",
      "b",
      "select",
      "start",
    ];
    
    const inputSequence = actions.map((action) => {
      let step = {};
      for (let [i, direction] of action) {
        let kind = direction ? "press" : "release";
        if (!step[kind]) {
          step[kind] = [];
        }
        step[kind].push(buttonNames[i]);
      }
      return step;
    });

    const romSrc = URL.createObjectURL(new Blob([rom]));
    const maskSrc = URL.createObjectURL(new Blob([mask]));
    const initialStateSrc = URL.createObjectURL(
      new Blob([JSON.stringify(initialState)], { type: "application/json" })
    );
    const inputSequenceSrc = URL.createObjectURL(
      new Blob([JSON.stringify(inputSequence)], { type: "application/json" })
    );

    gb.setAttribute("romsrc", romSrc);
    gb.setAttribute("masksrc", maskSrc);
    gb.setAttribute("initialstatesrc", initialStateSrc);
    gb.setAttribute("inputsequencesrc", inputSequenceSrc);
  }
}

customElements.define("tenmile-quote", TenmileQuoteElement);
