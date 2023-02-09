<script>
import { RouterView } from 'vue-router'

export default {
    data() {
        return {
            user: {}
        };
    },
    methods: {
        getProfile() {
            const self = this;
            fetch("http://localhost:8080/api/getProfile", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': self.$cookies.get("token")
                },
            })
            .then((response) => {
                if(!response.ok) {
                    throw new Error();
                }
                return response.json();
            })
            .then((data) => {
                self.user = data.user;
            })
            .catch((error) => {
                self.$cookies.remove("token");
                window.location.replace("/");
            });
        }
    },
    mounted() {
        if(self.$cookies.isKey("token")) {
            this.getProfile();
        }else {
            if(window.location.pathname != "/") this.$router.push('/');
        }
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
