function addElement() {
  console.log(document.getElementById("title_id").value);
  console.log(document.getElementById("description_id").value);
  console.log(document.getElementById("image_id").value);
  console.log(JSON.parse(localStorage.getItem("jsonData")));

  const AnimeValues = JSON.parse(localStorage.getItem("jsonData"));
  const newAnime = {
    id: AnimeValues.length + 1,
    name: document.getElementById("title_id").value,
    description: document.getElementById("description_id").value,
    img: document.getElementById("image_id").value,
  };
  AnimeValues.push(newAnime);
  localStorage.setItem("jsonData", JSON.stringify(AnimeValues));
  window.location = "index.html";
  alert("ok");
}
