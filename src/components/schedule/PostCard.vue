<template>
    <v-card class="my-2" elevation="2">
        <v-card-item>
            <div class="d-flex">
                <v-avatar :image="displayPicture" v-if="displayPicture" size="55" class="me-3"></v-avatar>
                <v-icon icon="mdi-account-circle" v-if="!displayPicture" size="55" class="me-3"></v-icon>
                <div class="text-subtitle-1">{{ firstName + " " + lastName }}<br>
                    <v-chip rounded prepend-icon="mdi-calendar" size="small">{{ formattedDate(publishDate) }}</v-chip>
                </div>

                <v-spacer></v-spacer>
                <v-menu location="bottom" v-if="userType==='A'">
                    <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-dots-horizontal" variant="text" size="small" v-bind="props"></v-btn>
                    </template>
                    <v-list>
                        <v-list-item @click="editPost">
                            <v-icon left>mdi-pencil</v-icon>
                            Edit
                        </v-list-item>
                        <v-list-item @click="deletePost">
                            <v-icon left>mdi-delete</v-icon>
                            Delete
                        </v-list-item>
                    </v-list>

                </v-menu>


            </div>

        </v-card-item>
        <v-card-text class="pb-0">
            {{ description }}
        </v-card-text>
        <v-card-text>
            <v-card class="mt-0" v-if="image != null">
                <v-img :src="image" cover></v-img>
            </v-card>
        </v-card-text>



    </v-card>
</template>

<script>
export default {
    props: {
        postId: Number,
        displayPicture: String,
        firstName: String,
        lastName: String,
        publishDate: String,
        description: String,
        image: String,
        userType: String,
    },
    methods: {
        formattedDate(dateInput) {
            const date = new Date(dateInput);
            const year = String(date.getUTCFullYear());
            const monthNames = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            const month = monthNames[date.getUTCMonth()];
            const day = String(date.getUTCDate());
            return `${day} ${month} ${year}`;
        },
        editPost() {
            this.$emit('editPost',  this.postId)
        },
        deletePost() {
            this.$emit('deletePost', this.postId)
        }
    },


}
</script>

<style lang="scss" scoped></style>