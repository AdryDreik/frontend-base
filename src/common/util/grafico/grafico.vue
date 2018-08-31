<script>
import { Pie } from 'vue-chartjs';
export default {
  extends: Pie,
  props: ['data', 'options'],
  mounted () {
    let options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      legend: {
        display: false
        // position: 'bottom'
      }
    };
    if (this.options) {
      options = this.options;
    }
    this.renderChart(this.data, options);
  }
};
</script>

