'use strict';

function Navigation() {

  var breadcrumbs = function () {
    var crumbs = [];

    var get = function () {
      return crumbs;
    };

    var add = function (title, url, uiRoute) {
      crumbs.push({
        title: title,
        url: url,
        uiRoute: uiRoute
      });
    };

    var clear = function () {
      crumbs.splice(0, crumbs.length);
    };

    return {
      get: get,
      add: add,
      clear: clear
    };

  }();

  var actions = function () {
    var buttons = [];
    var dropdownItems = [];

    function get(type) {
      type = type || 'dropdownItems';
      if (type === 'buttons') {
        return buttons;
      }
      return dropdownItems;
    }

    function add(parameters) {
      var title = parameters.title;
      var method = parameters.method;
      var type = parameters.type || 'dropdown';
      var icon = parameters.icon  || false;
      var disableIf = parameters.disableIf;
      var style = parameters.style;

      if (type === 'button') {
        buttons.push({
          title: title,
          method: method,
          icon: icon,
          disableIf: disableIf,
          style: style
        });
      } else {
        dropdownItems.push({
          title: title,
          method: method,
          icon: icon
        });
      }
    }

    /**
     * Add multiple actions at once by passing an array of action objects
     * @param actions @type [{title: string, method: function, action: string, icon: string}]
     */
    function addMany(actions) {
      angular.forEach(actions, function(action) {
        add({title: action.title, method: action.method, type: action.type, icon: action.icon, disableIf: action.disableIf, style: action.style});
      });
    }

    function clear(type) {
      type = type || 'all';

      switch (type) {
        case 'buttons':
          buttons.splice(0, buttons.length);
          break;
        case 'dropdown':
          dropdownItems.splice(0, dropdownItems.length);
          break;
        default:
          buttons.splice(0, buttons.length);
          dropdownItems.splice(0, dropdownItems.length);
      }
    }


    return {
      get: get,
      add: add,
      addMany: addMany,
      clear: clear
    };

  }();

  function clearAll() {
    breadcrumbs.clear();
    actions.clear();
  }

  var viewTitle = function () {
    var title = {};
    title.name = '';

    function set(newTitle) {
      title.name = newTitle;
    }

    function get() {
      return title;
    }

    function clear() {
      title.name = '';
    }

    return {
      set: set,
      get: get,
      clear: clear
    };
  }();


  return {
    breadcrumbs: {
      get: breadcrumbs.get,
      add: breadcrumbs.add,
      clear: breadcrumbs.clear
    },
    actions: {
      get: actions.get,
      add: actions.add,
      addMany: actions.addMany,
      clear: actions.clear
    },
    viewTitle: {
      set: viewTitle.set,
      get: viewTitle.get,
      clear: viewTitle.clear
    },
    clear: clearAll
  };
}

angular
  .module('core')
  .factory('Navigation', Navigation);
