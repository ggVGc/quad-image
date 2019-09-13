export function process(file: File) {
  setBodyActive();

  const reader = new FileReader();
  reader.onload = function() {
    if (!this.result) {
      error('file api acted unexpectedly, not sure why');
      return;
    }

    const type = file.type || 'image/jpeg';

    const blob = new Blob([this.result], { type });

    const loadingItem = new Item(true);

    upload(blob, (success, msg) => {
      if (!success) {
        loadingItem.actionButton.onclick = () => {
          alert(msg);
        };
        loadingItem.li.classList.add('failed');
        loadingItem.li.classList.remove('loading');
        return;
      }

      makeLoadedItem(loadingItem, msg);
    });
  };

  reader.readAsArrayBuffer(file);
}

function setBodyActive() {
  document.body.classList.add('active-upload');
}

function onFiles(items: FileList | null, context: string) {
  if (!items) {
    error('Files not set; nothing to do.');
    return;
  }

  if (0 === items.length) {
    error(
      `No files, valid or not, were found in your ${context}. Maybe it wasn't a valid image, or your browser is confused about what it was?`,
    );
    return;
  }

  // FileList isn't iterable
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    console.log(item);

    if (item.type.match(/image.*/)) {
      process(item);
    } else {
      error("Ignoring non-image item (of type '" + item.type + "') in " + context + ': ' + item.name);
    }
  }

  form.classList.remove('dragover');
}
