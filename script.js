//--------------Selectors---------------------
const hamburgerBtn = document.querySelector(".hamburger");
const dropdownMenu = document.querySelector("#nav-collapse");
const inputBox = document.querySelector(".form-group input");
const formButton = document.querySelector(".form-btn");
const searchList = document.querySelector(".search-list");
const errorMsg = document.querySelector(".form-msg");
//-----------Event listeners-----------------
hamburgerBtn.addEventListener("click", function () {
  if (dropdownMenu.classList.contains("show")) {
    dropdownMenu.style.display = "none";
    dropdownMenu.classList.remove("show");
  } else {
    dropdownMenu.classList.add("show");
    dropdownMenu.style.display = "block";
  }
});
formButton.addEventListener("click", function (e) {
  e.preventDefault();
  shortenUrl(inputBox.value);
});

//---------functions----------------------------------
//--------handles asynchronous call-------------------
async function shortenUrl(url) {
  let response = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
  let data = await response.json();
  render(data); //render the output data;
  console.log(data);
  inputBox.value = "";
}
function render(data) {
  if (data["ok"]) {
    errorMsg.style.display = "none";
    inputBox.style.outline = "none";
    let info = data.result;
    searchList.innerHTML += `<div class="search-result">
        <div class="list-items">
        <span class="long-link">${info.original_link}</span>
        <span class="short-link">${info.short_link}</span>
        </div>
        <button class="copy-btn">Copy</button>
        </div>`;
    searchList.style.margin = "-60px 0 80px";
    let copyBtns = document.querySelectorAll(".copy-btn");
    copyBtns.forEach((copy_btn) => {
      copy_btn.addEventListener("click", copyToClipboard);
    });
  } else {
    errorMsg.style.display = "block";
    inputBox.style.outline = "2px solid hsl(0, 87%, 67%)";
    console.log(data["error_code"]);
    errorHandling(data["error_code"]);
  }
}
function errorHandling(er) {
  switch (er) {
    case 1:
      errorMsg.innerText = "No URL specified";
      break;
    case 2:
      errorMsg.innerText = "Invalid URL submitted";
      break;
    default:
      errorMsg.innerText = "Unknown Error";
      break;
  }
}
function copyToClipboard(evt) {
  evt.target.style.backgroundColor = "#3b3054";
  evt.target.innerText = "Copied!";
  let copyText = evt.target.previousElementSibling.children[1].innerText;
  setInterval(function () {
    evt.target.style.backgroundColor = "#2acfcf";
    evt.target.innerText = "Copy";
  }, 3000);
  return navigator.clipboard.writeText(copyText);
}
