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
        <h3>Rozvrh</h3>
        <hr>
        <p>Tady zatím nic nebude</p>
    </div>

</template>