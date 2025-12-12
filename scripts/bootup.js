const bootup = {
  CMD: "whoami",
  ALT_CMD: "sudo rm -rf /",

  inputEl: document.getElementById("cli-input"),
  container: document.querySelector(".main-container"),
  cursor: document.getElementById("cli-cursor"),

  // Cache the default display style
  containerDisplay: undefined,

  sleep(minisec) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), minisec);
    });
  },

  async typeIn(line, interval) {
    for (const ch of line) {
      if (this.inputEl.innerText !== "") {
        await this.sleep(interval);
      }

      this.inputEl.innerText += ch;
    }
  },

  async backspace(times, interval) {
    for (let i = 0; i < times && this.inputEl.innerText.length > 0; i++) {
      if (i > 0) {
        await this.sleep(interval);
      }

      this.inputEl.innerText = this.inputEl.innerText.slice(0, this.inputEl.innerText.length - 1);
    }
  },

  async exec() {
    this.cursor.style.display = "block";
    await this.sleep(100);
    this.cursor.style.display = "none";
  },

  async play() {
    if (Math.random() < 0.1) {
      await this.sleep(200);
      await this.typeIn(this.ALT_CMD, 50);
      await this.sleep(200);
      await this.backspace(this.ALT_CMD.length, 30);
    }

    await this.sleep(200);
    await this.typeIn(this.CMD, 50);

    await this.exec();

    this.container.style.display = this.containerDisplay;
  },

  reset() {
    this.inputEl.innerText = "";

    this.containerDisplay = this.container.style.display;
    this.container.style.display = "none";

    this.cursor.style.display = "inline";
  },
};
