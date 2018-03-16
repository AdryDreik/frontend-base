<template>
  <section>
    <h3 class="primary--text"><v-icon color="primary">business</v-icon> {{ $t('log.title') }}</h3>
    <v-card>
      <v-card-text>
        <crud-table
          :headers="headers"
          :url="url"
          :filters="filters"
          :order="order"
          :graphql="graphql"
          :data-graphql="dataGraphql"
        >
          <template slot="items" slot-scope="items">
            <td>
              <v-chip label color="error" text-color="white" v-if="items.item.nivel == 'ERROR'">
                {{ items.item.nivel }}
              </v-chip>
              <v-chip label color="warning" text-color="white" v-if="items.item.nivel == 'ADVERTENCIA'">
                {{ items.item.nivel }}
              </v-chip>
              <v-chip label color="info" text-color="white" v-if="items.item.nivel == 'INFO'">
                {{ items.item.nivel }}
              </v-chip>
            </td>
            <td>{{ items.item.tipo }}</td>
            <td>{{ items.item.mensaje }}</td>
            <td>{{ items.item.referencia }}</td>
            <td>{{ items.item.ip }}</td>
            <td>{{ $datetime.format(items.item.fecha, 'dd/MM/YYYY hrs. HH:mm') }}</td>
            <td>{{ items.item.usuario_usuario }}</td>
          </template>
        </crud-table>
      </v-card-text>
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
      graphql: true,
      url: 'logs',
      headers: [
        { text: this.$t('log.crud.nivel'), value: 'nivel' },
        { text: this.$t('log.crud.tipo'), value: 'tipo' },
        { text: this.$t('log.crud.mensaje'), value: 'mensaje' },
        { text: this.$t('log.crud.referencia'), value: 'referencia' },
        { text: this.$t('log.crud.ip'), value: 'ip' },
        { text: this.$t('log.crud.fecha'), value: 'fecha' },
        { text: this.$t('log.crud.id_usuario'), value: 'id_usuario' }
      ],
      order: ['fecha', 'DESC'],
      dataGraphql: `
        id
        nivel
        tipo
        mensaje
        referencia
        ip
        fecha
        id_usuario
        usuario_usuario
        usuario_nombres
        usuario_primer_apellido
        usuario_segundo_apellido
      `,
      filters: [
        {
          field: 'mensaje',
          label: this.$t('log.crud.mensaje'),
          type: 'text',
          typeG: 'String'
        },
        {
          field: 'tipo',
          label: this.$t('log.crud.tipo'),
          type: 'text',
          typeG: 'String'
        },
        {
          field: 'nivel',
          label: this.$t('log.crud.nivel'),
          type: 'select',
          typeG: 'NivelLog',
          items: [
            { value: '', text: 'TODOS' },
            { value: 'ERROR', text: 'ERROR' },
            { value: 'INFO', text: 'INFO' },
            { value: 'ADVERTENCIA', text: 'ADVERTENCIA' }
          ]
        }
      ]
    };
  },
  components: {
    CrudTable
  }
};
</script>
