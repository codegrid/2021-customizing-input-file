const $input = document.querySelector("[data-js-input]");
const $check = document.querySelector("[data-js-check]");
const $reset = document.querySelector("[data-js-reset]");

$check.onclick = () => {
  console.log("value:", $input.value);
  console.log("files:", $input.files);
  for (const file of $input.files) {
    console.log("file:", file);
  }
};

$reset.onclick = () => {
  $input.value = "";
};
