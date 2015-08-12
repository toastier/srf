'use strict';

function Messages () {
  var queue = [];

  function addMessage (message, type) {
    queue.push({
      message: message,
      type: type
    });
  }

  function getMessages () {
    return queue;
  }

  function clearMessages () {
    queue = [];
  }
  return {
    getMessages: getMessages,
    clearMessages: clearMessages,
    addMessage: addMessage
  };
}

angular
  .module('core')
  .factory('Messages', Messages);
