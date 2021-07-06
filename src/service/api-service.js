export default class ImageApiService {
    constructor() {
        this.API_KEY = '22368455-652b774db086074207edc62e9';
        this.BASE_URL = 'https://pixabay.com/api/';
        this.PER_PAGE = 12;
        this.page = 1;
        this.searchQuery = "";
     
    }

    fetchImage() {
        return fetch(`${this.BASE_URL}?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=${this.PER_PAGE}&key=${this.API_KEY}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Error fetching image");
            });
        
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

}


