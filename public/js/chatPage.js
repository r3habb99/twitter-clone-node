$(document).ready(() => {
  $.get(`/api/chats/${chatId}`, (data) =>
    $('#chatName').text(getChatName(data))
  );

  $.get(`/api/chats/${chatId}/messages`, (data) => {
    let messages = [];
    let lastSenderId = '';

    data.forEach((message, index) => {
      let html = createMessageHtml(message, data[index + 1], lastSenderId);
      messages.push(html);

      lastSenderId = message.sender._id;
    });

    let messagesHtml = messages.join('');
    addMessagesHtmlToPage(messagesHtml);
  });
});

$('#chatNameButton').click(() => {
  let name = $('#chatNameTextbox').val().trim();

  $.ajax({
    url: '/api/chats/' + chatId,
    type: 'PUT',
    data: { chatName: name },
    success: (data, status, xhr) => {
      if (xhr.status != 204) {
        alert('could not update');
      } else {
        location.reload();
      }
    },
  });
});

$('.sendMessageButton').click(() => {
  messageSubmitted();
});

$('.inputTextbox').keydown((event) => {
  if (event.which === 13) {
    messageSubmitted();
    return false;
  }
});

function addMessagesHtmlToPage(html) {
  $('.chatMessages').append(html);

  // TODO: SCROLL TO BOTTOM
}

function messageSubmitted() {
  let content = $('.inputTextbox').val().trim();

  if (content != '') {
    sendMessage(content);
    $('.inputTextbox').val('');
  }
}

function sendMessage(content) {
  $.post(
    '/api/messages',
    { content: content, chatId: chatId },
    (data, status, xhr) => {
      if (xhr.status != 201) {
        alert('Could not send message');
        $('.inputTextbox').val(content);
        return;
      }

      addChatMessageHtml(data);
    }
  );
}

function addChatMessageHtml(message) {
  if (!message?._id) {
    alert('Message is not valid');
    return;
  }

  let messageDiv = createMessageHtml(message, null, '');

  addMessagesHtmlToPage(messageDiv);
}

function createMessageHtml(message, nextMessage, lastSenderId) {
  let sender = message.sender;
  let senderName = sender.firstName + ' ' + sender.lastName;

  let currentSenderId = sender._id;
  let nextSenderId = nextMessage != null ? nextMessage.sender._id : '';

  let isFirst = lastSenderId != currentSenderId;
  let isLast = nextSenderId != currentSenderId;

  let isMine = message.sender._id == userLoggedIn._id;
  let liClassName = isMine ? 'mine' : 'theirs';

  if (isFirst) {
    liClassName += ' first';
  }

  if (isLast) {
    liClassName += ' last';
  }

  return `<li class='message ${liClassName}'>
                <div class='messageContainer'>
                    <span class='messageBody'>
                        ${message.content}
                    </span>
                </div>
            </li>`;
}
