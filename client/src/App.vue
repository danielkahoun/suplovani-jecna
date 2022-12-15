<script>
import { RouterView } from 'vue-router'

export default {
    data() {
        return {
            user: {}
        };
    },
    mounted() {
        (async () => {
            const vm = this;
            fetch("http://localhost:8080/api/getProfile/" + vm.$cookies.get("token"), {
                method: "GET",
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    vm.user = data.user;
                });
        })();
    }
}
</script>

<template>
    <RouterView :user="user" />
</template>

<style scope>
@import 'bootstrap/dist/css/bootstrap.css';

.router-link-active,
.router-link-exact-active {
    background-color: rgb(27, 27, 27);
    cursor: pointer;
}
</style>
