const app = Vue.createApp({
    data(){
        return{
            listBooks: [],
            listBookID: [],
            data:{
                title: "",
                writer: "",
                price: "",
                releaseDate: ""
            },
            filterBook: [],
            searchBook: "",
            noBook: false
        }
    },
    created(){
        this.dataBooks()
        this.dataBookID()
    },
    methods:{
        dataBooks(){
            axios.get("/api/books")
            .then(response => {
                this.listBooks = response.data

                this.orderById(this.listBooks)
            })
        },
        dataBookID(){
            const urlParams = new URLSearchParams(window.location.search);
            this.bookID = urlParams.get("id");
    
            axios.get(`/api/book/${this.bookID}`)
            .then(response =>{
                this.listBookID = response.data

                this.data.writer = response.data.writer
                this.data.price = response.data.price
                this.data.releaseDate = response.data.releaseDate
            })
        },
        orderById(array){
            return array.sort((a, b) => {
                if(a.id < b.id){
                    return -1
                }else if(a.id > b.id){
                    return 1
                }else{
                    return 0
                }
            })
        },
        momentDateRelease(date){
            return moment(date).format("DD/MM/YYYY")
        },
        momentDateFooter(date){
            return moment(date).format("YYYY")
        },
        numberFormat(data){
            return numeral(data).format("$ 0,0.00")
        },
        postBook(){
            swal({
                title: "Confirmación",
                text: "¿Está seguro de querer registrar este libro?",
                icon: "warning",
                buttons: true
            })
            .then(confirmation => {
                axios.post("/api/book",`title=${this.data.title}&writer=${this.data.writer}&price=${this.data.price}&date=${this.data.releaseDate}`,{headers:{'content-type':'application/x-www-form-urlencoded'}})
                .then(response => {
                    swal({
                        title: "Registro exitoso",
                        icon: "success",
                        button: true
                    })
                    .then(response => {
                        window.location.replace("manager.html")
                    })
                })
                .catch(error =>{
                    swal({
                        title: "¡Atención!",
                        text: error.response.data,
                        icon: "error"
                    })
                })
            })
        },
        patchTitle(){
            const urlParams = new URLSearchParams(window.location.search);
            this.bookID = urlParams.get("id");

            swal({
                title: "Confirmación",
                text: "¿Está seguro de querer guardar este título?",
                icon: "warning",
                buttons: true
            })
            .then(confirmation => {
                if(confirmation){
                    axios.patch(`/api/book/title/${this.bookID}`,`title=${this.data.title}`,{headers:{'content-type':'application/x-www-form-urlencoded'}})
                    .then(response => {
                        swal({
                            title: "Título guardado",
                            icon: "success",
                            button: true
                        })
                        .then(response =>{
                            window.location.reload()
                        })
                    })
                    .catch(error => {
                        swal({
                            title: "¡Atención!",
                            text: error.response.data,
                            icon: "error"
                        })
                    })
                }
            })
        },
        putData(){
            const urlParams = new URLSearchParams(window.location.search);
            this.bookID = urlParams.get("id");

            swal({
                title: "Confirmación",
                text: "¿Está seguro de querer guardar los datos?",
                icon: "warning",
                buttons: true
            })
            .then(confirmation => {
                if(confirmation){
                    axios.put(`/api/book/data/${this.bookID}`,`writer=${this.data.writer}&price=${this.data.price}&date=${this.data.releaseDate}`,{headers:{'content-type':'application/x-www-form-urlencoded'}})
                    .then(response => {
                        swal({
                            title: "Datos guardados",
                            icon: "success",
                            button: true
                        })
                        .then(response =>{
                            window.location.reload()
                        })
                    })
                    .catch(error => {
                        swal({
                            title: "¡Atención!",
                            text: error.response.data,
                            icon: "error"
                        })
                    })
                }
            })
        },
        deleteBook(id){
            this.bookID = id;

            swal({
                title: "Confirmación",
                text: "¿Está seguro de querer eliminar este libro?",
                icon: "warning",
                buttons: true
            })
            .then(confirmation => {
                if(confirmation){
                    axios.delete(`/api/book/${this.bookID}`,{headers:{'content-type':'application/x-www-form-urlencoded'}})
                    .then(response => {
                        swal({
                            title: "Libro eliminado",
                            icon: "success",
                            button: true
                        })
                        .then(response =>{
                            window.location.replace("manager.html")
                        })
                    })
                }
            })
        },
        signOut(){
            swal({
                text: "¿Estás seguro que quiere cerrar sesión?",
                icon:"warning",
                buttons: true
            })
            .then(confirmation => {
                if(confirmation){
                    axios.post("/api/logout")
                    .then(response=>{
                        window.location.replace("index.html")
                    })
                }
            })
        }
    },
    computed:{
        searchBooks(){
            this.filterBook = this.listBooks.filter(book => book.title.toLowerCase().includes(this.searchBook.toLowerCase()));

            this.noSearch;
            return this.filterBook
        },
        noSearch(){
            if(this.filterBook.length === 0){
                return this.noBook = true
            }else{
                return this.noBook = false
            }
        }
    }
})
app.mount("#app")