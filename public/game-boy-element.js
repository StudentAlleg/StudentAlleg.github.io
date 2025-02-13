import { GameBoyCore } from "./gameboy-0.2.0.js";
import { XAudioServer } from "./XAudioServer-899c314.js";
window.debug = function () {};

function gunzipIfNecessary(response) {
  if (response.headers.get("content-type") == "application/x-gzip") {
    return new Response(
      /* global DecompressionStream */
      response.body.pipeThrough(new DecompressionStream("gzip"))
    );
  } else {
    return response;
  }
}

export class GameBoyElement extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "closed" });

    const style = document.createElement("style");
    style.innerText = `
      canvas { background-color: black; }
      .paused { filter: grayscale(80%); }
      .controlButton { cursor: pointer; }
      .pressed { color: greenyellow; }
      div {
        color: gray;
        background-color: black;
        text-align: center;
        user-select: none;
      }
    `;

    shadowRoot.append(style);

    this.setAttribute("width", this.getAttribute("width") || 160);
    this.setAttribute(
      "height",
      this.getAttribute("height") ||
        (144 / 160) * parseInt(this.getAttribute("width"))
    );

    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("tabindex", "1");
    this.canvas.width = this.getAttribute("width");
    this.canvas.height = this.getAttribute("height");

    shadowRoot.append(this.canvas);

    this.playing = false;
    this.canvas.classList.add("paused");

    const EMULATOR_LOOP_INTERVAL = 8;
    this.runInterval = setInterval(() => {
      if (this.playing) {
        this._runOneStep();
      }
    }, EMULATOR_LOOP_INTERVAL);

    if (this.hasAttribute("controls")) {
      shadowRoot.append(this._buildControls(shadowRoot));
    }

    this.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "KeyR":
          this.reset();
          break;
        case "KeyK":
          this._togglePlaying();
          break;
        case "KeyF":
          this._toggleFullscreen();
          break;
        case "KeyQ":
          if (this.stashedInputSequence) {
            this.inputSequence = this.stashedInputSequence;
            this.stashedInputSequence = null;
            this.reset();
          } else {
            if (this.inputSequence) {
              this.stashedInputSequence = this.inputSequence;
              this.inputSequence = null;
            }
          }
          break;
        case "Period":
          if (!this.playing) {
            this._runOneStep();
          }
          break;
      }
    });

    this.canvas.addEventListener("dblclick", () => this._toggleFullscreen());
    this.canvas.addEventListener("click", () => this._togglePlaying());

    this.keyToButton = {
      ArrowRight: "right",
      ArrowLeft: "left",
      ArrowUp: "up",
      ArrowDown: "down",
      x: "a",
      z: "b",
      Shift: "select",
      Enter: "start",
    };

    this.buttonToKeycode = {
      right: 0,
      left: 1,
      up: 2,
      down: 3,
      a: 4,
      b: 5,
      select: 6,
      start: 7,
    };

    const handleButtonKey = (event) => {
      const key = event.key;
      if (key in this.keyToButton) {
        event.preventDefault();
        const button = this.keyToButton[key];
        const type =
          event.type == "keydown"
            ? "game-boy-button-down"
            : "game-boy-button-up";
        this.dispatchEvent(new CustomEvent(type, { detail: button }));
      }
    };

    const handleGbButton = (event) => {
      if (this.emulator) {
        if (!this.playing) {
          this.play();
        }
        this.emulator.JoyPadEvent(
          this.buttonToKeycode[event.detail],
          event.type == "game-boy-button-down"
        );
      }
    };

    this.addEventListener("game-boy-button-down", handleGbButton);
    this.addEventListener("game-boy-button-up", handleGbButton);

    this.addEventListener("keydown", handleButtonKey);
    this.addEventListener("keyup", handleButtonKey);

    this.addEventListener("game-boy-rom-loaded", (e) => {
      this._setupEmulator();
    });

    shadowRoot.host.style.display = "block";
    shadowRoot.host.style.width = this.getAttribute("width") + "px";

    if (this.hasAttribute("defaultscenario")) {
      const name = this.getAttribute("defaultscenario");
      const scenario = this.querySelector(`game-boy-scenario[name=${name}`);
      this.loadInitialState(scenario.getAttribute("src"));
    }

    if (this.hasAttribute("defaultinputsequence")) {
      const name = this.getAttribute("defaultinputsequence");
      const inputSequence = this.querySelector(
        `game-boy-input-sequence[name=${name}`
      );
      this.loadInputSequence(inputSequence.getAttribute("src"));
    }

    if (this.hasAttribute("loop")) {
      this.addEventListener("game-boy-input-sequence-complete", this.reset);
    }

    if (!this.hasAttribute("ignoreoob")) {
      this.addEventListener("game-boy-out-of-bounds", this.reset);
    }
  }

  _runOneStep() {
    if (this.emulator) {
      if (this.inputSequence && this.iteration < this.inputSequence.length) {
        const input = this.inputSequence[this.iteration];
        for (let button of input.press || []) {
          this.dispatchEvent(
            new CustomEvent("game-boy-button-down", { detail: button })
          );
        }
        for (let button of input.release || []) {
          this.dispatchEvent(
            new CustomEvent("game-boy-button-up", { detail: button })
          );
        }
        this.dispatchEvent(
          new CustomEvent("game-boy-input-sequence-action", {
            detail: input,
          })
        );
      }
      this.emulator.run();
      this.iteration += 1;
      this.dispatchEvent(
        new CustomEvent("game-boy-run", {
          detail: this.iteration,
        })
      );
      if (this.inputSequence && this.inputSequence.length == this.iteration) {
        this.dispatchEvent(new Event("game-boy-input-sequence-complete"));
      }
    }
  }

  _buildControls() {
    const controlBar = document.createElement("div");
    controlBar.addEventListener("click", () => this.canvas.focus());

    const buttonSpecs = [
      ["left", "◀"],
      ["up", "▲"],
      ["down", "▼"],
      ["right", "▶"],
      ["select", "■"],
      ["start", "■"],
      ["a", "●"],
      ["b", "●"],
    ];

    for (let [name, glyph] of buttonSpecs) {
      const elem = document.createElement("span");
      elem.innerText = glyph;
      elem.classList.add("controlButton");
      elem.title = name;
      elem.addEventListener("pointerdown", () => {
        this.dispatchEvent(
          new CustomEvent("game-boy-button-down", { detail: name })
        );
      });
      this.addEventListener("game-boy-button-down", (e) => {
        if (e.detail == name) {
          elem.classList.add("pressed");
        }
      });
      elem.addEventListener("pointerup", () => {
        this.dispatchEvent(
          new CustomEvent("game-boy-button-up", { detail: name })
        );
      });
      this.addEventListener("game-boy-button-up", (e) => {
        if (e.detail == name) {
          elem.classList.remove("pressed");
        }
      });
      controlBar.append(elem);
    }

    const fullscreen = document.createElement("span");
    fullscreen.innerText = " ⛶ ";
    fullscreen.addEventListener("click", () => this._toggleFullscreen());
    controlBar.append(fullscreen);

    return controlBar;
  }

  _setupEmulator() {
    this.emulator = GameBoyCore(this.canvas, this.rom, { sound: XAudioServer });
    this.emulator.stopEmulator = 1;
    this.emulator.start();
    this.iteration = 0;
    if (this.initialState) {
      this.restoreState(this.initialState);
    }
    const proxyROM = new Proxy(this.emulator.ROM, {
      get: (memory, addr) => {
        if (this.mask[addr] == 0) {
          this.dispatchEvent(
            new CustomEvent("game-boy-out-of-bounds", { detail: addr })
          );
        }
        return memory[addr];
      },
    });
    this.emulator.ROM = proxyROM;
    if (this.hasAttribute("autoplay")) {
      this.play();
    } else {
      this._runOneStep();
    }
  }

  _toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.canvas.requestFullscreen().then(() => this.canvas.focus());
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  _togglePlaying() {
    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  static get observedAttributes() {
    return ["romsrc", "masksrc", "initialstatesrc", "inputsequencesrc"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    //overkill (should really only reload what's changed)
    if (this.hasAttribute("romsrc")) {
      this.loadRom(this.getAttribute("romsrc"), this.getAttribute("masksrc"));
    }

    if (this.hasAttribute("initialstatesrc")) {
      this.loadInitialState(this.getAttribute("initialstatesrc"));
    }

    if (this.hasAttribute("inputsequencesrc")) {
      this.loadInputSequence(this.getAttribute("inputsequencesrc"));
    }
  }

  // Public API

  play() {
    this.playing = true;
    this.canvas.classList.remove("paused");
  }

  pause() {
    this.playing = false;
    this.canvas.classList.add("paused");
  }

  reset() {
    this._setupEmulator();
  }

  async loadRom(romSrc, maskSrc) {
    this.rom = new Uint8Array(
      await gunzipIfNecessary(await fetch(romSrc)).arrayBuffer()
    );
    if (maskSrc) {
      this.mask = new Uint8Array(
        await gunzipIfNecessary(await fetch(maskSrc)).arrayBuffer()
      );
    } else {
      this.mask = new Uint8Array(this.rom.length).fill(1);
    }
    this.dispatchEvent(new Event("game-boy-rom-loaded"));
  }

  async loadInitialState(initialStateSrc) {
    const response = await fetch(initialStateSrc);
    this.initialState = await gunzipIfNecessary(response).json();
    this.reset();
  }

  async loadInputSequence(inputSequenceSrc) {
    const response = await fetch(inputSequenceSrc);
    this.inputSequence = await gunzipIfNecessary(response).json();
    this.reset();
  }

  saveState() {
    if (this.emulator) {
      const patchedState = this.emulator.saveState();
      patchedState[0] = Array.from(this.emulator.canvasBuffer.data); // replace ROM with canvas pixels
      return patchedState;
    }
  }

  restoreState(patchedState) {
    if (this.emulator && patchedState) {
      const state = patchedState.slice();
      const screenshotData = state[0];
      state[0] = this.emulator.ROM; // restore ROM data
      this.emulator.returnFromState(state);
      this.emulator.canvasBuffer.data.set(screenshotData); // restore canvas pixels
      this.emulator.graphicsBlit();
    }
  }
}

customElements.define("game-boy", GameBoyElement);
