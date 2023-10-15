<template>
    <v-container style="max-width: 1000px;">
        <v-card elevation="3" v-if="userStore.userType == 'A'">

            <v-card-item>
                <div class="d-flex">
                    <v-avatar :image="userStore.displayPicture" v-if="userStore.displayPicture" size="38"></v-avatar>
                    <v-icon icon="mdi-account-circle" v-if="!userStore.displayPicture" size="38"></v-icon>
                    <div class="w-100">
                        <v-btn variant="outlined" block prepend-icon="mdi-plus" class="text-subtitle-1"
                            @click="postModal.show = true;" rounded>Create new post...</v-btn>
                    </div>
                </div>
            </v-card-item>

        </v-card>

        <v-divider class="my-3" v-if="userStore.userType == 'A'"></v-divider>
        <template v-for="post in posts" :key="post.ScheduleId">
            <post-card :displayPicture="post.User.DisplayPicture" :firstName="post.User.FirstName"
                :lastName="post.User.LastName" :publishDate="post.PublishDate" :description="post.Description"
                :image="post.ImgUrl" :userType="userStore.userType" :postId="post.ScheduleId" @editPost="editPost"
                @deletePost="showModalWarning" />

        </template>

    </v-container>

    <!-- Modal -->
    <post-modal @closeModal="closeModal" v-model="postModal.show" :title="postModal.title" />

    <template v-if="modalWarning.show">
        <ModalWarning v-model="modalWarning.show" :title="modalWarning.title" :message="modalWarning.message"
            :icon="modalWarning.icon" @closeModal="closeModalWarning" @action="deletePost" :color="modalWarning.color" />
    </template>

    <template v-if="modal.show">
        <Modal v-model="modal.show" :path="modal.path" :title="modal.title" :message="modal.message" :icon="modal.icon"
            @closeModal="closeCommonModal" :closeOnClick="true" />
    </template>
</template>

<script>
import PostCard from '@/components/schedule/PostCard.vue'
import PostModal from '@/components/schedule/PostModal.vue'
import ModalWarning from '@/components/common/ModalWarning.vue';
import Modal from '@/components/common/Modal.vue';

import { useScheduleStore } from '@/store/schedule'
import { useUserStore } from '@/store/user'


export default {
    setup() {
        const scheduleStore = useScheduleStore()
        const userStore = useUserStore()

        return { scheduleStore, userStore }
    },
    data() {
        return {
            postModal: {
                show: false,
                title: "Create new post"
            },
            loading: false,
            posts: [],
            modalWarning: {
                show: false,
                type: "success",
                icon: "mdi-alert",
                title: "Confirm deletion?",
                message: "This action cannot be undone",
                path: "/admin/account",
                color: "red"
            },
            modal: {
                show: false,
                type: "Delete success",
                icon: "mdi-check-circle",
                title: "",
                message: "",
                path: "/schedule",
            },
            selectedPostId: null,
        }
    },
    components: {
        PostCard,
        PostModal,
        ModalWarning,
        Modal
    },
    mounted() {
        this.getPosts()
    },
    methods: {
        async getPosts() {
            this.loading = true;
            const response = await this.scheduleStore.getSchedule()
            this.loading = false;

            if (response.status == 200) {
                this.posts = response.data
            }
        },
        closeModal() {
            this.postModal.show = false
            location.reload()
        },
        closeCommonModal() {
            this.modal.show = false
            location.reload()
        },
        closeModalWarning() {
            this.modalWarning.show = false
            location.reload()
        },
        editPost(postId) {
            console.log(postId);
        },
        showModalWarning(postId) {
            this.selectedPostId = postId
            this.modalWarning.show = true
        },
        async deletePost() {
            this.modalWarning.show = false
            const response = await this.scheduleStore.deleteScheduleById(this.selectedPostId)
            if (response.status == 200) {
                this.modal.title = "Success";
                this.modal.message = "Post has been deleted!";
                this.modal.show = true
            }
        }
    },
}
</script>

<style lang="scss" scoped></style>