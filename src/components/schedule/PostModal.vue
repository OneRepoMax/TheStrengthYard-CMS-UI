<template>
    <v-dialog max-width="600px" @input="$emit('input', $event)">
        <v-card :title="this.title">
            <template v-slot:append>
                <v-btn icon="$close" variant="text" @click="this.$emit('closeModal')"></v-btn>
            </template>
            <v-divider></v-divider>
            <v-card-item>
                <div class="d-flex">
                    <v-avatar :image="userStore.displayPicture" v-if="userStore.displayPicture" size="55"
                        class="me-3"></v-avatar>
                    <v-icon icon="mdi-account-circle" v-if="!userStore.displayPicture" size="55" class="me-3"></v-icon>
                    <div class="text-subtitle-1">{{ userStore.firstName + " " + userStore.lastName }}<br>
                        <v-chip rounded prepend-icon="mdi-earth" size="small">visible to everyone</v-chip>
                    </div>
                </div>
            </v-card-item>
            <v-card-item>
                <v-textarea placeholder="What do you want to talk about?" variant="text" clearable auto-grow rows="1"
                    hide-details="auto" row-height="15" v-model="description"></v-textarea>
                <v-card class="my-3">
                    <v-img :src="postImage" height="300" cover v-if="image != null"></v-img>
                </v-card>
                <v-file-input label="Add an image" prepend-icon="" prepend-inner-icon="mdi-image" variant="outlined"
                    :rules="imageRules" accept="image/*" @change="handleFileUpload"></v-file-input>
            </v-card-item>

            <v-divider></v-divider>
            <v-card-text>
                <v-btn block color="teal" class="mb-5" @click="createPost()">Post</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
    
</template>
    
<script>
import { useUserStore } from '@/store/user'
import { useMembershipStore } from '@/store/membership'
import { useScheduleStore } from '@/store/schedule'


export default {
    props: {
        value: Boolean,
        path: String,
        title: String,
        message: String,
        closeOnClick: Boolean
    },

    setup() {
        const userStore = useUserStore()
        const membershipStore = useMembershipStore()
        const scheduleStore = useScheduleStore()

        return { userStore, membershipStore, scheduleStore }
    },
    data() {
        return {
            description: null,
            image: null,
            postImage: null,
            imageRules: [v => (v == null) || 'This field is required'],
            modal: {
                show: false,
                type: "success",
                icon: "mdi-check-circle",
                title: "Post created successfully",
                message: "Your post has been successfully created!",
                path: "/schedule"
            },
        }
    },
    methods: {
        navigate(path) {
            if (this.closeOnClick) {
                this.$emit('closeModal')
            } else {
                this.$router.push(path)
            }
        },
        handleFileUpload(event) {
            const file = event.target.files[0];

            if (file) {
                // Handle the file upload logic here.
                // You can send the file to a server for processing or display it locally.
                console.log('Selected file:', file);

                // Optionally, if you want to display the selected image locally:
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = () => {
                    this.postImage = reader.result;
                };

                this.image = file
            }
        },
        closeModal() {
            this.modal.show = false
        },
        async createPost() {
            try {
                const uploadResponse = await this.membershipStore.uploadPicture(this.image)
                this.postImage = uploadResponse.s3Uri
                const payload = {
                    UserId: this.userStore.userId,
                    Description: this.description,
                    ImgUrl: this.postImage
                }
                const response = await this.scheduleStore.postSchedule(payload)

                if (response.status == 200) {
                    console.log("Success");
                    this.$emit('closeModal')
                    this.modal.show = true
                }

            } catch (error) {
                console.log(error);
            }
        }
    }
}
</script>
