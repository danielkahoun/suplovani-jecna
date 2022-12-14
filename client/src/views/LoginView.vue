<script>
export default {
    data() {
        return {
            message: {
                type: null,
                content: null
            },
            username: "admin",
            password: "admin123"
        }
    },
    methods: {
        login() {
            (async () => {
                const vm = this;
                fetch('http://localhost:8080/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user: { username: this.username, password: this.password } })
                })
                .then(response => {
                    if (response.ok) return response.json();
                    vm.message.type = "danger";
                    vm.message.content = "Přihlášení se nezdařilo.";
                })
                .then(data => {
                    this.$cookies.set("token", data, "7d")
                    window.location.href = '/prehled';
                });
            })();
        }
    }
}

</script>

<template>

    <main class="form-signin text-center w-100 m-auto">
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
    </main>

</template>

<style scoped>
html,
body {
    height: 100%;
}

body {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
}

.form-signin {
    max-width: 330px;
    padding: 15px;
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