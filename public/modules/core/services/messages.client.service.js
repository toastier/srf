(function () {
  'use strict';
  angular
    .module('core')
    .factory('Messages', Messages);

  function Messages() {
    var queue = [];

    /**
     * add a Message for display
     * @param message
     * @param type
     * @param title
     * @param env
     */
    function addMessage(message, type, title, env, overrideOptions) {
      type = (type === 'success' || type === 'error' || type === 'info' || type === 'warning') ? type : 'info';
      title = title || null;
      overrideOptions = overrideOptions || {};
      env = (env === 'dev' || env === 'prod') ? env : 'prod';
      if (message) {
        queue.push({
          message: message,
          type: type,
          env: env,
          title: title,
          overrideOptions: overrideOptions
        });
      }
    }

    function getMessages() {
      return queue;
    }

    function clearMessages() {
      queue = [];
    }

    return {
      getMessages: getMessages,
      clearMessages: clearMessages,
      addMessage: addMessage,
      messages: queue
    };
  }
})();
