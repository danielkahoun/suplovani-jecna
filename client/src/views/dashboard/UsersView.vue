<script>
import NavbarComponent from '../../components/NavbarComponent.vue';

export default {
    props: ['user'],
    data() {
        return {
            users: [],
            classes: [],
            form: {
                first_name: "",
                last_name: "",
                password: "",
                role: 0,
                class_id: "",
            }
        }
    },
    methods: {
        getUsers() {
            const self = this;
            fetch("http://localhost:8080/api/getUsers", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': self.$cookies.get("token")
                },
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                self.users = data;
            });
        },
        getClasses() {
            const self = this;
            fetch("http://localhost:8080/api/getClasses", {
                method: 'GET',
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                self.classes = data;
            });
        },
        addUser() {
            const self = this;
            fetch("http://localhost:8080/api/addUser", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': self.$cookies.get("token")
                },
                body: JSON.stringify(this.form)
            })
            .then((response) => {
                console.log(response.ok);
                if (response.ok) {
                    this.form = {
                        first_name: "",
                        last_name: "",
                        password: "",
                        role: 0,
                        class_id: "",
                    }
                    this.getUsers();
                }
            });
        },
        deleteUser(id) {
            const self = this;
            fetch("http://localhost:8080/api/deleteUser/"+id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': self.$cookies.get("token")
                },
            })
            .then((response) => {
                console.log(response.ok);
                if (response.ok) {
                    console.log("User deleted");
                    this.users = this.users.filter(user => user.id != id);
                }
            });
        }
    },
    computed: {
        suggestUsername() {
            let username = this.form.first_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") + this.form.last_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return username.toLowerCase();
        }
    },
    mounted() {
        this.getUsers();
        this.getClasses();
    },
    components: { NavbarComponent }
}
</script>

<template>

    <NavbarComponent :user="user" />

    <div class="container">
        
        
        <div class="d-flex">
            <h3>Správa uživatelů</h3>
            <button type="button" class="btn btn-primary btn-sm ms-auto" data-bs-toggle="modal" data-bs-target="#addUserModal">
                Přidat uživatele
            </button>
        </div>
        <hr>

        <!-- Button trigger modal -->
        

        <!-- Modal -->
        <div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addUserModalLabel">Přidat uživatele</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">         
                            <div class="row mb-3">
                                <div class="col">
                                    <label class="form-label">Jméno</label>
                                    <input type="text" class="form-control" v-model="form.first_name">
                                </div>
                                <div class="col">
                                    <label class="form-label">Příjmení</label>
                                    <input type="text" class="form-control" v-model="form.last_name">
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col">
                                    <label class="form-label">Uživatelské jméno</label>
                                    <input type="text" class="form-control" :value="suggestUsername" disabled>
                                </div>
                                <div class="col">
                                    <label class="form-label">Heslo</label>
                                    <input type="password" class="form-control" v-model="form.password">
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col">
                                    <label class="form-label">Role</label>
                                    <select class="form-select" v-model="form.role">
                                        <option value="0">Student</option>
                                        <option value="1">Učitel</option>
                                        <option value="2">Tvořitel suplování</option>
                                    </select>
                                </div>
                                <div class="col">
                                    <label class="form-label">Třída</label>
                                    <select class="form-select" v-model="form.class_id" :disabled="form.role == 2">
                                        <option value="">Žádná</option>
                                        <option v-for="cl in classes" :value="cl.id">{{cl.name}}</option>
                                    </select>
                                </div>
                            </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Zavřít</button>
                        <button type="button" class="btn btn-primary" v-on:click="addUser">Přidat uživatele</button>
                    </div>
                </div>
            </div>
        </div>

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
                            <a class="text-decoration-none" v-on:click="deleteUser(user.id)"><i class="fa-sharp fa-solid fa-user-xmark"></i>&nbsp;Smazat</a>
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