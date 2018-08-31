'use strict';

export default {
  methods: {
    procesarValores (agregar, editar, eliminar) {
      if (agregar || editar) {
        const fila = {};
        this.to.columns.forEach((c, idx) => {
          if (c.templateOptions) {
            fila[c.name] = c.templateOptions.value;
          } else if (c.type === 'calculo') {
            fila[c.name] = 0;
            c.cols.forEach(op => {
              if (!fila[c.name]) fila[c.name] = fila[op];
              else if (c.operation === 'suma') fila[c.name] = parseFloat(fila[c.name]) + parseFloat(fila[op]);
              else if (c.operation === 'resta') fila[c.name] = parseFloat(fila[c.name]) - parseFloat(fila[op]);
              else if (c.operation === 'multiplicacion') fila[c.name] = parseFloat(fila[c.name]) * parseFloat(fila[op]);
              else if (c.operation === 'division') fila[c.name] = parseFloat(fila[c.name]) / parseFloat(fila[op]);
            });
          }
        });
        this.to.columns.forEach((c, idx) => {
          if (c.templateOptions) {
            c.templateOptions.value = null;
          }
        });
        if (agregar) {
          this.filas.push(fila);
        } else if (editar) {
          this.filas[this.filaSeleccionada] = fila;
        }
        this.armarColumnasGuardar(true, true);
      }
      const totales = this.to.columns.filter(item => item.type === 'total');
      if (totales && totales.length) {
        let indiceTotales = -1;
        const totalesCalculados = {
          ___totales: true
        };
        this.filas.forEach((f, fix) => {
          if (f.___totales === true) {
            indiceTotales = fix;
          }
          for (const at in f) {
            const esTotal = totales.filter(item => at === item.cols);
            if (at && esTotal && esTotal.length > 0 && esTotal[0].cols === at) {
              if (!totalesCalculados[esTotal[0].name]) totalesCalculados[esTotal[0].name] = 0;
              totalesCalculados[esTotal[0].name] = parseFloat(totalesCalculados[esTotal[0].name]) + parseFloat(f[at]);
            }
          }
        });
        if (indiceTotales >= 0) {
          this.filas.splice(indiceTotales, 1);
        }

        const promedios = totales.filter(item => item.operation === 'promedio');
        if (promedios && promedios.length > 0) {
          promedios.forEach(item => {
            totalesCalculados[item.name] = totalesCalculados[item.name] / this.filas.length;
          });
        }
        this.filaTotales = totalesCalculados;
        this.filas.push(totalesCalculados);
      }
      this.filaSeleccionada = false;
    },
    devolverColumnas (columnasGrilla) {
      const devolver = [];
      if (columnasGrilla && columnasGrilla.length > 0) {
        columnasGrilla.forEach(c => {
          devolver.push({
            name: c.name,
            id: c.templateOptions && c.name ? c.name : c.name,
            label: c.templateOptions && c.templateOptions.label ? c.templateOptions.label : c.name
          });
        });
      }
      return devolver;
    },
    armarColumnasGuardar (totales, renderizar) {
      const columnasGrillaAux = [];
      this.layout = []; let x = 0; let y = 0; let contador = 0;
      let columnasRecorrer = totales ? this.to.columns : this.columnasPopup;
      columnasRecorrer = JSON.parse(JSON.stringify(columnasRecorrer));
      columnasRecorrer.forEach((c, idx) => {
        const componente = this.list.filter(l => l.type === c.key);
        if (totales) {
          columnasGrillaAux.push(c);
        } else if (componente && componente.length > 0) {
          let compAux = componente[0];
          if (c && c.component) {
            compAux = c.component;
          }
          if (compAux.type === 'total' || compAux.type === 'calculo') {
            columnasGrillaAux.push(JSON.parse(JSON.stringify(compAux)));
          } else {
            compAux = Object.assign({}, compAux);
            compAux.templateOptions.settings = true;
            compAux.posicion = {
              x: x,
              y: y,
              w: 3,
              h: 2,
              i: contador.toString()
            };
            contador++;
            columnasGrillaAux.push(JSON.parse(JSON.stringify(compAux)));
            if (x < 8) {
              x = x + 3;
            } else {
              x = 0;
              y = y + 2;
            }
          }
        } else {
          columnasGrillaAux.push((c && c.component ? c.component : c));
        }
      });
      if (totales && totales !== true) {
        columnasGrillaAux.push(totales);
      }
      this.to.columns = columnasGrillaAux;
      this.columnasGrillaTrigger = columnasGrillaAux;
      if (renderizar) {
        this.armarEstructuraGrilla(this.to.columns);
      }
    },
    armarEstructuraGrilla (columns) {
      const columnasAux = [];
      const totalesAux = [];
      this.layout = [];
      this.totalesGrilla = [];
      const componentes = JSON.parse(JSON.stringify(columns));
      componentes.forEach(c => {
        if (c.type === 'total') {
          totalesAux.push(c);
        } else {
          if (c.posicion) {
            c.posicion.layoutDate = new Date();
            this.layout.push(c.posicion);
          }
          delete c.posicion;
          columnasAux.push(c);
        }
      });
      this.totalesGrilla.push({});
      columnasAux.forEach(c => {
        const tot = totalesAux.filter(item => (item.cols === c.name || (c.templateOptions && item.cols === c.templateOptions.id)));
        if (tot && tot.length && tot.length > 0) {
          this.totalesGrilla.push(tot[0]);
        } else {
          this.totalesGrilla.push({});
        }
      });
      this.totalesGrilla.push({});
    }
  }
};
