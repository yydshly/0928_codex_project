document.querySelectorAll('[role="tablist"]').forEach((tablist) => {
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
  function selectTab(nextTab, shouldFocus = false) {
    tabs.forEach((tab) => {
      const active = tab === nextTab;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.id !== nextTab.getAttribute('aria-controls');
    });
    if (shouldFocus) nextTab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (event) => {
      let targetIndex;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') targetIndex = (index + 1) % tabs.length;
      else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') targetIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') targetIndex = 0;
      else if (event.key === 'End') targetIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      selectTab(tabs[targetIndex], true);
    });
  });
});

// This interaction explains frame indexing; it never requests or generates audio.
const maskStart = document.getElementById('mask-start');
const maskEnd = document.getElementById('mask-end');
const maskTrack = document.getElementById('mask-track');
const maskCells = Array.from({ length: 12 }, (_, index) => {
  const cell = document.createElement('span');
  cell.textContent = String(index + 1).padStart(2, '0');
  maskTrack.appendChild(cell);
  return cell;
});

function updateMask(changed) {
  let start = Number(maskStart.value);
  let end = Number(maskEnd.value);
  if (start >= end) {
    if (changed === maskStart) end = start + 1;
    else start = end - 1;
  }
  maskStart.value = String(start);
  maskEnd.value = String(end);
  document.getElementById('mask-start-value').value = `${start} 秒`;
  document.getElementById('mask-end-value').value = `${end} 秒`;
  maskCells.forEach((cell, index) => cell.classList.toggle('regenerate', index >= start && index < end));
  document.getElementById('mask-result').textContent =
    `区间 [${start}, ${end}) 秒 → 帧索引 [${start * 25}, ${end * 25})：${(end - start) * 25} 帧允许生成，其余 ${300 - (end - start) * 25} 帧受源音频约束。`;
}
maskStart.addEventListener('input', () => updateMask(maskStart));
maskEnd.addEventListener('input', () => updateMask(maskEnd));
updateMask();

// Stream attributed upstream examples; do not simulate a generation job.
const samplePlayers = Array.from(document.querySelectorAll('.sample-card audio'));
samplePlayers.forEach((audio) => {
  const button = document.querySelector('[data-audio="' + audio.id + '"]');
  const status = audio.parentElement.querySelector('.playback-status');
  const label = button.textContent;
  button.addEventListener('click', async () => {
    if (!audio.paused) {
      audio.pause();
      return;
    }
    status.textContent = '正在加载官方音频…';
    button.disabled = true;
    try {
      await audio.play();
    } catch {
      status.textContent = '音频暂时无法播放，可打开下方官方试听区重试。';
    } finally {
      button.disabled = false;
    }
  });
  audio.addEventListener('play', () => {
    samplePlayers.forEach((other) => { if (other !== audio) other.pause(); });
    button.textContent = 'Ⅱ 暂停试听';
    status.textContent = '正在播放模型团队公开样例';
  });
  audio.addEventListener('pause', () => {
    button.textContent = label;
    if (!audio.error) status.textContent = audio.ended ? '试听结束，可以重新播放' : '已暂停，可拖动进度继续试听';
  });
  audio.addEventListener('error', () => {
    button.disabled = false;
    button.textContent = label;
    status.textContent = '音频加载失败，请检查网络或打开官方试听区。';
  });
});
