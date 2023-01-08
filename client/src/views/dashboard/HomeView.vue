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
            const vm = this;
            fetch("http://localhost:8080/api/getSchedule/"+vm.$cookies.get("token"), {
                method: "GET",
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                vm.schedule = data;
            });
        })();
    },
    components: { NavbarComponent }
}
</script>

<template>

    <NavbarComponent :user="user" />

    <div class="container">

        <h3>Přehled pro uživatele {{ user.username }}</h3>
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
                <tr v-for="(value, key) in schedule">
                    <td v-if="key == 1">pondělí<br><b><!--01.11.2022--></b></td>
                    <td v-else-if="key == 2">úterý<br><b><!--01.11.2022--></b></td>
                    <td v-else-if="key == 3">středa<br><b><!--01.11.2022--></b></td>
                    <td v-else-if="key == 4">čtvrtek<br><b><!--01.11.2022--></b></td>
                    <td v-else-if="key == 5">pátek<br><b><!--01.11.2022--></b></td>
                    <td v-else-if="key == 6">sobota<br><b><!--01.11.2022--></b></td>
                    <td v-else-if="key == 7">neděle<br><b><!--01.11.2022--></b></td>
                    <td v-for="i in value[0].hour-1"></td>
                    <td v-for="record in value">
                        <span><b>{{ record.abbr }}</b>{{ record.hour }}</span>
                    </td>
                    <td v-for="i in (10-value.length-value[0].hour+1)"></td>
                </tr>
            </tbody>
        </table>
    </div>

</template>