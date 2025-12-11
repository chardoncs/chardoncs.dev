const COW = {
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
};

const BUBBLE_LINE = `
\\   
 \\  `;

const LINE_WIDTH = 60;

function sleep(minisec) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), minisec);
  });
}

function sprintCowsay(sentence, status = "idle") {
  const output = "";

  const cow = COW[status];

  if (sentence) {
    const saying = sentence.toString();
    const lines = Math.ceil(saying.length / LINE_WIDTH);
    // TODO: softwrap
  }

  return output;
}

async function *streamSaying(sentence) {
  const output = "";

  for (const word of sentence.split(" ")) {
    if (output === "") {
      output = word;
    } else {
      output += ` ${word}`;
      await sleep(500);
    }
    yield sprintCowsay(output);
  }
}

function initTamacowchiBox() {
  const container = document.getElementById("tamacowchi");
  container.innerHTML = `
    <pre class="tamacowchi-text-root">
      <code></code>
    </pre>
  `;
}

initTamacowchiBox();
