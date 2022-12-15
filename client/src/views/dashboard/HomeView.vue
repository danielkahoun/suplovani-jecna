<script>
import NavbarComponent from '../../components/NavbarComponent.vue';

export default {
    props: ['user'],
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
                <tr>
                    <td>pondělí<br><b>01.11.2022</b></td>
                    <td class="bg-success text-white text-center">
                        <span><b>PSS</b>&nbsp;Ms</span><br>
                        <span>odpadá</span>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>úterý<br><b>02.11.2022</b></td>
                    <td></td>
                    <td></td>
                    <td class="bg-warning text-white text-center">
                        <span><b>M</b>&nbsp;Ng</span><br>
                        <span>přesun</span>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>středa<br><b>03.11.2022</b></td>
                    <td></td>
                    <td colspan="2" class="bg-primary text-white text-center">
                        <span><b>Můžeš podnikat</b></span><br>
                        <span>seminář</span>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>

</template>