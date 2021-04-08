const $input = document.querySelector("[data-js-input]");
const $preview = document.querySelector("[data-js-preview]");
const $reset = document.querySelector("[data-js-reset]");

const state = {
  url: "",
};

$input.onchange = ({ currentTarget }) => {
  const [file] = currentTarget.files;

  const $image = new Image();
  $image.src = state.url = URL.createObjectURL(file);

  $preview.append($image);
  $input.disabled = true;
};

$reset.onclick = () => {
  $input.value = "";
  $input.disabled = false;
  state.url !== "" && URL.revokeObjectURL(state.url);
  $preview.firstElementChild?.remove();
};
