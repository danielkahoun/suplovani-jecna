<script>
import NavbarComponent from '../../components/NavbarComponent.vue';

export default {
    data() {
        return {
            user: {
                username: null,
                role: null
            }
        };
    },
    mounted() {
        (async () => {
            const vm = this;
            fetch("http://localhost:8080/api/getProfile", {
                method: "GET",
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    vm.user = data.user;
                });
        })();
    },
    components: { NavbarComponent }
}
</script>

<template>

    <NavbarComponent />

    <div class="container">
        <h3>Rozvrh</h3>
        <hr>
    </div>

</template>