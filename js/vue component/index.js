const {createApp, ref, reactive, watch, computed, onMounted} = Vue;

const app = createApp({
    setup() {

        onMounted(() => {
        });

        return {};
    },
});

app.component("vue_nav", vue_nav);
app.mount("#app");
