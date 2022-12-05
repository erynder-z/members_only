// Back button
document.addEventListener('DOMContentLoaded', function () {
  const backBtn = document.getElementById('go-back');
  backBtn?.addEventListener('click', () => {
    history.back();
  });
});
