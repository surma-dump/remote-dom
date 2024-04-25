import '@remote-dom/core/polyfill';
import {retain, createThreadFromWebWorker} from '@quilted/threads';

import {RemoteRootElement} from '@remote-dom/core/elements';

customElements.define('remote-root', RemoteRootElement);

createThreadFromWebWorker(self, {
  expose: {
    async render(connection, api) {
      retain(connection);

      const root = document.createElement('remote-root');
      root.connect(connection);

      const examples = [
        createDisabledButton1,
        createDisabledButton2,
        createDisabledButton3,
        createDelayedDisabledButton,
        createDelayedTextChange,
        createButtonWithClickListener,
      ];
      for (const example of examples) {
        example(root);
      }
    },
  },
});

// FAIL
function createDisabledButton1(root) {
  const otherButton = document.createElement('button');
  otherButton.textContent = 'This button should be disabled, but is not';
  otherButton.disabled = true;
  root.append(otherButton);
}

// FAIL
function createDisabledButton2(root) {
  const otherButton = document.createElement('button');
  otherButton.textContent = 'This button should be disabled, but is not';
  root.append(otherButton);
  otherButton.disabled = true;
}

// PASS
function createDisabledButton3(root) {
  const otherButton = document.createElement('button');
  otherButton.textContent = 'This button is disabled';
  otherButton.setAttribute('disabled', 'true');
  root.append(otherButton);
}

// PASS
function createDelayedTextChange(root) {
  const otherButton = document.createElement('button');
  otherButton.textContent = 'This button will change its text after 1s';
  root.append(otherButton);
  setTimeout(() => {
    otherButton.textContent = 'Text was changed';
  }, 1000);
}

// PASS
function createDelayedDisabledButton(root) {
  const otherButton = document.createElement('button');
  otherButton.textContent = 'This button will disable after 1s';
  root.append(otherButton);
  setTimeout(() => {
    otherButton.setAttribute('disabled', 'true');
  }, 1000);
}

// FAIL
function createButtonWithClickListener(root) {
  const otherButton = document.createElement('button');
  otherButton.textContent = 'This button should log on click, but does not';
  root.append(otherButton);
  otherButton.addEventListener('click', () => console.log(ev));
}
