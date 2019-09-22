import * as JSONAPI from 'jsonapi-typescript';

let quadpees: string[] = [];
let targetGallery: string | null = null;

const images = document.getElementById('images') as HTMLElement;
const form = document.getElementById('form') as HTMLElement;

class Item {
  actionButton: HTMLElement;
  binButton: HTMLElement;
  li: HTMLLIElement;

  constructor(isLoading: boolean) {
    this.li = document.createElement('li');
    images.insertBefore(this.li, images.firstChild);
    if (isLoading) {
      this.li.classList.add('loading');
    }

    this.actionButton = document.createElement('button');
    this.li.appendChild(this.actionButton);

    this.binButton = document.createElement('button');
    this.li.appendChild(this.binButton);
  }
}


function makeLoadedItem(loadingItem: Item, url: string) {
  const a = document.createElement('a');
  const img = document.createElement('img');

  a.href = url;
  a.target = '_blank';

  const copyInput = document.createElement('input');
  copyInput.value = a.href;

  const label = 'copy';
  loadingItem.actionButton.innerHTML = label;
  loadingItem.actionButton.onclick = (e) => {
    e.preventDefault();
    copyInput.select();
    document.execCommand('Copy');
    loadingItem.actionButton.innerHTML = 'copied';
  };
  loadingItem.actionButton.onmouseleave = () => {
    loadingItem.actionButton.innerHTML = label;
  };

  loadingItem.binButton.innerHTML = '🗑➡️';
  loadingItem.binButton.onclick = (e) => {
    e.preventDefault();
    let removing = false;
    Array.prototype.slice.call(images.childNodes).forEach((i: HTMLElement) => {
      if (url === i.dataset.miniUrl) {
        removing = true;
      }
      if (removing) {
        images.removeChild(i);
        const idx = quadpees.indexOf(i.dataset.miniUrl as string);
        if (idx >= 0) {
          quadpees.splice(idx, 1);
        }
      }
    });

    localStorage.setItem('quadpees', JSON.stringify(quadpees));
  };

  a.appendChild(img);
  loadingItem.li.appendChild(a);
  loadingItem.li.appendChild(copyInput);
  loadingItem.li.dataset.miniUrl = url;

  img.onload = () => {
    loadingItem.li.classList.remove('loading');
    loadingItem.li.classList.add('loaded');
  };

  img.src = url + '.thumb.jpg';
}



function error(msg: string) {
  const errors = document.getElementById('errors') as HTMLElement;
  errors.style.display = 'block';
  const span = document.createElement('p');
  span.innerHTML = msg;
  errors.insertBefore(span, errors.firstChild);
}

function setCurrentPublic(id: string) {
  $('#current-gallery')
    .empty()
    .append(
      $('<a>')
        .attr('href', '/gallery/#' + id)
        .attr('target', 'none')
        .text(id),
    );
}

function addImagesToGallery(gallery: string, images: string[]) {
  callGallery(gallery, images)
    .then(function(resp) {
      if ('errors' in resp) {
        resp.errors.forEach((e: JSONAPI.ErrorObject) => error(`then: ${e.code}: ${e.title}`));
      } else if ('data' in resp) {
        if ('gallery' !== resp.data.type) {
          error('invalid response type');
        } else {
          setCurrentPublic(resp.data.id);
          $('#new-gallery').val('');
          localStorage.setItem('gallery', gallery);
          targetGallery = gallery;
        }
      } else {
        error('invalid response object: ' + JSON.stringify(resp));
      }
    })
    .catch((xhr: any) => {
      if (xhr.responseJSON && 'errors' in xhr.responseJSON) {
        xhr.responseJSON.errors.forEach((e: JSONAPI.ErrorObject) => error(`http: ${e.code}: ${e.title}`));
      }
    });
}



function setEvents() {


  $('#user-button').on('click', () => {
    $('#user-button').hide();
    $('#user-settings').show();
    if (targetGallery) {
      addImagesToGallery(targetGallery, []);
    } else {
      $('#current-gallery')
        .empty()
        .html('<i>not set</i>');
    }
  });

  $('#user-settings .close').on('click', () => {
    $('#user-button').show();
    $('#user-settings').hide();
  });

  $('#user-form').submit(() => {
    addImagesToGallery($('#new-gallery').val() as string, quadpees);
    return false;
  });

  const errors = document.getElementById('errors') as HTMLElement;
  errors.style.display = 'none';
  errors.innerHTML = '';
}

export function init() {
  $(loadStorage);
  $(setEvents);
}
