const wysiwyg = {
  template: `
<div class="wysiwyg" >
    <div class="toolbar">

        <button class="item undo" v-on:click="doc_execCommand('undo')" title="undo"></button>
        <button class="item redo" v-on:click="doc_execCommand('redo')" title="redo"></button>
        <div class="item delimiter"></div>

        <button class="item copy" v-on:click="doc_execCommand('copy')" title="copy"></button>
        <button class="item cut" v-on:click="doc_execCommand('cut')" title="cut"></button>
        <button class="item paste" v-on:click="doc_execCommand('paste')" title="paste"></button>
        <button class="item delete" v-on:click="doc_execCommand('delete')" title="delete"></button>
        <button class="item select-all" v-on:click="doc_execCommand('selectAll')" title="select all"></button>
        <div class="item delimiter"></div>

        <button class="item underline" v-on:click="doc_execCommand('underline')"></button>
        <button class="item italic" v-on:click="doc_execCommand('italic')"></button>
        <button class="item bold" v-on:click="doc_execCommand('bold')"></button>
        <button class="item strikethrough" v-on:click="doc_execCommand('strikeThrough')"></button>
        <div class="item delimiter"></div>

        <button class="item font-color" v-on:click="changeFontColor()"></button>
        <div class="item delimiter"></div>

        <button class="item link" v-on:click="insert_link()"></button>
        <input type="file" 
               accept="image/*" 
               style="display: none;" 
               id="insert_image" 
               v-on:change="insert_image($event.target)"
               ref="insert_image_dom"
               >
        <button class="item image-content" for="insert_image" title="Upload Image" v-on:click="insert_image_dom.click()"></button>
        <button class="item image-link" v-on:click="insert_image_url()" title="Insert Image Url"></button>
        <div class="item delimiter"></div>

        <!-- Jutify -->
        <button class="item align-left" v-on:click="doc_execCommand('justifyLeft')"></button>
        <button class="item align-center" v-on:click="doc_execCommand('justifyCenter')"></button>
        <button class="item align-right" v-on:click="doc_execCommand('justifyRight')"></button>
    </div>
    <hr />
    <div class="editor" 
         ref="editor_dom" contenteditable
    >
    </div>
    <hr />
    <div class="footer">
        <button class="item xcross" v-on:click="reset()"></button>
        <button class="item check" v-on:click="apply()"></button>
    </div>
</div>
          `,
  props: {
    modelValue: String,
  },
  setup(props, { emit }) {
    const editor_dom = ref(null);

    const doc_execCommand = function (command, showUI, value) {
      document.execCommand(command, showUI, value);
    };

    const insert_link = function () {
      const url = prompt("Enter the link here: ", "https://");
      if (url) {
        doc_execCommand("createLink", false, url);
      }
    };

    const insert_image_dom = ref(null);
    const insert_image = function (target) {
      const file = target.files[0];
      const reader = new FileReader();

      let dataURI;

      reader.addEventListener(
        "load",
        function () {
          dataURI = reader.result; // image base64 string

          // create img tag
          const img = document.createElement("img");
          img.src = dataURI;

          insertImageToRange(img);

          // 清空 input file
          insert_image_dom.value.value = null;
        },
        false
      );

      if (file) {
        reader.readAsDataURL(file);
      }
    };

    const insert_image_url = function () {
      const url = prompt("Enter the image url here: ", "https://picsum.photos/200");
      if (!url) {
        return;
      }

      // create img tag
      const img = document.createElement("img");
      img.src = url;

      insertImageToRange(img);
    };

    function insertImageToRange(img) {
      // insert img tag to selection
      const selection = window.getSelection();
      // console.log('selection', selection);

      if (selection.rangeCount !== 0) {
        // with selection

        const range = selection.getRangeAt(0);
        // console.log('range', range);

        range.insertNode(img);

        // clear selection
        selection.removeAllRanges();
      } else {
        // no selection

        // insert img tag to editor
        editor_dom.value.appendChild(img);
      }
    }

    const changeFontColor = function () {
      // check selection
      const selection = window.getSelection();
      if (selection.rangeCount === 0) {
        return;
      }

      const color = prompt("Enter the font color here: ", "#");
      if (color) {
        doc_execCommand("foreColor", false, color);
      }
    };

    const reset = function () {
      // 重新初始化編輯器的內容為傳入的 modelValue
      editor_dom.value.innerHTML = props.modelValue;
    };

    const apply = function () {
      emit("update:modelValue", editor_dom.value.innerHTML);
    };

    onMounted(() => {
      editor_dom.value.innerHTML = props.modelValue;
    });

    return {
      editor_dom,
      doc_execCommand,
      insert_link,
      insert_image,
      insert_image_dom,
      insert_image_url,
      changeFontColor,
      reset,
      apply,
    };
  },
};
