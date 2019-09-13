import { AppError, SavedImage } from "../types";
import { upload } from "./net";

function readFile(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function() {
      if (this.result instanceof ArrayBuffer) {
        resolve(this.result);
      } else {
        reject("invalid result");
      }
    };

    reader.onerror = () => reject("unknown error reading file");
    reader.onabort = () => reject("unexpected abort reading file");

    reader.readAsArrayBuffer(file);
  })
}

async function uploadFile(file: File): Promise<SavedImage> {
  setBodyActive();

  const blobPart = await readFile(file);

  const type = file.type || 'image/jpeg';

  const blob = new Blob([blobPart], { type });

  // TODO: add placeholder

  const imageId = await upload(blob);

  return imageId;
}

/*
if (!success) {
  loadingItem.actionButton.onclick = () => {
    alert(msg);
  };
  loadingItem.li.classList.add('failed');
  loadingItem.li.classList.remove('loading');
  return;
}

makeLoadedItem(loadingItem, msg);
*/

// TODO: State somewhere
function setBodyActive() {
  document.body.classList.add('active-upload');
}

export async function onFiles(items: FileList | null, context: string) {
  if (!items) {
    throw new AppError('Files not set; nothing to do.');
    return;
  }

  if (0 === items.length) {
    throw new AppError(
      `No files, valid or not, were found in your ${context}.` +
      `Maybe it wasn't a valid image, or your browser is confused about what it was?`,
    );
    return;
  }

  // FileList isn't iterable
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    console.log(item);

    if (item.type.match(/image.*/)) {
      await uploadFile(item);
    } else {
      // TODO: ignore and continue, instead of exiting here
      throw new AppError("Ignoring non-image item (of type '" + item.type + "') in " + context + ': ' + item.name);
    }
  }

  // TODO: form.classList.remove('dragover');
}
