<template>
  <v-container>
    <div v-for="(item, index) of ItemsMenu" :key="index" class="mt-6">
      <v-hover v-slot:default="{ hover }">
        <v-card
          elevation="12"
          :class="hover ? 'blue lighten-4' : 'green lighten-5'"
          hover
          height="100px"
          @click="$router.push({ path: item.path })"
        >
          <v-card-title>
            <v-icon class="ml-12 mt-4 justify-start" large>
              {{ item.icon }}
            </v-icon>
            <span class="mt-4" style="margin: auto">{{ item.name }}</span>
          </v-card-title>
        </v-card>
      </v-hover>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  computed: {
    ItemsMenu() {
      return [
        { path: '/genqr', name: 'Adicionar Bagagem', icon: 'add' },
        { path: '/scan', name: 'Escanear Bagagens', icon: 'photo_camera' },
        { path: '/flights', name: 'Voos', icon: 'edit' },
        {
          path: '/bases',
          name: 'Origens e Destinos',
          icon: 'airplane_ticket',
        },
        { path: '/planes', name: 'Aeronaves', icon: 'airplanemode_active' },
        { path: '/history', name: 'Histórico', icon: 'history' },
      ];
    },
  },
};
</script>
