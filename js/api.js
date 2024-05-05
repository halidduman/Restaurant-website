export class Search {
  constructor(query) {
    this.query = query;
    this.result = [];
  }

  async getResult() {
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes?search=${this.query}`
    );
    //* Veriyi jsona çevirip sonrasında result değişkenine aktardık.
    const data = await res.json();
    this.result = data.data.recipes;
  }
}
