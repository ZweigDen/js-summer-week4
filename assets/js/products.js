import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.11/vue.esm-browser.js';
import pagination from './pagination.js';
    


const app = createApp({
    data() {
        return {
            url: "https://vue3-course-api.hexschool.io",
            path: "teach",
            isNew: false,
            products: [],
            tempProduct: {
            },
            pagination:{}
        }
    },
    components:{
        pagination
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
        getData(page = 1) {
            const api = `${this.url}/api/${this.path}/admin/products?page=${page}`;
            axios.get(api)
                .then((response) => {
                    if (response.data.success) {
                        this.products = response.data.products;
                        this.pagination = response.data.pagination;
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
});
app.component('productModal',{
    template:`<div class="modal fade bd-example-modal-xl" tabindex="-1" role="dialog" aria-labelledby="myExtraLargeModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">新建/修改</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body mb-3 p-4 d-flex justify-content-between">
                <div class="row">
                    <div class="col-3 d-flex flex-column boxShadow">
                        <label for="img">主要圖片</label>
                        <input type="text" id="img" class="mb-2" v-model="tempProduct.imageUrl">
                        <img :src="tempProduct.imageUrl" alt="" style="width:200px;height: 200px;">
                    </div>
                    <div class="col-1"></div>
                    <div class="row col-8">
                        <div class="d-flex flex-column col-12">
                            <label for="title">標題</label>
                            <input type="text" id="title" v-model="tempProduct.title">
                        </div>
                        <div class="d-flex flex-column col-6">
                            <label for="category">分類</label>
                            <input type="text" id="category" v-model="tempProduct.category">
                        </div>
                        <div class="d-flex flex-column col-6">
                            <label for="unit">單位</label>
                            <input type="text" id="unit" v-model="tempProduct.unit">
                        </div>
                        <div class="d-flex flex-column col-6">
                            <label for="origin_price">原價</label>
                            <input type="number" min="0" id="origin_price"
                                v-model.number="tempProduct.origin_price">
                        </div>
                        <div class="d-flex flex-column col-6">
                            <label for="price">售價</label>
                            <input type="number" id="price" min="0" v-model.number="tempProduct.price">
                        </div>
                        <div class="d-flex flex-column col-12">
                            <label for="description">產品描述</label>
                            <input type="text" id="description" v-model="tempProduct.description">
                        </div>
                        <div class="d-flex flex-column col-12">
                            <label for="content">說明內容</label>
                            <input type="text" id="content" v-model="tempProduct.content">
                        </div>
                        <div class="form-check">
                            <input id="is_enabled" v-model="tempProduct.is_enabled" class="form-check-input"
                                type="checkbox" :true-value="1" :false-value="0">
                            <label class="form-check-label" for="is_enabled">是否啟用</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal" :data-id="tempProduct.id"
                    @click="$emit('updateProduct')">送出</button>
            </div>
        </div>
    </div>
</div>`,
    props:['tempProduct']
});
app.mount('#app');