$(document).ready(() => {
  $.get('/api/posts', (results) => {
    outputPosts(results, $('.postsContainer'));
        $('.loadingSpinnerContainer').remove();
        $('.postsContainer').css('visibility', 'visible');
  });
});
