<template>
  <swiper :slides-per-view="2.1" :space-between="-10" style="position: relative;">
    <swiper-slide>
      <div class="swiper-card">
        <img src="../../public/assets/procedimento_teste.jpg" alt="">

        <div style="padding: 10px;border-top: 2px solid var(--ion-color-secondary);">
          <div
            style="font-family: Ubuntu;
            font-size: 15px;
            font-weight: 500;
            height: 70px;
            color: var(--ion-color-primary);
            overflow: ;" 
          >
            Novo procedimento disponível
        </div>
          <div 
            style="font-family: Ubuntu;
            font-size: 16px;
            font-weight: 400;
            margin-block: 15px;
            color: var(--ion-color-primary);" 
          >
            Toxina Botulínica
          </div>
          <div
          style="font-family: Ubuntu;
            font-size: 16px;
            font-weight: 500;
            color: var(--ion-color-secondary);" 
          >
            Saiba mais
          </div>
        </div>
      </div>
    </swiper-slide>
    <swiper-slide>
      <div class="swiper-card">
        <img src="../../public/assets/procedimento_teste.jpg" alt="">

        <div style="padding: 10px;border-top: 2px solid var(--ion-color-secondary);">
          <div 
            style="font-family: Ubuntu;
            font-size: 18px;
            font-weight: 500;
            color: var(--ion-color-primary);" 
          >
            Novo procedimento disponível  
          </div>
          <div 
            style="font-family: Ubuntu;
            font-size: 16px;
            font-weight: 400;
            margin-block: 15px;
            color: var(--ion-color-primary);" 
          >
            Toxina Botulínica
          </div>
          <div
          style="font-family: Ubuntu;
            font-size: 18px;
            font-weight: 500;
            color: var(--ion-color-secondary);" 
          >
            Saiba mais
          </div>
        </div>
      </div>
    </swiper-slide>
    <swiper-slide>
      <div class="swiper-card">
        <img src="../../public/assets/procedimento_teste.jpg" alt="">

        <div style="padding: 10px;border-top: 2px solid var(--ion-color-secondary);">
          <div 
            style="font-family: Ubuntu;
            font-size: 18px;
            font-weight: 500;
            color: var(--ion-color-primary);" 
          >
            Novo procedimento disponível  
          </div>
          <div 
            style="font-family: Ubuntu;
            font-size: 16px;
            font-weight: 400;
            margin-block: 15px;
            color: var(--ion-color-primary);" 
          >
            Toxina Botulínica
          </div>
          <div
          style="font-family: Ubuntu;
            font-size: 18px;
            font-weight: 500;
            color: var(--ion-color-secondary);" 
          >
            Saiba mais
          </div>
        </div>
      </div>
    </swiper-slide>

  </swiper>
</template>
<style>
.swiper-card {
  height: 290px;
  margin-inline:10px;
  border-radius: 0.4rem;
  overflow: hidden;
  background: var(--ion-color-tertiary);
}
</style>