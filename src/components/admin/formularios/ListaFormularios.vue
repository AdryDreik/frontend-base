<template>
  <section>
    <h3 class="primary--text"><v-icon color="primary">business</v-icon> Documentos</h3>
    <v-card>
      <crud-table
        :headers="headers"
        :url="url"
        :filters="filters"
        :path="path"
        :order="order"
        >
          <template slot="items" slot-scope="items">
            <td class="text-md-center">
              <v-tooltip bottom>
                <v-btn icon slot="activator" @click="editItem(items.item)">
                  <v-icon color="teal">check</v-icon>
                </v-btn>
                <span>Editar documento</span>
              </v-tooltip>
              <v-tooltip bottom>
                <v-btn icon slot="activator" @click="deleteItem(items.item)">
                  <v-icon color="red">delete</v-icon>
                </v-btn>
                <span>Eliminar documento</span>
              </v-tooltip>
              <v-tooltip bottom>
                <v-btn icon slot="activator">
                  <v-icon color="info">remove_red_eye</v-icon>
                </v-btn>
                <span>Vista previa</span>
              </v-tooltip>
              <v-tooltip bottom>
                <v-btn icon slot="activator">
                  <v-icon color="green">trending_up</v-icon>
                </v-btn>
                <span>Ver historial</span>
              </v-tooltip>
            </td>
            <td>{{ items.item.titulo}}</td>
            <td>{{ items.item.version}}</td>
            <td>{{ $datetime.format(items.item.createAt, 'dd/MM/YYYY') }}</td>
            <td>
              <v-switch
                value
                :input-value="items.item.activo"
                color="primary"
              ></v-switch>
            </td>
          </template>
        </crud-table>
    </v-card>
  </section>
</template>
<script>
import CrudTable from '@/common/util/crud-table/CrudTable.vue';
import crud from '@/common/util/crud-table/mixins/crud-table';
export default {
  mixins: [ crud ],
  data () {
    return {
      path: 'listado',
      filters: [{
        field: 'titulo',
        label: 'titulo',
        type: 'text',
        typeG: 'String'
      }],
      url: 'documentos_plantilla',
      order: ['titulo', 'DESC'],
      documentos: [],
      dialog: false,
      headers: [
        { text: this.$t('common.actions'), sortable: false, align: 'center' },
        { text: 'titulo', value: 'titulo' },
        { text: 'versión', value: 'version' },
        { text: 'fecha de creación', value: 'createAt' },
        { text: 'activo', value: 'activo' }
      ],
      items: []
    };
  },
  methods: {
    editItem (item) {
      this.$router.push({
        path: `formulario`,
        query: {
          id: item._id
        }
        // path: `documentos/${item._id}`
      });
    },
    deleteItem (item) {
      this.$confirm('¿Esta seguro de eliminar el documento?', () => {
        this.eliminarDocumento(item._id);
      });
    }
  },
  components: {
    CrudTable
  }
};
</script>
