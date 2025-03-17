const suggestionColors = document.querySelectorAll(".suggestion > div");

function suggest() {
  const board = [];
  document.querySelectorAll(".rows > div").forEach((row) => {
    const sequence = [...row.querySelectorAll(".colors > div")].map(
      (div) => div.className
    );
    const [red, white] = [...row.querySelectorAll(".pins > input")].map(
      (input) => parseInt(input.value, 10)
    );
    board.push([...sequence, red, white]);
  });
  const suggestion = nextBestGuess(board);
  if (suggestion) {
    suggestionColors.forEach((div, index) => {
      div.className = suggestion[index];
    });
  }
}

function handleClickColor({ target }) {
  target.parentNode.className = target.className;
  suggest();
}

function handleClickPin({ target }) {
  target.select();
}

function handleKeyup({ target }) {
  let value = target.value.replace(/[^0-4]/g, "");
  value = parseInt(value[value.length - 1], 0);
  if (isNaN(value)) {
    value = 0;
  }
  target.value = value;
  const bothPins = [...target.parentNode.querySelectorAll("input")];
  const pinsSum = bothPins.reduce(
    (sum, { value }) => sum + parseInt(value, 10),
    0
  );
  if (pinsSum > 4) {
    const otherPin = bothPins.filter((pin) => pin !== target)[0];
    otherPin.value -= pinsSum - 4;
  }
  suggest();
}

function removeRow({ target }) {
  const row = target.parentNode.parentNode;
  row.remove();
  const remainingRows = document.querySelectorAll(".rows > div");
  if (remainingRows.length === 1) {
    remainingRows[0].querySelector(
      ".controls > button:first-child"
    ).disabled = true;
  }
  suggest();
}

function addRow({ target }) {
  const rowAddingFrom = target.parentNode.parentNode;
  const newRow = rowAddingFrom.cloneNode(true);
  rowAddingFrom.after(newRow);
  document.querySelectorAll("button:disabled").forEach((button) => {
    button.disabled = false;
  });
  registerRowEventHandlers(newRow);
  suggest();
}

function registerRowEventHandlers(row) {
  row.querySelectorAll(".colors > div > div").forEach((div) => {
    div.addEventListener("click", handleClickColor);
  });
  row.querySelectorAll(".pins > input").forEach((input) => {
    input.addEventListener("click", handleClickPin);
    input.addEventListener("keyup", handleKeyup);
  });
  row.querySelectorAll(".controls > button").forEach((button, index) => {
    if (index === 0) {
      button.addEventListener("click", removeRow);
    } else {
      button.addEventListener("click", addRow);
    }
  });
}

registerRowEventHandlers(document.querySelector(".rows > div"));
