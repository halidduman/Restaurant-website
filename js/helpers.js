export const elements = {
  form: document.querySelector("form"),
  searchInput: document.querySelector("form input"),
  resultsList: document.querySelector(".results"),
  recipeArea: document.querySelector(".recipe"),
  basketList: document.querySelector(".shopping ul"),
  clearBtn: document.querySelector("#clear"),
  likeList: document.querySelector(".list"),
};

// localStorage veri ekleme/güncelleme
export const setLocalStorage = (key, data) => {
  // verileri stringe çevirme
  const strData = JSON.stringify(data);
  // localStorage kaydetme
  localStorage.setItem(key, strData);
};
// localStorage'dan eleman alma
export const getFromLocal = (key) => {
  // string veriyi localden alma
  const strData = localStorage.getItem(key);
  // string veriyi eski haline çevirip dışarı aktarma
  return JSON.parse(strData);
};
// Sepetin doluluk oranına göre sepeti temizle butonu görünür.
export const controlBtn = (basket) => {
  if (basket.length > 0) {
    elements.clearBtn.style.display = "flex";
  } else {
    elements.clearBtn.style.display = "none";
  }
};
