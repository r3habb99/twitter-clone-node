$(document).ready(() => {
  if (selectedTab === "replies") {
    loadReplies();
  } else {
    loadPosts();
  }
  // Handle profile picture upload form submission
  $("#profilePictureForm").submit(function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    $.ajax({
      url: "/profile/upload/profilePicture",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: (data) => {
        location.reload(); // Reload the page to reflect the new profile picture
      },
      error: (err) => {
        console.error(err);
        alert("Failed to upload image.");
      },
    });
  });

  // Preview the selected image
  $("#filePhoto").change(function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        $("#imagePreview").attr("src", e.target.result).show();
      };
      reader.readAsDataURL(file);
    }
  });
});

function loadPosts() {
  $.get(
    "/api/posts",
    { postedBy: profileUserId, isReply: false },
    (results) => {
      outputPosts(results, $(".postsContainer"));
    }
  );
}

function loadReplies() {
  $.get("/api/posts", { postedBy: profileUserId, isReply: true }, (results) => {
    outputPosts(results, $(".postsContainer"));
  });
}
