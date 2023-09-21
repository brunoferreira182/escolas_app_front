<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>

<style>

ion-button {
  text-transform: none;
  --border-radius: 0.3rem
}


ion-item {
  --placeholder-color: var(--ion-color-medium)
}

* {
  font-family: Ubuntu;
  font-weight: 400;
}
.text-transform-none{
  text-transform: none;
}
.q-gutter-md{
  padding: 10px 0; /* Padding no sentido Y */
}
.text-primary {
  color: var(--ion-color-primary);
}
.text-secondary {
  color: var(--ion-color-secondary);
}

.q-pa-none {
  padding: 0
}

.q-pl-none {
  padding-left: 0
}

.q-pr-none {
  padding-right: 0
}

.q-pt-none {
  padding-top: 0
}

.q-pb-none {
  padding-bottom: 0
}

.q-px-none {
  padding-left: 0;
  padding-right: 0
}

.q-py-none {
  padding-top: 0;
  padding-bottom: 0
}

.q-ma-none {
  margin: 0
}

.q-ml-none {
  margin-left: 0
}

.q-mr-none {
  margin-right: 0
}

.q-mt-none {
  margin-top: 0
}

.q-mb-none {
  margin-bottom: 0
}

.q-mx-none {
  margin-left: 0;
  margin-right: 0
}

.q-my-none {
  margin-top: 0;
  margin-bottom: 0
}

.q-pa-xs {
  padding: 4px
}

.q-pl-xs {
  padding-left: 4px
}

.q-pr-xs {
  padding-right: 4px
}

.q-pt-xs {
  padding-top: 4px
}

.q-pb-xs {
  padding-bottom: 4px
}

.q-px-xs {
  padding-left: 4px;
  padding-right: 4px
}

.q-py-xs {
  padding-top: 4px;
  padding-bottom: 4px
}

.q-ma-xs {
  margin: 4px
}

.q-ml-xs {
  margin-left: 4px
}

.q-mr-xs {
  margin-right: 4px
}

.q-mt-xs {
  margin-top: 4px
}

.q-mb-xs {
  margin-bottom: 4px
}

.q-mx-xs {
  margin-left: 4px;
  margin-right: 4px
}

.q-my-xs {
  margin-top: 4px;
  margin-bottom: 4px
}

.q-pa-sm {
  padding: 8px
}

.q-pl-sm {
  padding-left: 8px
}

.q-pr-sm {
  padding-right: 8px
}

.q-pt-sm {
  padding-top: 8px
}

.q-pb-sm {
  padding-bottom: 8px
}

.q-px-sm {
  padding-left: 8px;
  padding-right: 8px
}

.q-py-sm {
  padding-top: 8px;
  padding-bottom: 8px
}

.q-ma-sm {
  margin: 8px
}

.q-ml-sm {
  margin-left: 8px
}

.q-mr-sm {
  margin-right: 8px
}

.q-mt-sm {
  margin-top: 8px
}

.q-mb-sm {
  margin-bottom: 8px
}

.q-mx-sm {
  margin-left: 8px;
  margin-right: 8px
}

.q-my-sm {
  margin-top: 8px;
  margin-bottom: 8px
}

.q-pa-md {
  padding: 16px
}

.q-pl-md {
  padding-left: 16px
}

.q-pr-md {
  padding-right: 16px
}

.q-pt-md {
  padding-top: 16px
}

.q-pb-md {
  padding-bottom: 16px
}

.q-px-md {
  padding-left: 16px;
  padding-right: 16px
}

.q-py-md {
  padding-top: 16px;
  padding-bottom: 16px
}

.q-ma-md {
  margin: 16px
}

.q-ml-md {
  margin-left: 16px
}

.q-mr-md {
  margin-right: 16px
}

.q-mt-md {
  margin-top: 16px
}

.q-mb-md {
  margin-bottom: 16px
}

.q-mx-md {
  margin-left: 16px;
  margin-right: 16px
}

.q-my-md {
  margin-top: 16px;
  margin-bottom: 16px
}

.q-pa-lg {
  padding: 24px
}

.q-pl-lg {
  padding-left: 24px
}

.q-pr-lg {
  padding-right: 24px
}

.q-pt-lg {
  padding-top: 24px
}

.q-pb-lg {
  padding-bottom: 24px
}

.q-px-lg {
  padding-left: 24px;
  padding-right: 24px
}

.q-py-lg {
  padding-top: 24px;
  padding-bottom: 24px
}

.q-ma-lg {
  margin: 24px
}

.q-ml-lg {
  margin-left: 24px
}

.q-mr-lg {
  margin-right: 24px
}

.q-mt-lg {
  margin-top: 24px
}

.q-mb-lg {
  margin-bottom: 24px
}

.q-mx-lg {
  margin-left: 24px;
  margin-right: 24px
}

.q-my-lg {
  margin-top: 24px;
  margin-bottom: 24px
}

.q-pa-xl {
  padding: 48px
}

.q-pl-xl {
  padding-left: 48px
}

.q-pr-xl {
  padding-right: 48px
}

.q-pt-xl {
  padding-top: 48px
}

.q-pb-xl {
  padding-bottom: 48px
}

.q-px-xl {
  padding-left: 48px;
  padding-right: 48px
}

.q-py-xl {
  padding-top: 48px;
  padding-bottom: 48px
}

.q-ma-xl {
  margin: 48px
}

.q-ml-xl {
  margin-left: 48px
}

.q-mr-xl {
  margin-right: 48px
}

.q-mt-xl {
  margin-top: 48px
}

.q-mb-xl {
  margin-bottom: 48px
}

.q-mx-xl {
  margin-left: 48px;
  margin-right: 48px
}

.q-my-xl {
  margin-top: 48px;
  margin-bottom: 48px
}

.q-mt-auto,
.q-my-auto {
  margin-top: auto
}

.q-ml-auto {
  margin-left: auto
}

.q-mb-auto,
.q-my-auto {
  margin-bottom: auto
}

.q-mr-auto {
  margin-right: auto
}

.q-mx-auto {
  margin-left: auto;
  margin-right: auto
}


/* letras */
.text-h1 {
  font-size: 6rem;
  font-weight: 300;
  line-height: 6rem;
  letter-spacing: -0.01562em;
}
.text-h2 {
  font-size: 3.75rem;
  font-weight: 300;
  line-height: 3.75rem;
  letter-spacing: -0.00833em;
}
.text-h3 {
  font-size: 3rem;
  font-weight: 400;
  line-height: 3.125rem;
  letter-spacing: normal;
}
.text-h4 {
  font-size: 2.125rem;
  font-weight: 400;
  line-height: 2.5rem;
  letter-spacing: 0.00735em;
}
.text-h5 {
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal;
}
.text-h6 {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 2rem;
  letter-spacing: 0.0125em;
}
.text-h7 {
  font-size: 1.0 rem;
  font-weight: 500;
  line-height: 2rem;
  letter-spacing: 0.0125em;
}
.text-subtitle1 {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.75rem;
  letter-spacing: 0.00937em;
}
.text-subtitle2 {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.375rem;
  letter-spacing: 0.00714em;
}
.text-body1 {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
  letter-spacing: 0.03125em;
}
.text-body2 {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  letter-spacing: 0.01786em;
}
.text-overline {
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 2rem;
  letter-spacing: 0.16667em;
}
.text-caption {
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.25rem;
  letter-spacing: 0.03333em;
}
.text-uppercase {
  text-transform: uppercase;
}
.text-lowercase {
  text-transform: lowercase;
}
.text-capitalize {
  text-transform: capitalize;
}
</style>