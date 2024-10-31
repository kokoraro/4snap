function openOAuthWindow(url: string, title: string, w: number, h: number) {
  // Calculate the position of the window
  const left = screen.width / 6 - w / 2;
  const top = screen.height / 2 - h / 2;

  // Open the new window
  const features = `width=${w},height=${h},left=${left},top=${top}`;
  const win = window.open(url, title, features);

  // Focus the new window
  if (win) {
    win.focus();
  }
}

export default openOAuthWindow;
