const tamacowchi = {
  COW: {
    idle: `
  ^__^
  (oo)\\_______
  (__)\\       )\\/\\
      ||----w |
      ||     ||`,
    blink: `
  ^__^
  (--)\\_______
  (__)\\       )\\/\\
      ||----w |
      ||     ||`,
    pressed: `
  ^__^
  (O<)\\_______
  (__)\\       )\\/\\
      ||----w |
      ||     ||`,
  },
  BUBBLE_LINE: `
  \\   
   \\  `,

  LINE_WIDTH: 60,

  sleep(minisec) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), minisec);
    });
  },

  sprint(sentence, status = "idle") {
    const output = "";

    const cow = this.COW[status];

    if (sentence) {
      const saying = sentence.toString();
      const lines = Math.ceil(saying.length / LINE_WIDTH);
      // TODO: softwrap
    }

    return output;
  },

  async *streamSaying(sentence) {
    const output = "";

    for (const word of sentence.split(" ")) {
      if (output === "") {
        output = word;
      } else {
        output += ` ${word}`;
        await sleep(500);
      }
      yield this.sprint(output);
    }
  },

  initTamacowchiBox() {
    const container = document.getElementById("tamacowchi");
    container.innerHTML = `
      <pre class="tamacowchi-text-root">
        <code></code>
      </pre>
    `;
  },
};

tamacowchi.initTamacowchiBox();
