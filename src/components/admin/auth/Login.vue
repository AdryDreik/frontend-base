<template>
  <section>
    <div class="top-login"></div>
    <div class="bottom-login"></div>
      <!-- <div class="backgroundBPM"></div> -->
    <v-card class="login-form">
       <v-form
          @submit.prevent="submit"
          v-model="valid"
          ref="form"
          lazy-validation
        >

            <!-- <v-card-title primary-title> -->
            <!-- <h4>{{ $t('login.title') }}</h4> -->
            <!-- <v-container fluid> -->
            <!--   <v-layout row wrap> -->
            <!--     <v-flex xs12> -->
            <!--       <v-text-field -->
            <!--         name="username" -->
            <!--         :label="$t('login.user')" -->
            <!--         id="username" -->
            <!--         append-icon="person" -->
            <!--         v-model="form.username" -->
            <!--         autofocus -->
            <!--         maxlength="25" -->
            <!--         :rules="$validate(['requerido'])" -->
            <!--         required -->
            <!--       ></v-text-field> -->
            <!--     </v-flex> -->
            <!--     <v-flex xs12> -->
            <!--       <v-text-field -->
            <!--         name="password" -->
            <!--         :label="$t('login.password')" -->
            <!--         id="password" -->
            <!--         append-icon="lock" -->
            <!--         :append-icon="getIcon" -->
            <!--         :append-icon-cb="changeIcon" -->
            <!--         :type="hidePass ? 'password' : 'text'" -->
            <!--         v-model="form.password" -->
            <!--         maxlength="100" -->
            <!--         :rules="$validate(['requerido'])" -->
            <!--         required -->
            <!--       ></v-text-field> -->
            <!--     </v-flex> -->
            <!--   </v-layout> -->
            <!-- </v-container> -->
          <!-- </v-card-title> -->
          <!-- <v-card-actions> -->
            <!-- <v-btn -->
            <!--   color="primary" -->
            <!--   block -->
            <!--   large -->
            <!--   :disabled="!valid" -->
            <!--   type="submit" -->
            <!-- >{{ $t('login.login') }}</v-btn> -->
          <!-- </v-card-actions> -->

        <v-container>
          <v-layout row wrap>
            <v-flex>
              <div class="logoOPENFLOW"></div>
              <v-card-title primary-title>
                <h4 class="white--text loginTitle">{{ $t('login.title') }}</h4>
              </v-card-title>
              <v-text-field
                    name="username"
                    :label="$t('login.user')"
                    id="username"
                    append-icon="person"
                    v-model="form.username"
                    autofocus
                    maxlength="25"
                    :rules="$validate(['requerido'])"
                    required
                  ></v-text-field>
                <v-text-field
                    name="password"
                    :label="$t('login.password')"
                    id="password"
                    append-icon="lock"
                    :append-icon="getIcon"
                    :append-icon-cb="changeIcon"
                    :type="hidePass ? 'password' : 'text'"
                    v-model="form.password"
                    maxlength="100"
                    :rules="$validate(['requerido'])"
                    required
                  ></v-text-field>
                <v-checkbox :label="$t('login.rememberMe')" v-model="remember" color="primary"></v-checkbox>
                <v-card-actions>
                  <v-btn
                    color="primary"
                    block
                    large
                    :disabled="!valid"
                    type="submit"
                  >{{ $t('login.login') }}</v-btn>
                </v-card-actions>
            </v-flex>
          </v-layout>
        </v-container>
        <div class="text-xs-center mt-3" v-if="false">
          <router-link to="/login-nit">Login NIT</router-link> |
          <router-link to="/login-ciudadania">Login Ciudadania</router-link>
        </div>
      </v-form>
    </v-card>
    <div class="login-lang">
      <!-- <app-lang></app-lang> -->
    </div>
  </section>
</template>

<script>

import Auth from './mixins/auth';
import AppLang from '@/common/layout/AppLang';
import validate from '@/common/mixins/validate';
import config from '../../../../config';
export default {
  mixins: [ Auth, validate ],
  data () {
    return {
      valid: true,
      form: {
        username: '',
        password: ''
      },
      hidePass: true,
      remember: false,
      enviroment: null
    };
  },
  created () {
    this.enviroment = (process.env.NODE_ENV === 'development') ? this.$storage.set('path', '') : this.$storage.set('path', config.build.assetsPublicPath);
  },
  methods: {
    changeIcon () {
      if (this.form.password.length) {
        this.hidePass = !this.hidePass;
      }
    },
    submit () {
      if (this.$refs.form.validate()) {
        this.login(this.form);
      }
    }
  },
  components: { AppLang },
  computed: {
    getIcon () {
      return this.form.password.length === 0 ? 'lock' : this.hidePass ? 'visibility' : 'visibility_off';
    }
  },
  watch: {
    'form.password': function (val) {
      if (val.length === 0) {
        this.hidePass = true;
      }
    }
  }
};
</script>
<style src="./login.scss" lang="scss"></style>
