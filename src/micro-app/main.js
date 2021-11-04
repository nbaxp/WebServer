import { createApp  } from "./node_modules/vue/dist/vue.esm-browser.js"
import {c} from "./node_modules/vue-router/dist/vue-router.esm.browser.js"
const app = createApp({
    data() {
        return {
        };
    },
    mounted: function () {
        console.log('mounted');
    }
});
app.mount("#app");