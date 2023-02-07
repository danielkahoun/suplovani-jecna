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
            const self = this;
            fetch("http://localhost:8080/api/getProfile", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': self.$cookies.get("token")
                },
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                self.user = data.user;
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
