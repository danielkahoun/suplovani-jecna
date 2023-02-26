<script>
import NavbarComponent from '../../components/NavbarComponent.vue';

export default {
    props: ['user'],
    data() {
        return {
            schedule: [],
            position: {
                x: 0,
                y: 0
            },
            select: {
                row: null,
                col: null,
                data: null
            },
            openModal: false
        }
    },
    methods: {
        toggleModal() {
            this.$refs.btn.click();
            if(this.select.row != null && this.select.col != null)
                this.getSelected();
        },
        getSelected() {
            let row = JSON.parse(JSON.stringify(this.schedule[this.select.row]));
            this.select.data = row[this.select.col];
        }
    },
    mounted() {
        (async () => {
            const self = this;
            fetch("http://localhost:8080/api/getSchedule", {
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
                    self.schedule = data;
                });
        })();
    },
    components: { NavbarComponent }
}
</script>

<template>

    <NavbarComponent :user="user" />

    <div class="container">


        <p>
            {{ position.x }}
            {{ position.y }}
        </p>

        <p>
            {{ (select.row == null) ? 'žádné' : select.row }}
            {{ (select.col == null) ? 'žádné' : select.col }}
        </p>

        <button ref="btn" data-bs-toggle="modal" data-bs-target="#substitution" hidden></button>
        <div class="modal fade" id="substitution" tabindex="-1" aria-labelledby="substitutionLabel" aria-hidden="true"
            v-on:mouseleave="position.x = 0; position.y = 0;">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="substitutionLabel" v-if="user.role == 2">Přidat změnu v rozvrhu</h5>
                        <h5 class="modal-title" id="substitutionLabel" v-else>Podrobnosti</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <table class="table table-bordered table-striped" v-if="this.select.data != null">
                            <thead>
                                <tr class="bg-dark">
                                    <th colspan="2" class="text-white text-center" v-if="select.data.day == 1">pondělí - {{ select.data.hour }}. hodina</th>
                                    <th colspan="2" class="text-white text-center" v-else-if="select.data.day == 2">úterý - {{ select.data.hour }}. hodina</th>
                                    <th colspan="2" class="text-white text-center" v-else-if="select.data.day == 3">středa - {{ select.data.hour }}. hodina</th>
                                    <th colspan="2" class="text-white text-center" v-else-if="select.data.day == 4">čtvrtek - {{ select.data.hour }}. hodina</th>
                                    <th colspan="2" class="text-white text-center" v-else-if="select.data.day == 5">pátek - {{ select.data.hour }}. hodina</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">Předmět</th>
                                    <td><b>{{ select.data.subject_abbr }}</b> - {{ select.data.subject }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Vyučující</th>
                                    <td>{{ select.data.first_name }} {{ select.data.last_name }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Třída</th>
                                    <td>{{ select.data.class }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Změny v rozvrhu</th>
                                    <td>žádné</td>
                                </tr>
                                <tr>
                                    <th scope="row">Detailní informace</th>
                                    <td>žádné</td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-if="user.role == 2">
                            <h5 class="modal-title">Provést změnu</h5>
                            <hr>

                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Zavřít</button>
                        <button type="button" class="btn btn-primary">Provést změnu</button>
                    </div>
                </div>
            </div>
        </div>



        <h3>Přehled</h3>
        <hr>
        <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center">
                <li class="page-item disabled">
                    <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Předchozí den</a>
                </li>
                <li class="page-item"><a class="page-link" href="#">05.02.</a></li>
                <li class="page-item"><a class="page-link" href="#">06.02.</a></li>
                <li class="page-item"><a class="page-link" href="#">07.02</a></li>
                <li class="page-item">
                    <a class="page-link" href="#">Další den</a>
                </li>
            </ul>
        </nav>
        <table class="table table-bordered bg-white">
            <thead class="text-center">
                <tr>
                    <td></td>
                    <td>1. hodina<br><b>7:30 - 8:15</b></td>
                    <td>2. hodina<br><b>8:25 - 9:10</b></td>
                    <td>3. hodina<br><b>9:20 - 10:05</b></td>
                    <td>4. hodina<br><b>10:20 - 11:05</b></td>
                    <td>5. hodina<br><b>11:15 - 12:00</b></td>
                    <td>6. hodina<br><b>12:10 - 12:55</b></td>
                    <td>7. hodina<br><b>13:05 - 13:50</b></td>
                    <td>8. hodina<br><b>14:00 - 14:45</b></td>
                    <td>9. hodina<br><b>14:55 - 15:40</b></td>
                    <td>10. hodina<br><b>15:50 - 16:35</b></td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(value, key) in schedule" v-on:mouseover="position.y = parseInt(key); select.row = parseInt(key);">
                    <td v-if="key == 1">pondělí<br><b><!--01.11.2022--></b></td>
                    <td v-else-if="key == 2">úterý<br><b><!--01.11.2022--></b></td>
                    <td v-else-if="key == 3">středa<br><b><!--01.11.2022--></b></td>
                    <td v-else-if="key == 4">čtvrtek<br><b><!--01.11.2022--></b></td>
                    <td v-else-if="key == 5">pátek<br><b><!--01.11.2022--></b></td>
                    <td v-else>{{ key }}</td>
                    <td v-for="i in 10" v-on:mouseover="position.x = i;"
                        v-on:mouseenter="select.row = null; select.col = null; select.data = null;"
                        :style="(position.x == i && position.y == key) && { backgroundColor: '#eeeeee', cursor: 'pointer' }"
                        v-on:click="toggleModal">
                        <template v-for="x in 10">
                            <div class="w-100 h-100" v-if="(value[x - 1] != null && value[x - 1].hour == i)" v-on:mouseover="select.col = (x-1)">
                                <div class="row">
                                    <div class="col text-start">{{ value[x - 1].last_name.slice(0, 2) }}</div>
                                    <div class="col text-end">{{ value[x - 1].classroom }}</div>
                                </div>
                                <div class="text-center">
                                    <h5>{{ value[x - 1].subject_abbr }}</h5>
                                </div>
                                <div class="row">
                                    <div class="col text-start">{{ value[x - 1].class }}</div>
                                    <div class="col text-end"></div>
                                </div>
                            </div>
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

</template>