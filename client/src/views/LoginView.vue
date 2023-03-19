<script>
export default {
    data() {
        return {
            message: {
                type: null,
                content: null
            },
            username: "",
            password: ""
        }
    },
    methods: {
        login() {
            (async () => {
                const self = this;
                fetch(import.meta.env.VITE_URL+"api/login", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user: { username: this.username, password: this.password } })
                })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Přihlášení se nezdařilo.");
                    }
                })
                .then((data) => {
                    this.$cookies.set("token", data, "7d")
                    console.log("login success");
                    window.location.href = '/prehled';
                })
                .catch(function(error) {
                    self.message.type = "danger";
                    self.message.content = error.message;
                });
            })();
        }
    }
}

</script>

<template>
    <main class="d-flex align-items-center vh-100">
        <div class="form-signin text-center w-100 mx-auto">
            <img class="mb-4" src="https://www.spsejecna.cz/ci/SPSE-Jecna_Logotyp.svg" alt="" width="212" height="53">
            <h1 class="h3 mb-3 fw-normal">Přihlášení</h1>

            <div class="alert alert-danger" v-if="message.type == 'danger'" role="alert">
                {{ message.content }}
            </div>

            <div class="form-floating">
                <input type="text" class="form-control" id="floatingInput" placeholder="name@example.com"
                    v-model="username">
                <label for="floatingInput">Uživatelské jméno</label>
            </div>
            <div class="form-floating">
                <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="password">
                <label for="floatingPassword">Heslo</label>
            </div>

            <button class="w-100 btn btn-lg btn-primary" @click="login">Přihlásit se</button>
        </div>
    </main>
</template>

<style scoped>
.form-signin {
    max-width: 300px;
    margin-bottom: 100px;
}

.form-signin .form-floating:focus-within {
    z-index: 2;
}

.form-signin input[type="text"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}
</style>