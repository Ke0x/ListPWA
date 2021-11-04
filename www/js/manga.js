function OpenUrl(url) {
  cordova.InAppBrowser.open(url, "_blank", "location=yes");
}

const divManga = `
  <div class="item">
      <div onclick="callAnothePage(__id__)">
      <img src="__src__" class="cardImg" />
      <div class="titleContainer">
          <h5 class="cardTitle">__top__. __title__</h5>
      </div>
      </div>
  </div>
  `;

const htmlToElement = (html) => {
  const template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
};

const fetchApiDone = (json) => {
  const divList = document.getElementById("list");
  json.forEach((manga, i) => {
    const newDivManga = divManga
      .replace("__link__", manga.link)
      .replace("__src__", manga.img)
      .replace("__top__", i + 1)
      .replace("__title__", manga.name)
      .replace("__description__", manga.description)
      .replace("__id__", manga.id);
    divList.appendChild(htmlToElement(newDivManga));
  });
};

const fetchLocal = (url) => {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(new Response(xhr.response, { status: xhr.status }));
    };
    xhr.onerror = function () {
      reject(new TypeError("Local request failed"));
    };
    xhr.open("GET", url);
    xhr.responseType = "arraybuffer";
    xhr.send(null);
  });
};

const fetchApiMangas = () => {
  if (localStorage.getItem("jsonData")) {
    fetchApiDone(JSON.parse(localStorage.getItem("jsonData")));
  } else if (!localStorage.getItem("jsonData")) {
    fetchLocal("api/manga.json").then((response) => {
      response.json().then((x) => {
        localStorage.setItem("jsonData", JSON.stringify(x));
        fetchApiDone(x);
      });
    });
  }
};

if ("cordova" in window) {
  document.addEventListener("deviceready", fetchApiMangas);
} else {
  document.addEventListener("DOMContentLoaded", fetchApiMangas);
}
