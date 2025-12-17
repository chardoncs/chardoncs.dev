const tamacowchi = {
  COW: {
    idle: `\
^__^
(oo)\\_______
(__)\\       )\\/\\
    ||----w |
    ||     ||`,
    blink: `\
^__^
(--)\\_______
(__)\\       )\\/\\
    ||----w |
    ||     ||`,
    pressed: `\
^__^
(O<)\\_______
(__)\\       )\\/\\
    ||----w |
    ||     ||`,
    turning: `\
___/\\/\\___   
\\        /
/  POOF! \\
\\__    __/
   \\  /
    \\|`,
  },

  BUBBLE_LINE: `\
        \\   
         \\  `,

  LINE_WIDTH: 60,

  BLINK_INTERVAL: 4700,

  CANDIDATE_SENTENCES: [
    "Bun",
    "Crablang",
    "I use Arch btw",
    "Rewrite it in Rust!",
    "iykyk lol",
    "You guys using Java?",
    "You guys using Zig?",
    "All your codebase belong to us.",
    "oh caml my caml",
    "D",
  ],

  TURNING_DICT: {
    Bun: "/images/bun.svg",
    Crablang: "/images/ferris-knife.png",
    D: "/images/dman.png",
  },

  MIRROR_INTERVALS: [500, 300, 200, 100, 50, 30, 30, 30, 30, 30, 10, 10],

  status: "idle",

  sleep(minisec) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), minisec);
    });
  },

  combineBubbleLine(cow) {
    const blLines = this.BUBBLE_LINE.split("\n");
    const cowLines = cow.split("\n");
    const fallbackPad = " ".repeat(blLines[0].length);

    let output = "";

    cowLines.forEach((line, i) => {
      let blLine = blLines[i];
      if (!blLine) {
        blLine = fallbackPad;
      }

      output += `${blLine}${line}\n`;
    });

    return output;
  },

  sprint(status, sentence = undefined) {
    let output = this.COW[status];

    if (sentence !== undefined) {
      const saying = sentence.toString();
      const lines = Math.ceil(saying.length / this.LINE_WIDTH);
      // TODO: softwrap
      const width = Math.min(this.LINE_WIDTH, saying.length);

      // Upper border
      let bubble = ` ${"_".repeat(width + 2)} \n`;
      if (lines > 1) {
        let s, e;
        for (let i = 0; i < lines; i++) {
          switch (i) {
          case 0:
            s = "/";
            e = "\\";
            break;

          case lines - 1:
            s = "\\";
            e = "/";
            break;

          default:
            s = e = "|";
            break;
          }

          bubble += `${s} ${saying.substring(i * this.LINE_WIDTH, (i + 1) * this.LINE_WIDTH)} ${e}\n`;
        }
      } else {
        bubble += `< ${saying} >\n`;
      }
      // Lower border
      bubble += ` ${"-".repeat(width + 2)} \n`;

      output = bubble + this.combineBubbleLine(output);
    }

    return output;
  },

  print(status = undefined) {
    if (status !== undefined) {
      this.status = status;
    }

    this.root.innerText = this.sprint(this.status, this.currentSentence);
  },

  async streamSaying(sentence) {
    this.currentSentence = "";

    for (const word of sentence.split(" ")) {
      if (this.currentSentence === "") {
        this.currentSentence = word;
      } else {
        this.currentSentence += ` ${word}`;
        await this.sleep(300);
      }
      this.print();
    }

    await this.sleep(3000);
    this.currentSentence = undefined;
    this.print();
  },

  startBlinking() {
    this.blinkInterval = setInterval(async () => {
      switch (this.status) {
      case "pressed":
        break;

      default:
        this.print("blink");
        await this.sleep(300);
        this.print("idle");
        break;
      }
    }, this.BLINK_INTERVAL);
  },

  stopBlinking() {
    clearInterval(this.blinkInterval);
    this.blinkInterval = undefined;
    this.print("idle");
  },

  loadPressListeners() {
    this.pressMouseDownListener = this.root.addEventListener("mousedown", () => {
      this.print("pressed");
    });

    this.pressMouseUpListener = this.root.addEventListener("mouseup", () => {
      this.print("idle");
    });

    this.pressTouchStartListener = this.root.addEventListener("touchstart", () => {
      this.print("pressed");
    });

    this.pressTouchEndListener = this.root.addEventListener("touchend", () => {
      this.print("idle");
    });
  },

  cancelPressListeners() {
    this.root.removeEventListener("mousedown", this.pressMouseDownListener);
    this.pressMouseDownListener = undefined;

    this.root.removeEventListener("mouseup", this.pressMouseUpListener);
    this.pressMouseUpListener = undefined;

    this.root.removeEventListener("touchstart", this.pressTouchStartListener);
    this.pressTouchStartListener = undefined;

    this.root.removeEventListener("touchend", this.pressTouchEndListener);
    this.pressTouchEndListener = undefined;
  },

  async turnIntoFigure(magicWord) {
    this.cancelPressListeners();
    this.cancelSayStreaming();

    for (const interval of this.MIRROR_INTERVALS) {
      this.root.style.transform = "scaleX(-1)";
      await this.sleep(interval);
      this.root.style.transform = "";
      await this.sleep(interval);
    }

    this.print("turning");
    // The actual image will be loaded 1 sec before the turn
    this.turnedImg.src = this.TURNING_DICT[magicWord];
    this.turnedImg.alt = magicWord;
    await this.sleep(1000);

    this.root.style.display = "none";
    this.turnedImg.style.display = "";

    await this.sleep(2000);
    this.print("idle");

    this.turnedImg.style.display = "none";
    this.root.style.display = "";

    this.loadSayStreamingListeners();
    this.loadPressListeners();
  },

  loadSayStreamingListeners() {
    // Use lambda, otherwise `this` would be the `say()` function rather
    // than the `tamacowchi` global object
    const say = async () => {
      if (this.currentSentence === undefined) {
        const sentence = this.CANDIDATE_SENTENCES[Math.floor(Math.random() * this.CANDIDATE_SENTENCES.length)];
        await this.streamSaying(sentence);

        if (this.TURNING_DICT[sentence]) {
          this.stopBlinking();
          this.turnIntoFigure(sentence);
          this.startBlinking();
        }
      }
    };

    this.hoverToSayListener = this.root.addEventListener("mouseover", say);
    this.touchToSayListener = this.root.addEventListener("touchstart", say);
  },

  cancelSayStreaming() {
    this.root.removeEventListener("mouseover", this.hoverToSayListener);
    this.hoverToSayListener = undefined;

    this.root.removeEventListener("touchstart", this.touchToSayListener);
    this.touchToSayListener = undefined;
  },

  start() {
    this.print();
    this.startBlinking();
    this.loadPressListeners();
    this.loadSayStreamingListeners();
  },

  initTamacowchiBox() {
    const container = document.getElementById("tamacowchi");
    container.innerHTML = `
      <pre class="tamacowchi-text-root"><code></code></pre>
      <img class="turned-img" src="" alt="" style="display: none;" />
    `;

    this.root = container.querySelector(".tamacowchi-text-root");
    this.turnedImg = container.querySelector(".turned-img");
  },
};
