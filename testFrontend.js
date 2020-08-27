async function getMessages(myUsername, friendUsername, page) {
  const url = `http://localhost/getMessages?from=${myUsername}&to=${friendUsername}&page=${page}`;
  let response = await fetch(url);
  return await response.json();
}

let page = 1;
let myUsername = "corx";
let isFirst = true;
let isFinish = false;
let directMessage = document.getElementById("directMessage");

getMessages("corx", "sukru1", page).then((messages) => drawMessages(messages));

function drawMessages(messages) {
  if (messages[0] === undefined) isFinish = true;
  messages.forEach((item) => {
    directMessage.insertAdjacentHTML(
      "afterbegin",
      `<div class="message ${myUsername == item.from ? "right" : ""}">
            ${item.content}
        </div>`
    );
  });
  scrollSet();
}

function scrollSet() {
  if (isFirst) {
    directMessage.scrollTop = directMessage.scrollHeight;
    console.log(directMessage.scrollTop);
    isFirst = false;
  } else {
    if (isFinish) return;
    directMessage.scrollTop = directMessage.scrollHeight / 2;
  }
}

directMessage.addEventListener("scroll", async (e) => {
  if (directMessage.scrollTop <= 0) {
    setTimeout(() => {});
    getMessages("corx", "sukru1", ++page).then((messages) =>
      drawMessages(messages)
    );
  }
  console.log(directMessage.scrollTop);
});
