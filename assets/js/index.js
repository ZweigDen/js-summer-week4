const app = {
    data() {
        return {
            url: "https://vue3-course-api.hexschool.io",
            path: "teach",
            isNew: false,
            products: [],
            tempProduct: {
            }
        }
    },
    mounted() {
        // 取出 Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        if (token === '') {
            alert('您尚未登入請重新登入。');
            window.location = 'login.html';
        }
        axios.defaults.headers.common.Authorization = token;

        this.getData();
    },
    methods: {
        getData() {
            const api = `${this.url}/api/${this.path}/admin/products`
            axios.get(api)
                .then((response) => {
                    if (response.data.success) {
                        this.products = response.data.products;
                    } else {
                        alert(response.data.message);
                    }
                }).catch((error) => {
                    console.log(error)
                });
        },
        // 修改商品 將修改的商品寫入product
        openModel(isNew, item) {
            this.isNew = isNew;
            if (this.isNew) {
                this.tempProduct = {};
            } else {
                this.tempProduct = { ...item }
            }
        },
        updateProduct(e) {
            let url = `${this.url}/api/${this.path}/admin/product`;
            let method = 'post';
            if (!this.isNew) {
                url = `${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`;
                method = 'put';
            }
            axios[method](url,{data:this.tempProduct})
            .then(res=>{
                if(res.data.success){
                    this.getData();
                } else{
                    console.log(res)
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        checkDel(item) {
            const id = item.id;
            this.tempProduct = item;
        },
        delProduct() {
            const id = this.tempProduct.id;
            const api = `${this.url}/api/${this.path}/admin/product/${id}`;
            axios.delete(api)
                .then(response => {
                    if (response.data.success) {
                        this.getData();
                    } else {
                        console.log(response)
                    }
                }).catch(error => {
                    console.log(error);
                });
        },
        logOut() {
            const api = `${this.url}/logout`;
            axios.post(api)
                .then(res => {
                    if (res.data.success) {
                        axios.defaults.headers.common.Authorization = "";
                        window.location = 'login.html';
                    } else {
                        console.log(res);
                    }
                }).catch(err => {
                    console.log("err:", err);
                });
        }
    }
}

Vue.createApp(app)
    .mount('#app');