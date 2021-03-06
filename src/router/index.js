import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/components/admin/Dashboard/Dashboard';
import AppNotFound from '@/common/layout/pages/AppNotFound';
import AppForbidden from '@/common/layout/pages/AppForbidden';
import AppError from '@/common/layout/pages/AppError';

// System
import Login from '@/components/admin/auth/Login';
import LoginCiudadania from '@/components/admin/auth/LoginCiudadania';
import LoginNit from '@/components/admin/auth/LoginNit';
import Account from '@/components/admin/account/Account';
import Entidad from '@/components/admin/entidad/Entidad';
import Usuario from '@/components/admin/usuario/Usuario';
import Modulo from '@/components/admin/modulo/Modulo';
import Preferencias from '@/components/admin/preferencias/Preferencias';
import Log from '@/components/admin/Log';

// Components
import DocumentosPlantilla from '@/components/admin/documentos_plantilla/documentos_plantilla';
import Formulario from '@/components/admin/formularios/Formularios';
import ListaFlujos from '@/components/admin/flujos/listaFlujos';
import pdfsFirmados from '@/components/admin/pdfs-firmados/pdf';
import Diagramador from '@/components/admin/flujos/diagramador';
import Grupo from '@/components/admin/grupo/grupo';
import Institucion from '@/components/admin/institucion/institucion';
import Plugin from '@/components/plugins/plugins';
// Importando editor de validaciones
import EditorValidaciones from '@/components/admin/editor/editor_validaciones';
// Instanciador
import DiagramadorInstanciador from '@/components/admin/flujos/diagramadorInstanciador';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/documentos_plantilla',
      name: 'Lista de documentos Plantilla',
      component: DocumentosPlantilla
    },
    {
      path: '/formularios/:id',
      name: 'Edicion de formularios',
      component: Formulario
    },
    {
      path: '/instituciones',
      name: 'Institucion',
      component: Institucion
    },
    {
      path: '/usuarios',
      name: 'Usuario',
      component: Usuario
    },
    {
      path: '/plugins',
      name: 'plugins',
      component: Plugin
    },
    {
      path: '/editor_de_validaciones',
      name: 'Editor de validaciones',
      component: EditorValidaciones
    },
    {
      path: '/formularios',
      name: 'Formulario',
      component: Formulario
    },
    {
      path: '/instanciador-flujos',
      name: 'Editor de Flujo Instanciador',
      component: DiagramadorInstanciador
    },
    {
      path: '/documentos-firmados',
      name: 'Documentos firmados',
      component: pdfsFirmados
    },
    {
      path: '/lista_flujos',
      name: 'Lista flujos',
      component: ListaFlujos
    },
    {
      path: '/grupos',
      name: 'Grupo',
      component: Grupo
    },
    {
      path: '/editor_flujos',
      name: 'Editor de Flujo',
      component: Diagramador
    },
    {
      path: '/login-ciudadania',
      name: 'LoginCiudadania',
      component: LoginCiudadania
    },
    {
      path: '/login-nit',
      name: 'LoginNit',
      component: LoginNit
    },
    {
      path: '/usuarios',
      name: 'Usuario',
      component: Usuario
    },
    {
      path: '/account',
      name: 'Account',
      component: Account
    },
    {
      path: '/entidades',
      name: 'Entidad',
      component: Entidad
    },
    {
      path: '/parametros',
      name: 'Preferencias',
      component: Preferencias
    },
    {
      path: '/modulos',
      name: 'Módulo',
      component: Modulo
    },
    {
      path: '/logs',
      name: 'Logs',
      component: Log
    },
    {
      path: '/404',
      component: AppNotFound
    },
    {
      path: '/403',
      component: AppForbidden
    },
    {
      path: '/500',
      component: AppError
    },
    {
      path: '*',
      component: AppNotFound
    }
  ]
});
