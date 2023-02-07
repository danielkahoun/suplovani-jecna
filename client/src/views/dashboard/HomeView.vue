<script>
import NavbarComponent from '../../components/NavbarComponent.vue';

export default {
    props: ['user'],
    data() {
        return {
            schedule: []
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
            <tbody v-if="user.role != 2">
                <tr v-for="(value, key) in schedule">
                    <td v-if="key == 1">pondělí<br><b><!--01.11.2022--></b></td>
                    <td v-else-if="key == 2">úterý<br><b><!--01.11.2022--></b></td>
                    <td v-else-if="key == 3">středa<br><b><!--01.11.2022--></b></td>
                    <td v-else-if="key == 4">čtvrtek<br><b><!--01.11.2022--></b></td>
                    <td v-else-if="key == 5">pátek<br><b><!--01.11.2022--></b></td>                    
                    <td v-for="i in 10">
                        <template v-for="x in 10">
                            <span v-if="value[x-1] != null && value[x-1].hour == i">
                                <div class="row">
                                    <div class="col text-start">{{ value[x-1].last_name.slice(0, 2) }}</div>
                                    <div class="col text-end">{{ value[x-1].classroom }}</div>
                                </div>
                                <div class="text-center">
                                    <h5>{{ value[x-1].abbr }}</h5>
                                </div>
                                <div class="row">
                                    <div class="col text-start">{{ value[x-1].class }}</div>
                                    <div class="col text-end"></div>
                                </div>
                            </span>
                        </template>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="11">Tvořitel nemá rozvrh</td>
                </tr>
            </tbody>
        </table>
    </div>

</template>