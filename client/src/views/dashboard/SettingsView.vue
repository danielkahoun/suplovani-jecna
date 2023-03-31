<script>
import BaseView from './BaseView.vue';

export default {
    props: ['user'],
    data() {
        return {
            calendar_url: window.location.origin + '/ics/' + this.user.calendar_key
        }
    },
    components: { BaseView }
}
</script>

<template>
    <base-view>
        <h3 class="mt-4">Nastavení</h3>
        <hr>
        <h5>Integrace s kalendářem</h5>
        <p>Pro integraci s kalendářem použijte následující URL:</p>
        <div class="input-group mt-2">
            <span class="input-group-text">{{ calendar_url }}</span>
        </div>
    </base-view>
</template>