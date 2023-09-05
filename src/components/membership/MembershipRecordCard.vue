<template>
    <div class="scroll-container" ref="outerContainer">
        <div class="scroll-content" ref="innerContainer">
            <v-btn @click="scrollLeft" class="arrow-button left" icon :class="{ 'hidden': scrollPosition === 0 }">">
                <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <template v-for="membership in membershipRecord">
                <v-card max-width="300px" variant="flat" class="me-3">
                    <v-img :src="membership.Membership.Picture">
                    </v-img>
                    <v-card-title class="text-subtitle-1">
                        <p class="text-wrap">
                            {{ membership.Membership.Title }}
                        </p>
                    </v-card-title>
                    <v-card-subtitle>
                        <div class="d-flex flex-wrap">
                            <v-chip v-if="membership.ActiveStatus.toUpperCase() == 'INACTIVE'
                                || membership.ActiveStatus.toUpperCase() == 'EXPIRED'
                                || membership.ActiveStatus.toUpperCase() == 'PENDING PAYMENT'" color="secondary"
                                prepend-icon="mdi-close" class="me-3 mb-3">
                                {{ membership.ActiveStatus }}
                            </v-chip>
                            <v-chip v-if="membership.ActiveStatus.toUpperCase() == 'ACTIVE'" color="primary"
                                prepend-icon="mdi-check" class="me-3 mb-3">
                                {{ membership.ActiveStatus }}
                            </v-chip>
                            <v-chip v-if="membership.ActiveStatus.toUpperCase() == 'PAUSED'" color="orange"
                                prepend-icon="mdi-pause" class="me-3 mb-3">
                                {{ membership.ActiveStatus }}
                            </v-chip>
                            <v-chip class="me-3 mb-3">
                                {{ membership.Membership.Type }}
                            </v-chip>
                            <v-chip class="me-3 mb-3">
                                Base Fee: {{ membership.Membership.BaseFee }}
                            </v-chip>
                            <v-chip class="me-3 mb-3">
                                Membership Record ID: {{ membership.MembershipRecordId }}
                            </v-chip>
                            <v-chip>
                                <v-icon icon="mdi-calendar" size="18" color="error" class="me-1 pb-1"></v-icon>
                                {{ formattedDate(membership.StartDate) }} to {{ formattedDate(membership.EndDate) }}
                            </v-chip>
                        </div>

                    </v-card-subtitle>
                </v-card>
            </template>
            <v-btn @click="scrollRight" class="arrow-button right" icon
                :class="{ 'hidden': scrollPosition === maxScrollPosition }">
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            scrollPosition: 0,
            maxScrollPosition: null,
        }
    },
    props: {
        membershipRecord: Array
    },
    mounted() {
        this.scrollPosition = 0;
    },
    methods: {
        formattedDate(dateInput) {
            const date = new Date(dateInput);
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, "0");
            const day = String(date.getUTCDate()).padStart(2, "0");
            return `${day}-${month}-${year}`;
        },
        scrollLeft() {
            const innerContainer = this.$refs.innerContainer;
            if (innerContainer) {
                this.scrollPosition += 300; 
                if (this.scrollPosition > 0) {
                    this.scrollPosition = 0;
                }
                innerContainer.style.transform = `translateX(${this.scrollPosition}px)`;
                this.calculateMaxScrollPosition(innerContainer);
            }
        },
        scrollRight() {
            const innerContainer = this.$refs.innerContainer;
            if (innerContainer) {
                this.scrollPosition -= 500; 
                const outerContainer = this.$refs.outerContainer;
                const maxScrollWidth = innerContainer.scrollWidth - outerContainer.offsetWidth;
                if (this.scrollPosition < -maxScrollWidth) {
                    this.scrollPosition = -maxScrollWidth;
                }
                innerContainer.style.transform = `translateX(${this.scrollPosition}px)`;
                this.calculateMaxScrollPosition(innerContainer);
            }
        },
        calculateMaxScrollPosition(innerContainer) {
            const outerContainer = this.$refs.outerContainer;
            const maxScrollWidth = innerContainer.scrollWidth - outerContainer.offsetWidth;
            this.maxScrollPosition = maxScrollWidth > 0 ? -maxScrollWidth : 0;
        },
    },
    watch: {
        scrollPosition(newValue) {
            console.log(newValue);
            // Ensure maxScrollPosition is always recalculated when scrollPosition changes
            this.calculateMaxScrollPosition(this.$refs.innerContainer);
        },
    },
}
</script>
<style lang="scss" scoped>
.scroll-container {
    display: flex;
    overflow: hidden;
    scroll-behavior: smooth;
    position: relative;
}

.scroll-content {
    display: flex;
    transition: transform 0.3s ease;
}

.arrow-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
}

.arrow-button.left {
    left: 0;
}

.arrow-button.right {
    right: 0;
}

.hidden {
    display: none;
}
</style>








