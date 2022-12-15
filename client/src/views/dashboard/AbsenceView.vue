<script>
import NavbarComponent from '../../components/NavbarComponent.vue';

export default {
    props: ['user'],
    data() {
        return {
        };
    },
    components: { NavbarComponent }
}
</script>

<template>

    <NavbarComponent :user="user" />

    <div class="container">
        <h3>Absence učitelů</h3>
        <hr>
    </div>

</template>