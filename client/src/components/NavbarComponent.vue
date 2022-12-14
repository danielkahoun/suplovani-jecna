<template>
    <header>
    <div class="px-3 text-bg-dark">
      <div class="container">
        <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a href="/" class="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none">
            <svg class="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlink:href="#bootstrap"></use></svg>
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
            <li>
              <router-link to="/rozvrh" class="nav-link text-white">
                <div class="py-2">
                  <i class="fa-sharp fa-solid fa-calendar-days fa-lg bi d-block mx-auto mb-1"></i>
                  Rozvrh
                </div>
              </router-link>
            </li>
            <li>
              <router-link to="/absence" class="nav-link text-white">
                <div class="py-2">
                  <i class="fa-sharp fa-solid fa-person-circle-question fa-lg bi d-block mx-auto mb-1"></i>
                  Absence
                </div>
              </router-link>
            </li>
            <li>
              <router-link to="/uzivatele" class="nav-link text-white">
                <div class="py-2">
                  <i class="fa-sharp fa-solid fa-users fa-lg bi d-block mx-auto mb-1"></i>
                  Uživatelé
                </div>
              </router-link>
            </li>
            <li>
              <router-link to="/" class="nav-link text-white">
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
          <p class="p-0 m-0">verze 1.2</p>
        </form>

        <div class="text-end btn-group">
          <button type="button" class="btn btn-light text-dark">Sdílet</button>
          <button type="button" class="btn btn-primary">Přidat do Google Kalendáře</button>
        </div>
      </div>
    </div>
  </header>
</template>