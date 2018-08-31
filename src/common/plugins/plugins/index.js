
      'use strict';
      /* eslint-disable */
      
	import autocompletado_html from './autocompletado/html/autocompletado html.vue';

	import autocompletado_pdf from './autocompletado/pdf/autocompletado pdf.vue';

	import casilla_de_verificacion_html from './casilla de verificacion/html/casilla de verificacion html.vue';

	import casilla_de_verificacion_pdf from './casilla de verificacion/pdf/casilla de verificacion pdf.vue';

	import cite_html from './cite/html/cite html.vue';

	import cite_pdf from './cite/pdf/cite pdf.vue';

	import fecha_html from './fecha/html/fecha html.vue';

	import fecha_pdf from './fecha/pdf/fecha pdf.vue';

	import grid_html from './grid/html/grid html.vue';

	import grid_pdf from './grid/pdf/grid pdf.vue';

  import interoperabilidad_html from './interoperabilidad/html/interoperabilidad html.vue';

  import interoperabilidad_pdf from './interoperabilidad/pdf/interoperabilidad pdf.vue';

	import input_html from './input/html/input html.vue';

	import input_pdf from './input/pdf/input pdf.vue';

	import lista_desplegable_html from './lista desplegable/html/lista desplegable html.vue';

	import lista_desplegable_pdf from './lista desplegable/pdf/lista desplegable pdf.vue';

	import parrafo_html from './parrafo/html/parrafo html.vue';

	import parrafo_pdf from './parrafo/pdf/parrafo pdf.vue';

	import persona_html from './persona/html/persona html.vue';

	import persona_pdf from './persona/pdf/persona pdf.vue';

	import persona_societario_html from './persona societario/html/persona societario html.vue';

	import persona_societario_pdf from './persona societario/pdf/persona societario pdf.vue';

	import comodin_html from './comodin/html/comodin html.vue';

	import comodin_pdf from './comodin/pdf/comodin pdf.vue';

	import seleccion_radio_html from './seleccion radio/html/seleccion radio html.vue';

	import seleccion_radio_pdf from './seleccion radio/pdf/seleccion radio pdf.vue';

	import subir_archivo_html from './subir archivos/html/subir archivo html.vue';

	import subir_archivo_pdf from './subir archivos/pdf/subir archivo pdf.vue';

	import texto_html from './texto/html/texto html.vue';

	import texto_pdf from './texto/pdf/texto pdf.vue';

	import ubicacion_html from './ubicacion/html/ubicacion html.vue';

	import ubicacion_pdf from './ubicacion/pdf/ubicacion pdf.vue';

	import numero_cite_html from './numero cite/html/numero cite html.vue';

	import numero_cite_pdf from './numero cite/pdf/numero cite pdf.vue';

	import actividades_economicas_html from './actividades economicas/html/actividades economicas html.vue';

	import actividades_economicas_pdf from './actividades economicas/pdf/actividades economicas pdf.vue';

  import componente_homonimia_html from './componente homonimia/html/componente homonimia html.vue';

	import componente_homonimia_pdf from './componente homonimia/pdf/componente homonimia pdf.vue';
	
	import editor_de_textos_html from './editor de textos/html/editor de textos html.vue';

	import editor_de_textos_pdf from './editor de textos/pdf/editor de textos pdf.vue';

	import VueFormly from '../../util/vue-formly/src'
		export default {
			install (Vue, options) {
				Vue.use(VueFormly);
				VueFormly.addType('autocompletado_html', autocompletado_html);
				VueFormly.addType('autocompletado_pdf', autocompletado_pdf);
				VueFormly.addType('casilla_de_verificacion_html', casilla_de_verificacion_html);
				VueFormly.addType('casilla_de_verificacion_pdf', casilla_de_verificacion_pdf);
				VueFormly.addType('cite_html', cite_html);
				VueFormly.addType('cite_pdf', cite_pdf);
				VueFormly.addType('fecha_html', fecha_html);
				VueFormly.addType('fecha_pdf', fecha_pdf);
				VueFormly.addType('grid_html', grid_html);
				VueFormly.addType('grid_pdf', grid_pdf);
				VueFormly.addType('interoperabilidad_html', interoperabilidad_html);
				VueFormly.addType('interoperabilidad_pdf', interoperabilidad_pdf);
				VueFormly.addType('input_html', input_html);
				VueFormly.addType('input_pdf', input_pdf);
				VueFormly.addType('comodin_html', comodin_html);
				VueFormly.addType('comodin_pdf', comodin_pdf);
				VueFormly.addType('input_pdf', input_pdf);
				VueFormly.addType('lista_desplegable_html', lista_desplegable_html);
				VueFormly.addType('lista_desplegable_pdf', lista_desplegable_pdf);
				VueFormly.addType('parrafo_html', parrafo_html);
				VueFormly.addType('parrafo_pdf', parrafo_pdf);
				VueFormly.addType('persona_html', persona_html);
				VueFormly.addType('persona_pdf', persona_pdf);
				VueFormly.addType('seleccion_radio_html', seleccion_radio_html);
				VueFormly.addType('seleccion_radio_pdf', seleccion_radio_pdf);
				VueFormly.addType('subir_archivo_html', subir_archivo_html);
				VueFormly.addType('subir_archivo_pdf', subir_archivo_pdf);
				VueFormly.addType('texto_html', texto_html);
				VueFormly.addType('texto_pdf', texto_pdf);
				VueFormly.addType('ubicacion_html', ubicacion_html);
				VueFormly.addType('ubicacion_pdf', ubicacion_pdf);
				VueFormly.addType('numero_cite_html', numero_cite_html);
				VueFormly.addType('numero_cite_pdf', numero_cite_pdf);
				VueFormly.addType('persona_societario_html', persona_societario_html);
				VueFormly.addType('persona_societario_pdf', persona_societario_pdf);
				VueFormly.addType('actividades_economicas_html', actividades_economicas_html);
				VueFormly.addType('actividades_economicas_pdf', actividades_economicas_pdf);
				VueFormly.addType('componente_homonimia_html', componente_homonimia_html);
				VueFormly.addType('componente_homonimia_pdf', componente_homonimia_pdf);
				VueFormly.addType('editor_de_textos_html', editor_de_textos_html);
				VueFormly.addType('editor_de_textos_pdf', editor_de_textos_pdf);
		}};