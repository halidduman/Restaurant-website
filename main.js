import { Search } from "./js/api.js";
import {
  controlBtn,
  elements,
  getFromLocal,
  setLocalStorage,
} from "./js/helpers.js";
import { Recipe } from "./js/recipe.js";
import { renderBasketItems, renderLoader, renderResult } from "./js/ui.js";
import { v4 as id } from "https://jspm.dev/uuid";
const recipe = new Recipe();
let basket = getFromLocal("basket") || [];
// sayfanın yüklenme anını izler
document.addEventListener("DOMContentLoaded", () => {
  renderBasketItems(basket);
  controlBtn(basket);
});

const handleSubmit = async (e) => {
  e.preventDefault(); // Sayfanın yenilenmesini engeller

  // Inputun içerisindeki değeri alıp bir değişkene aktardık
  const query = elements.searchInput.value;
  // Inputun içerisi boşsa alert ile ekrana bildirim gönderdik.
  // Fonksiyonu burda durdurmak için return kullandık.
  if (query == "") {
    alert("Lütfen bir yemek ismi giriniz!");
    return;
  }
  //* Inputun içine herhangi bir şey yazarsak çalışır.
  if (query) {
    //* Search sınıfının bir örneğini oluşturduk
    const search = new Search(query);
    renderLoader(elements.resultsList);
    //* Search sınıfı içerisindeki getResult methodu ile apiye istek attık.
    try {
      await search.getResult();
      renderResult(search.result);
    } catch (error) {
      console.log(error);
    }
  }
};

const controlRecipe = async () => {
  // urldeki idye erişip # işareti yerine boş bir yapı ekledik.
  const id = location.hash.replace("#", "");

  if (id) {
    try {
      await recipe.getRecipe(id);
      recipe.renderRecipe(recipe.info);
    } catch (error) {
      console.log(error);
    }
  }
};

elements.form.addEventListener("submit", handleSubmit);
// eklenilen hash yapısı her değiştiğinde çalışır
// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);
["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

const handleClick = (e) => {
  if (e.target.id === "add-to-basket") {
    // içindekiler dizisini dön ve her döndüğümüz tarif için
    // yeni bir obje oluştur ve bu obje içerisinde id oluştur.
    // Oluşturduğumuz her bir objeyi basket dizisine push methodu ile ekledik
    recipe.ingredients.forEach((title) => {
      const newItem = {
        id: id(),
        title,
      };
      // tarifleri basket dizisine ekleme
      basket.push(newItem);
    });
    // sepeti locale kaydetme
    setLocalStorage("basket", basket);
    // ekrana sepet elemanlarını bas
    renderBasketItems(basket);
    controlBtn(basket);
  }
  if (e.target.id === "like-btn") {
    // tıkladığımız etiketin idsi like-btn ise beğenilme işlemini gerçekleştir
    recipe.controlLike();
  }
};
// sepete ekle butonuna ve like butonuna tıklanma olaylarını izleme
elements.recipeArea.addEventListener("click", handleClick);

const deleteItem = (e) => {
  // basketList alanındaki elemanlardan idsi delete-item olduğunda çalışır.
  if (e.target.id === "delete-item") {
    // x iconunun kapsayıcısına erişmek için parentElement yöntemini kullanıdık
    const parent = e.target.parentElement;
    console.log(basket);
    // Seçilen ürünü diziden kaldırmak için dataset özelliği ile idsine eriştik.
    // Bu idsini bildiğimiz ürünü basket dizisinden filter yöntemi ile kaldırdık.
    basket = basket.filter((i) => i.id !== parent.dataset.id);
    console.log(basket);
    // locali güncelleme
    setLocalStorage("basket", basket);
    // sayfadan parent etiketini kaldırma
    parent.remove();

    controlBtn(basket);
  }
};
// basketList alanına tıklanıldığında deleteItem fonksiyonu çalışır
elements.basketList.addEventListener("click", deleteItem);

const handleClear = () => {
  const res = confirm("Sepet silinecek! Emin misiniz?");
  // res true gelirse confirm onaylanırsa çalışır.
  console.log(res);
  if (true) {
    // locali temizle
    setLocalStorage("basket", null);
    // sepet dizisini temizle
    basket = [];
    // Sepeti temizle butonunu ortadan kaldırır.
    controlBtn(basket);
    // basketList alanını güncelledik
    elements.basketList.innerHTML = "";
  }
};
// Sepeti temizle butonuna tıklanma olayını izler.
elements.clearBtn.addEventListener("click", handleClear);
