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
        <h3>Správa uživatelů</h3>
        <hr>






        <table class="table table-striped table-hover table-bordered">
  <thead class="thead-dark">
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>




    </div>

</template>