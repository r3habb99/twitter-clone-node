$(document).ready(() => {
  $.get(`/api/chats/${chatId}`, (data) =>
    $('#chatName').text(getChatName(data))
  );
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

  let messageDiv = createMessageHtml(message);

  $('.chatMessages').append(messageDiv);
}

function createMessageHtml(message) {
  let isMine = message.sender._id == userLoggedIn._id;
  let liClassName = isMine ? 'mine' : 'theirs';

  return `<li class='message ${liClassName}'>
                <div class='messageContainer'>
                    <span class='messageBody'>
                        ${message.content}
                    </span>
                </div>
            </li>`;
}
