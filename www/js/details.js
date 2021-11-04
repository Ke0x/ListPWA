const itemId = localStorage.getItem("itemDetails");

const contentDiv = `
  <div">
      <div class="detailsContent">
      <img src="__src__" class="detailsImg" />
      <div class="">
          <h5 class="detailsTitle">__title__</h5>
          <p class="detailsDescription">__description__</p>
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
  const item = json.filter(function (data) {
    return data.id == itemId;
  });
  console.log(item);

  const divContent = document.getElementById("content");
  const newDivManga = contentDiv
    .replace("__src__", item[0].img)
    .replace("__title__", item[0].name)
    .replace("__description__", item[0].description);
  divContent.appendChild(htmlToElement(newDivManga));
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

function goBack() {
  window.location = "index.html";
}

if ("cordova" in window) {
  document.addEventListener("deviceready", fetchApiMangas);
} else {
  document.addEventListener("DOMContentLoaded", fetchApiMangas);
}
