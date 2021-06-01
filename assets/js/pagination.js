export default {
    props:["page"],
    template:`<nav aria-label="...">
    <ul class="pagination">
      <li class="page-item" :class="{'disabled':page.current_page === 1}">
        <a class="page-link" href="#" @click="$emit('get-product', page.current_page-1)" tabindex="-1" aria-disabled="true">Previous</a>
      </li>
      <li class="page-item" v-for="item in page.total_pages" :class="{'active':item === page.current_page}" :key="item"><a class="page-link" href="#" @click="$emit('get-product', item)">{{ item }}</a></li>
      <li class="page-item" :class="{'disabled':page.current_page === page.total_pages}">
        <a class="page-link" href="#" @click="$emit('get-product', page.current_page+1)">Next</a>
      </li>
    </ul>
  </nav>`
}