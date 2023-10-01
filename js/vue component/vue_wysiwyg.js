  window.vue_wysiwyg = window.vue_wysiwyg || {
    template: `
<div class="wysiwyg" 
     v-on:mouseleave="apply">
    <div class="toolbar">

        <button type="button" class="item undo" v-on:click="doc_execCommand('undo')" title="undo"></button>
        <button type="button" class="item redo" v-on:click="doc_execCommand('redo')" title="redo"></button>
        <div class="item delimiter"></div>

        <button type="button" class="item copy" v-on:click="doc_execCommand('copy')" title="copy"></button>
        <button type="button" class="item cut" v-on:click="doc_execCommand('cut')" title="cut"></button>
        <button type="button" class="item paste" v-on:click="doc_execCommand('paste')" title="paste"></button>
        <button type="button" class="item delete" v-on:click="doc_execCommand('delete')" title="delete"></button>
        <button type="button" class="item select-all" v-on:click="doc_execCommand('selectAll')" title="select all"></button>
        <div class="item delimiter"></div>

        <button type="button" class="item underline" v-on:click="doc_execCommand('underline')"></button>
        <button type="button" class="item italic" v-on:click="doc_execCommand('italic')"></button>
        <button type="button" class="item bold" v-on:click="doc_execCommand('bold')"></button>
        <button type="button" class="item strikethrough" v-on:click="doc_execCommand('strikeThrough')"></button>
        <div class="item delimiter"></div>

        <input type="color" v-on:blur="changeFontColor($event.target.value)" />
        <button type="button" class="item link" v-on:click="insert_link()"></button>

        <input type="file" 
               accept="image/*" 
               style="display: none;" 
               id="insert_image" 
               v-on:change="insert_image($event.target)"
               ref="insert_image_dom"
               >
        <button type="button" class="item image-content" for="insert_image" title="Upload Image" v-on:click="click_insert_image_dom()"></button>
        <button type="button" class="item image-link" v-on:click="insert_image_url()" title="Insert Image Url"></button>
        <div class="item delimiter"></div>

        <!-- Jutify -->
        <button type="button" class="item align-left" v-on:click="doc_execCommand('justifyLeft')"></button>
        <button type="button" class="item align-center" v-on:click="doc_execCommand('justifyCenter')"></button>
        <button type="button" class="item align-right" v-on:click="doc_execCommand('justifyRight')"></button>
    </div>
    <hr />
    <div class="editor" 
         ref="editor_dom"
         v-on:blur="apply"
         contenteditable
         v-html="modelValue"
    >
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
      if(isSelectionOrFocusInEditor() === false) {
        alert('請先點擊編輯區域 !');
        return;
      }
      
      const url = prompt("Enter the link here: ", "https://");
      if (url) {
        insertLinkToRange(url);
      }
    };
    function insertLinkToRange(url) {
      const a = document.createElement("a");
      a.href = url;
      a.innerText = url;
      
      // get current cursor position
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      range.insertNode(a);
      
    }

    const insert_image_dom = ref(null);
    const click_insert_image_dom = function () {
      if(isSelectionOrFocusInEditor() === false) {
        alert('請先點擊編輯區域 !');
        return;
      }

      insert_image_dom.value.click();
    };
    const insert_image = function (target) {
      
      if(isSelectionOrFocusInEditor() === false) {
        alert('請先點擊編輯區域 !');
        return;
      }
      
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

      if(isSelectionOrFocusInEditor() === false) {
        alert('請先點擊編輯區域 !');
        return;
      }
      
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
      const selection = window.getSelection();

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

    const changeFontColor = function (color) {
      // console.log("changeFontColor", color);
      
      // check selection
      const selection = window.getSelection();
      if (selection.rangeCount === 0) {
        return;
      }

      if (color) {
        doc_execCommand("foreColor", false, color);
        selection.removeAllRanges();
      }
    };
    
    const apply = function () {
      emit("update:modelValue", editor_dom.value.innerHTML);
    };
    
    function isSelectionOrFocusInEditor() {
      const selection = window.getSelection();
      // console.log('selection', selection);

      if (selection.rangeCount !== 0) {
        // console.log('has selection rangeCount', selection.rangeCount);
        // with selection

        let selectionDom = selection.getRangeAt(0).commonAncestorContainer;
        while(selectionDom) {
          if(selectionDom === editor_dom.value) {
            return true;
          }
          
          selectionDom = selectionDom.parentNode;
        }
      }

      return false;
    }
    
    onMounted(() => {
    });

    return {
      editor_dom,
      doc_execCommand,
      insert_link,
      insert_image,
      insert_image_dom,
      click_insert_image_dom,
      insert_image_url,
      changeFontColor,
      apply,
    };
  },
};
