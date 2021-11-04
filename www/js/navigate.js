function callAnothePage(item) {
  localStorage.setItem("itemDetails", item);
  window.location = "details.html";
}

function navigateAddPage() {
  window.location = "add.html";
}

function reloadPage() {
  window.location.reload();
}
