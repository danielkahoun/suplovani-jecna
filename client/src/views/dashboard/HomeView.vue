<script>
import BaseView from './BaseView.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

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
                date: null,
                data: null
            },
            teachers: null,
            subjects: null,
            openModal: false
        }
    },
    methods: {
        toggleModal() {
            this.$refs.btn.click();
            if (this.select.row != null && this.select.col != null)
                this.getSelected();
        },
        getSelected() {
            let row = JSON.parse(JSON.stringify(this.schedule[this.select.row]));
            this.select.data = row[this.select.col];
            this.select.data.date = this.dateFormat;
        },
        getSchedule() {
            const self = this;
            let url = import.meta.env.VITE_URL+"api/schedule/get";
            if(this.select.date != null) url += "/"+this.dateFormat;

            fetch(url, {
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
        },
        getTeachers() {
            const self = this;
            fetch(import.meta.env.VITE_URL+"api/schedule/getTeachers", {
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
                    self.teachers = data;
                });
        },
        getSubjects() {
            const self = this;
            fetch(import.meta.env.VITE_URL+"api/schedule/getSubjects", {
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
                    self.subjects = data;
                });
        },
        createSubstitution() {
            const self = this;
            fetch(import.meta.env.VITE_URL+"api/substitutions/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': self.$cookies.get("token")
                },
                body: JSON.stringify(this.select.data)
            })
            .then((response) => {
                if (response.ok) {
                    this.toggleModal();
                    this.select.data = null;
                    this.getSchedule();
                }
            });
        },
        updateSubstitution() {
            const self = this;
            fetch(import.meta.env.VITE_URL+"api/substitutions/update", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': self.$cookies.get("token")
                },
                body: JSON.stringify(this.select.data)
            })
            .then((response) => {
                if (response.ok) {
                    this.toggleModal();
                    this.select.data = null;
                    this.getSchedule();
                }
            });
        },
        deleteSubstitution() {
            const self = this;
            fetch(import.meta.env.VITE_URL+"api/substitutions/delete", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': self.$cookies.get("token")
                },
                body: JSON.stringify({id:this.select.data.substitution_id})
            })
            .then((response) => {
                if (response.ok) {
                    this.toggleModal();
                    this.select.data = null;
                    this.getSchedule();
                }
            });
        },
        getTeacherAbbr(name) {
            let value = name.split(" ");
            return value[1].slice(0, 2);
        }
    },
    computed: {
        dateFormat() {
            var d = new Date(this.select.date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;

            return [year, month, day].join('-');
        }
    },
    watch: {
        'select.date'(newValue) {
            if(!newValue) this.select.date = new Date();

            this.getSchedule();
        }
    },
    created() {
        if(this.user.role == 2) this.select.date = new Date();
    },
    updated() {
        if(this.user.role == 2) this.select.date = new Date();
    },
    mounted() {
        this.getSchedule();
        this.getTeachers();
        this.getSubjects();
    },
    components: { BaseView, VueDatePicker }
}
</script>

<template>
    <base-view>
        <button ref="btn" data-bs-toggle="modal" data-bs-target="#substitution" hidden></button>
            <div class="modal fade" id="substitution" tabindex="-1" aria-labelledby="substitutionLabel" aria-hidden="true"
                v-on:mouseleave="position.x = 0; position.y = 0;">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="substitutionLabel">Podrobnosti</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <table class="table table-bordered table-striped" v-if="this.select.data != null">
                                <thead>
                                    <tr class="bg-dark">
                                        <th colspan="2" class="text-white text-center" v-if="select.data.day == 1">pondělí - {{
                                            select.data.hour }}. hodina</th>
                                        <th colspan="2" class="text-white text-center" v-else-if="select.data.day == 2">úterý -
                                            {{ select.data.hour }}. hodina</th>
                                        <th colspan="2" class="text-white text-center" v-else-if="select.data.day == 3">středa -
                                            {{ select.data.hour }}. hodina</th>
                                        <th colspan="2" class="text-white text-center" v-else-if="select.data.day == 4">čtvrtek
                                            - {{ select.data.hour }}. hodina</th>
                                        <th colspan="2" class="text-white text-center" v-else-if="select.data.day == 5">pátek -
                                            {{ select.data.hour }}. hodina</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">Předmět</th>
                                        <td v-if="!select.data.new_subject_name">{{ select.data.subject_abbr }} - {{ select.data.subject_name }}</td>
                                        <td v-else><s>{{ select.data.subject_abbr }} - {{ select.data.subject_name }}</s><br><b>{{ select.data.new_subject_abbr }} - {{ select.data.new_subject_name }}</b></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Vyučující</th>
                                        <td v-if="!select.data.new_teacher_name">{{ select.data.teacher_name }}</td>
                                        <td v-else><s>{{ select.data.teacher_name }}</s><br><b>{{ select.data.new_teacher_name }}</b></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Třída</th>
                                        <td>{{ select.data.class }}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Učebna</th>
                                        <td v-if="!select.data.new_room">{{ select.data.room }}</td>
                                        <td v-else><s>{{ select.data.room }}</s><br><b>{{ select.data.new_room }}</b></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Změny v rozvrhu</th>
                                        <td class="fw-bold" style="color:#93c47d;" v-if="select.data.type == 'CANCELLED'">odpadá</td>
                                        <td class="fw-bold" style="color:#e06666;" v-else-if="select.data.type == 'CHANGE' && (select.data.new_subject_id || select.data.new_teacher_id || select.data.new_room)">
                                            <span class="comma" v-if="select.data.new_subject_id">předmět</span>
                                            <span class="comma" v-if="select.data.new_teacher_id">vyučující</span>
                                            <span class="comma" v-if="select.data.new_room">učebna</span>
                                        </td>
                                        <td class="fw-bold" style="color:#76a5af;" v-else-if="select.data.type == 'CUSTOM'">{{ (!select.data.custom_title) ? '<bez názvu>' : select.data.custom_title }}</td>
                                        <td v-else>žádné</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Detailní informace</th>
                                        <td>{{ (!select.data.information) ? 'žádné' : select.data.information }}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div v-if="this.user.role == 2">
                                <hr>
                                <h5 class="modal-title mb-3">Provést změnu</h5>
                                <div v-if="select.data != null">
                                    <div class="row mb-3">
                                        <div class="col">
                                            <label class="form-label">Typ změny</label>
                                            <select class="form-select" v-model="select.data.type">
                                                <option value="CANCELLED">zrušit hodinu (odpadá)</option>
                                                <option value="CHANGE">změna (učitele, učebny, předmětu)</option>
                                                <option value="CUSTOM">vlastní</option>
                                            </select>
                                        </div>
                                        <div class="col">
                                            <template v-if="select.data.type == 'CHANGE'">
                                                <label class="form-label">Změna předmětu</label>
                                                <select class="form-select" v-model="select.data.new_subject_id">
                                                    <option value=""></option>
                                                    <option v-for="subject in subjects" :value="subject.id">{{ subject.name }}</option>
                                                </select>
                                                <label class="form-label">Změna učitele</label>
                                                <select class="form-select mb-3" v-model="select.data.new_teacher_id">
                                                    <option value=""></option>
                                                    <option v-for="teacher in teachers" :value="teacher.id">{{ teacher.first_name+' '+teacher.last_name }}</option>
                                                </select>
                                                <label class="form-label">Změna učebny</label>
                                                <input type="text" class="form-control mb-3" placeholder="Učebna" v-model="select.data.new_room">
                                            </template>
                                            <template v-if="select.data.type == 'CUSTOM'">
                                                <label class="form-label">Název události</label>
                                                <input type="text" class="form-control" placeholder="vlastní název události" v-model="select.data.custom_title">
                                            </template>
                                        </div>
                                    </div>
                                    <label class="form-label">Doplňující informace (volitelné)</label>
                                    <input type="text" class="form-control" placeholder="Bližší informace" v-model="select.data.information">
                                    <button class="btn btn-primary mt-3" v-on:click="createSubstitution" v-if="select.data.substitution_id == null">Přidat změny</button>
                                    <button class="btn btn-primary mt-3" v-on:click="updateSubstitution" v-else>Uložit změny</button>
                                    <button class="btn btn-link mt-3" v-on:click="deleteSubstitution" v-if="select.data.substitution_id != null">Smazat</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="float-end">
                <VueDatePicker v-if="this.user.role == 2" v-model="select.date" locale="cs" select-text="Vybrat" cancel-text="Zrušit" :enable-time-picker="false" :disabled-week-days="[6, 0]" :format="dateFormat"></VueDatePicker>
            </div>
            <h3 class="mt-4">Přehled</h3>
            
            <hr>
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
                    <tr v-for="(value, key) in schedule"
                        v-on:mouseover="position.y = (this.user.role == 2) ? key : parseInt(key); select.row = (this.user.role == 2) ? key : parseInt(key);">
                        <td v-if="key == 1">pondělí<br></td>
                        <td v-else-if="key == 2">úterý<br></td>
                        <td v-else-if="key == 3">středa<br></td>
                        <td v-else-if="key == 4">čtvrtek<br></td>
                        <td v-else-if="key == 5">pátek<br></td>
                        <td v-else>{{ key }}</td>
                        <td class="p-0" v-for="i in 10" v-on:mouseover="position.x = i;"
                            :style="(position.x == i && position.y == key) && { backgroundColor: '#eeeeee', cursor: 'pointer' }"
                            >
                            <template v-for="x in 10">
                                <div class="w-100 h-100" v-if="(value[x-1] != null && value[x-1].hour == i)"
                                    v-on:mouseover="(value[x-1] != null && value[x-1].hour == i) ? select.col = (x-1) : select.col = null;"
                                    v-on:click="toggleModal"
                                    :style="[(value[x-1].type == 'CANCELLED') && { backgroundColor: '#d9ead3' },
                                            (value[x-1].type == 'CHANGE') && { backgroundColor: '#f4cccc' },
                                            (value[x-1].type == 'CUSTOM') && { backgroundColor: '#d0e0e3' }]">
                                    <div class="p-2">
                                        <div class="row">
                                            <div class="col text-start" v-if="this.user.role == 1">{{ value[x-1].class }}</div>
                                            <div class="col text-start" v-else>
                                                <template v-if="value[x-1].new_teacher_name != null">
                                                    <b>{{ getTeacherAbbr(value[x-1].new_teacher_name) }}</b>
                                                </template>
                                                <template v-else>
                                                    {{ getTeacherAbbr(value[x-1].teacher_name) }}
                                                </template>
                                            </div>
                                            <div class="col text-end">
                                                <template v-if="value[x-1].new_room != null">
                                                    <b>{{ value[x-1].new_room }}</b>
                                                </template>
                                                <template v-else>
                                                    {{ value[x-1].room }}
                                                </template>
                                            </div>
                                        </div>
                                        <div class="text-center">
                                            <template v-if="value[x-1].new_subject_abbr != null">
                                                <h5><s>{{ value[x-1].subject_abbr }}</s> <b>{{ value[x-1].new_subject_abbr }}</b></h5>
                                            </template>
                                            <template v-else>
                                                <h5>{{ value[x-1].subject_abbr }}</h5>
                                            </template>
                                        </div>
                                        <div class="row">
                                            <small class="col text-center" v-if="value[x-1].type == 'CANCELLED'">odpadá</small>
                                            <small class="col text-center" v-if="value[x-1].type == 'CHANGE'">změna</small>
                                            <small class="col text-center" v-if="value[x-1].type == 'CUSTOM'">{{ value[x-1].custom_title }}</small>
                                            <small class="col text-center invisible" v-if="value[x-1].type == null">status</small>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </td>
                </tr>
            </tbody>
        </table>
    </base-view>

</template>

<style>
.comma:not(:empty) ~ .comma:not(:empty):before {
    content: ", ";
}
</style>