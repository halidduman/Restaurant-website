import { elements, getFromLocal, setLocalStorage } from "./helpers.js";

export class Recipe {
  constructor() {
    // tarif hakkında tüm bilgiler
    this.info = {};
    // tarifin malzemeleri
    this.ingredients = [];
    this.likes = getFromLocal("likes") || [];

    this.renderLikes();
  }

  async getRecipe(id) {
    // tarif bilgilerini alma
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );
    // veriyi jsona çevirme
    const data = await res.json();
    this.info = data.data.recipe;

    this.ingredients = data.data.recipe.ingredients;
  }

  createIngerient() {
    const html = this.ingredients
      .map(
        (ingeredient) =>
          `
        <li>
            <i class="bi bi-check-circle"></i>
            <p>${ingeredient.description}</p>
        </li>
        
        `
      )
      .join("");
    return html;
  }

  renderRecipe(recipe) {
    const markup = `
    <figure>
        <img src="${recipe.image_url}" alt="" />
        <h1>${recipe.title}</h1>
        <p class="like-area">
           <i class="bi ${
             this.isRecipeLike() ? "bi-heart-fill" : "bi-heart"
           }" id="like-btn"></i>
        </p>
    </figure>
    <div class="ingredients">
        <ul>
        
            ${this.createIngerient()}
        </ul>
        <button id="add-to-basket">
          <i class="bi bi-cart-fill"></i>
          <span>Alışveriş Sepetine Ekle</span>
        </button>
    </div>
    <div class="directions">
        <h2>Nasıl Pişirilir</h2>
        <p>
        Bu tarif dikkatlice <span>${recipe.publisher}</span> tarafından
        hazırlanmış ve test edilmiştir. Diğer detaylara onların websitesi
        üzerinden erişebilirsinzi
        </p>
        <a href="${recipe.source_url}" target="_blank">Yönerge</a>
    </div>

    `;

    elements.recipeArea.innerHTML = markup;
  }

  // ürün daha önce beğenilmiş mi kontrol eder
  isRecipeLike() {
    const found = this.likes.find((i) => i.id === this.info.id);
    return found;
  }

  renderLikes() {
    const html = this.likes
      .map(
        (item) =>
          `
    <a href="#${item.id}">
      <img src="${item.img}" width="50" alt="" />
      <p>${item.title}</p>
    </a>
    `
      )
      .join("");
    elements.likeList.innerHTML = html;
  }

  // likelama olaylarını kontrol eder
  controlLike() {
    // beğenilen ürünün ihtiyacımız olan değerlerini alma
    const newObject = {
      id: this.info.id,
      img: this.info.image_url,
      title: this.info.title,
    };
    // eleman daha önce eklenmişse çalışır
    if (this.isRecipeLike()) {
      this.likes = this.likes.filter((i) => i.id !== newObject.id);
      console.log(this.likes);
    } else {
      // daha önceden diziye eklenilmemiş ürünü push metodu ile ekledik
      this.likes.push(newObject);
      console.log(this.likes);
    }

    setLocalStorage("likes", this.likes);

    this.renderRecipe(this.info);

    this.renderLikes();
  }
}
