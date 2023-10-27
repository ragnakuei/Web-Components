  window.vueWysiwyg = window.vueWysiwyg || {
    template: `
<div class="wysiwyg" >
    <div class="toolbar">

        <button type="button" class="item undo" v-on:click="execCommand('undo')" title="undo"></button>
        <button type="button" class="item redo" v-on:click="execCommand('redo')" title="redo"></button>
        <div class="item delimiter"></div>

        <button type="button" class="item copy" v-on:click="execCommand('copy')" title="copy"></button>
        <button type="button" class="item cut" v-on:click="execCommand('cut')" title="cut"></button>
        <button type="button" class="item paste" v-on:click="execCommand('paste')" title="paste"></button>
        <button type="button" class="item delete" v-on:click="execCommand('delete')" title="delete"></button>
        <button type="button" class="item select-all" v-on:click="execCommand('selectAll')" title="select all"></button>
        <div class="item delimiter"></div>

        <button type="button" class="item underline" v-on:click="execCommand('underline')"></button>
        <button type="button" class="item italic" v-on:click="execCommand('italic')"></button>
        <button type="button" class="item bold" v-on:click="execCommand('bold')"></button>
        <button type="button" class="item strikethrough" v-on:click="execCommand('strikeThrough')"></button>
        <div class="item delimiter"></div>

        <input type="color" v-on:blur="changeFontColor($event.target.value)" />
        <button type="button" class="item link" v-on:click="insertLink()"></button>

        <input type="file" 
               accept="image/*" 
               style="display: none;" 
               id="insertImage" 
               v-on:change="insertImage($event.target)"
               ref="insertImageDom"
               >
        <button type="button" class="item image-content" for="insertImage" title="Upload Image" v-on:click="clickInsertImageDom()"></button>
        <button type="button" class="item image-link" v-on:click="insertImageUrl()" title="Insert Image Url"></button>
        <div class="item delimiter"></div>

        <!-- Jutify -->
        <button type="button" class="item align-left" v-on:click="execCommand('justifyLeft')"></button>
        <button type="button" class="item align-center" v-on:click="execCommand('justifyCenter')"></button>
        <button type="button" class="item align-right" v-on:click="execCommand('justifyRight')"></button>
    </div>
    <hr />
    <div class="editor" 
         ref="editorDom"
         v-on:input="$emit('update:modelValue', $event.target.innerHTML)"
         contenteditable
    >
    </div>
</div>
        `,
  props: {
    modelValue: String,
  },
  setup(props, { emit }) {
    const editorDom = ref(null);
    
    const getContent = () => editorDom.value.innerHTML;
    const setContent = (content) => editorDom.value.innerHTML = content;
    
    const execCommand = function (command, showUI, value) {
      document.execCommand(command, showUI, value);
    };

    const insertLink = function () {
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

    const insertImageDom = ref(null);
    const clickInsertImageDom = function () {
      if(isSelectionOrFocusInEditor() === false) {
        alert('請先點擊編輯區域 !');
        return;
      }

      insertImageDom.value.click();
    };
    const insertImage = function (target) {
      
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
          insertImageDom.value.value = null;
        },
        false
      );

      if (file) {
        reader.readAsDataURL(file);
      }
    };

    const insertImageUrl = function () {

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
        editorDom.value.appendChild(img);
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
        execCommand("foreColor", false, color);
        selection.removeAllRanges();
      }
    };
    
    function isSelectionOrFocusInEditor() {
      const selection = window.getSelection();
      // console.log('selection', selection);

      if (selection.rangeCount !== 0) {
        // console.log('has selection rangeCount', selection.rangeCount);
        // with selection

        let selectionDom = selection.getRangeAt(0).commonAncestorContainer;
        while(selectionDom) {
          if(selectionDom === editorDom.value) {
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
      editorDom,
      getContent,
      setContent,
      execCommand,
      insertLink,
      insertImage,
      insertImageDom,
      clickInsertImageDom,
      insertImageUrl,
      changeFontColor,
    };
  },
};
