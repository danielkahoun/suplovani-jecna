<script>
export default {
  props: ['user']
}
</script>

<template>
    <header>
    <div class="px-3 text-bg-dark">
      <div class="container">
        <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a href="/" class="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none">
            <img src="/src/assets/logo.svg" class="bi me-2">
          </a>

          <ul class="nav col-12 col-lg-auto justify-content-center text-small">
            <li>
              <router-link to="/prehled" class="nav-link text-white">
                <div class="py-2">
                  <i class="fa-sharp fa-solid fa-house fa-lg bi d-block mx-auto mb-1"></i>
                  Přehled
                </div>
              </router-link>
            </li>
            <li v-if="user.role == 2">
              <router-link to="/uzivatele" class="nav-link text-white">
                <div class="py-2">
                  <i class="fa-sharp fa-solid fa-users fa-lg bi d-block mx-auto mb-1"></i>
                  Uživatelé
                </div>
              </router-link>
            </li>
            <li>
              <router-link to="/login" class="nav-link text-white">
                <div class="py-2">
                  <i class="fa-sharp fa-solid fa-right-from-bracket fa-lg bi d-block mx-auto mb-1"></i>
                  Odhlásit se
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="px-3 py-2 border-bottom mb-3">
      <div class="container d-flex flex-wrap justify-content-center">
        <form class="col-12 col-lg-auto mb-2 mb-lg-0 me-lg-auto">
          <h6 class="d-flex align-items-center p-0 m-0">Suplování SPŠE Ječná</h6>
          <p class="p-0 m-0" v-if="user.role == 2">přehled pro tvořitele suplování</p>
          <p class="p-0 m-0" v-if="user.role == 1">přehled pro učitele</p>
          <p class="p-0 m-0" v-if="user.role == 0">přehled pro studenta</p>
        </form>

        <div class="d-flex align-items-center" style="gap:10px;">
          <img class="rounded-circle" :src="'https://ui-avatars.com/api/?name='+user.first_name.substring(0, 1)+'+'+user.last_name.substring(0, 1)+'&background=random'" width="43" height="43">
          <div class="d-block text-start">
            <p class="p-0 m-0">přihlášen jako</p>
            <h6 class="p-0 m-0">{{user.first_name}} {{user.last_name}}</h6>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>