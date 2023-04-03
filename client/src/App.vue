<script>
import { RouterView } from 'vue-router'

export default {
    data() {
        return {
            user: {}
        }
    },
    provide() {
        return {
            getUser: () => this.user
        }
    },
    methods: {
        getProfile() {
            const self = this;
            fetch(import.meta.env.VITE_URL+"api/users/me", {
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
            if(window.location.pathname != "/" && window.location.pathname != "/login") {
                this.$router.push('/');
            }
        }
    }
}
</script>

<template>
    <RouterView :user="user" />
</template>

<style scope>
@import 'bootstrap/dist/css/bootstrap.css';
@import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap');

* {
    font-family: 'Work Sans', sans-serif;
}

.router-link-active,
.router-link-exact-active {
    background-color: rgb(27, 27, 27);
    cursor: pointer;
}
</style>
