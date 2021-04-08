const { reactive, createApp } = Vue;

//
// 選択したファイルを管理する機能群
//
const useFileSelect = (MAX_FILES) => {
  // 選択しているファイルたち
  const selectedFiles = reactive(new Set());

  // ファイル選択
  const selectFiles = (files) => {
    if (selectedFiles.size + files.length > MAX_FILES)
      throw new Error(`選択できるのは最大${MAX_FILES}つまでです！`);

    for (const file of files) {
      selectedFiles.add({
        id: Math.random(),
        name: file.name,
        size: (file.size / 1024).toFixed(1), // B -> KB
        src: URL.createObjectURL(file),
        raw: file,
      });
    }
  };
  // ファイル削除
  const deleteFile = (file) => {
    URL.revokeObjectURL(file.src);
    selectedFiles.delete(file);
  };

  return {
    MAX_FILES,
    selectedFiles,
    selectFiles,
    deleteFile,
  };
};

//
// それを使ってUIを組み立て
//
const app = createApp({
  setup() {
    return {
      // 最大3ファイルとする
      ...useFileSelect(3),
    };
  },

  methods: {
    onChangeFiles(ev) {
      try {
        this.selectFiles(ev.currentTarget.files);
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    },

    onClickDeleteFile(file) {
      this.deleteFile(file);
    },

    async onClickUpload() {
      console.log(`${this.selectedFiles.size}つのファイルをアップロードします。`);
      for (const { raw } of this.selectedFiles) {
        console.log(raw);
      }
    }
  },

  template: `
<div class="Form">
  <h1 class="Form_Title">画像をアップロードする</h1>
  <p class="Form_Description">
    最大{{MAX_FILES}}つまでの画像（PNG・JPG形式）が選択できます。
  </p>

  <label class="UploadButton">
    <input
      class="UploadButton_Input"
      type="file"
      accept="image/png, image/jpeg"
      multiple
      @change="onChangeFiles"
      :disabled="selectedFiles.size >= MAX_FILES"
    >
    <span class="UploadButton_Text">画像を選択する</span>
  </label>

  <ul
    class="FileList"
    v-for="file of selectedFiles"
    :key="file.id"
  >
    <li class="FileList_Item">
      <img class="FileList_Img" :src="file.src">
      <span class="FileList_Name">{{file.name}}</span>
      <span class="FileList_Size">{{file.size}}KB</span>
      <button
        class="FileList_DeleteButton"
        type="button"
        @click="onClickDeleteFile(file)"
      >
        削除
      </button>
    </li>
  </ul>

  <button
    class="SubmitButton"
    type="button"
    @click="onClickUpload"
    :disabled="selectedFiles.size === 0"
  >
    アップロードする
  </button>
</div>
  `
});

app.mount("#form");
