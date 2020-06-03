// This sets up an event bus for components to publish and subscribe to messages
// It follows the pattern suggested at: https://alligator.io/vuejs/global-event-bus/
import Vue from 'vue'
export const EventBus = new Vue()
