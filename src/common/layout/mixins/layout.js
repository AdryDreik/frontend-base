export default {
  methods: {
    setActive (url) {
      let el = document.querySelector('#sidenav-menu .list__tile.active');
      if (el) {
        el.classList.remove('active');
      }
      if (url.length) {
        el = document.querySelector(`#sidenav-menu .list__tile[data-url='${url}']`);
        if (el) {
          el.classList.add('active');
        }
      }
    },
    clickEvent (url) {
      let sidenav = document.getElementById('sidenav-menu');
      let element = sidenav.querySelector(`a[data-url="${url.substring(1)}"]`);
      if (element) {
        element.classList.add('active');
        element = element.parentNode.parentNode.previousElementSibling;
        if (element.classList.contains('list--group__header') && !element.classList.contains('list--group__header--active')) {
          element.dispatchEvent(new window.Event('click'));
        }
      }
    }
  }
};
