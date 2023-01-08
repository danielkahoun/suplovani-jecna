<script>
import NavbarComponent from '../../components/NavbarComponent.vue';

export default {
    props: ['user'],
    data() {
        return {
            users: []
        }
    },
    mounted() {
        (async () => {
            const vm = this;
            fetch("http://localhost:8080/api/getUsers/"+vm.$cookies.get("token"), {
                method: "GET",
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                vm.users = data;
            });
        })();
    },
    components: { NavbarComponent }
}
</script>

<template>

    <NavbarComponent :user="user" />

    <div class="container">
        <h3>Správa uživatelů</h3>
        <hr>






        <table class="table table-hover table-bordered">
            <thead class="table-light">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Uživatelské jméno</th>
                    <th scope="col">Jméno</th>
                    <th scope="col">Příjmení</th>
                    <th scope="col">Role</th>
                    <th scope="col">Datum vytvoření</th>
                    <th scope="col">Akce</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users">
                    <th scope="row">{{user.id}}</th>
                    <td>{{user.username}}</td>
                    <td>{{user.first_name}}</td>
                    <td>{{user.last_name}}</td>
                    <td>
                        <span v-if="user.role == 2">tvořitel suplování</span>
                        <span v-else-if="user.role == 1">učitel</span>
                        <span v-else>student</span>
                    </td>
                    <td>{{new Date(user.creation_date).toLocaleDateString("cs-CZ")}}</td>
                    <td>
                        <div class="d-flex" style="margin:0 15px; gap:20px;">
                            <a class="text-decoration-none" href="#"><i class="fa-sharp fa-solid fa-user-xmark"></i>&nbsp;Smazat</a>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>




    </div>

</template>

<style>
tr td:last-child {
    width: 1%;
    white-space: nowrap;
}
</style>