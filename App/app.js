(() => {
  'use strict';
  const KEY = 'loomsketch-studio-v1';
  const GROUPS = {
    Naturals: [
      ['Linen', '#d9d0b6'],
      ['Cream', '#eee7d6'],
      ['Wheat', '#c9ae7b'],
      ['Sand', '#bca47e'],
      ['Flax', '#ded5bf'],
      ['Hemp', '#93866c'],
      ['Cotton', '#e8e3d8'],
      ['Wool', '#c8b89a'],
      ['Jute', '#a78d68'],
      ['Sisal', '#d0c3a4'],
      ['Bark', '#776650'],
      ['Reed', '#a89c7b']
    ],
    Vivid: [
      ['Scarlet', '#d3183e'],
      ['Orange', '#e4731c'],
      ['Amber', '#e9b818'],
      ['Lime', '#abdb18'],
      ['Green', '#19bd5d'],
      ['Teal', '#07b8a0'],
      ['Cyan', '#00afca'],
      ['Blue', '#427de4'],
      ['Indigo', '#3b54dd'],
      ['Violet', '#713ce4'],
      ['Magenta', '#a63fe2'],
      ['Pink', '#fb79ff']
    ],
    Dark: [
      ['Emerald', '#347860'],
      ['Teal', '#367d78'],
      ['Sapphire', '#41699c'],
      ['Indigo', '#505b84'],
      ['Amethyst', '#806994'],
      ['Ruby', '#a44850'],
      ['Garnet', '#713e4a'],
      ['Turquoise', '#59a8a3'],
      ['Jade', '#82a879'],
      ['Cobalt', '#466cbd'],
      ['Peacock', '#306578'],
      ['Plum', '#754e70']
    ],
    Pastels: [
      ['Blush', '#e3b6ac'],
      ['Rose', '#d6a5ae'],
      ['Apricot', '#e8c39f'],
      ['Butter', '#e9dda5'],
      ['Sage', '#b8c6aa'],
      ['Sea glass', '#a9cec3'],
      ['Sky', '#b1c9d7'],
      ['Lilac', '#c8b8d0'],
      ['Peach', '#edc3af'],
      ['Mint', '#bed8c4'],
      ['Powder', '#d4dce5'],
      ['Pale pink', '#e6c9cc']
    ],
    'B/N': [
      ['White', '#ffffff'],
      ['Pale gray', '#e8e8e8'],
      ['Light gray', '#d1d1d1'],
      ['Soft gray', '#bababa'],
      ['Silver', '#a3a3a3'],
      ['Gray', '#8c8c8c'],
      ['Medium gray', '#757575'],
      ['Dark gray', '#5e5e5e'],
      ['Charcoal', '#474747'],
      ['Deep gray', '#303030'],
      ['Near black', '#191919'],
      ['Black', '#000000']
    ]
  };
  const DEFAULT_PATTERN_CATEGORIES = [
    ['1 Linear', '1_Linear', 'Horizontal_1x1 Horizontal_2x1 Horizontal_2x2 Horizontal_3x1 Horizontal_3x2 Horizontal_3x3 Horizontal_4x1 Horizontal_4x2 Horizontal_4x3 Horizontal_4x4 Vertical_1x1 Vertical_2x1 Vertical_2x2 Vertical_3x1 Vertical_3x2 Vertical_3x3 Vertical_4x1 Vertical_4x2 Vertical_4x3 Vertical_4x4'],
    ['2 Diagonal', '2_Diagonal', 'Diagonal_1x7 Diagonal_2x6 Diagonal_2x2 Diagonal_3x3 Diagonal_3x5 Diagonal_4x4 Diagonal_5x3 Diagonal_6x2 Diagonal_7x1'],
    ['3 Chessboard', '3_Chessboard', 'Chessboard_1x1 Chessboard_1x2 Chessboard_1x4 Chessboard_2x1 Chessboard_2x2 Chessboard_3x1 Chessboard_3x2 Chessboard_3x3 Chessboard_4x1 Chessboard_4x2 Chessboard_4x3 Chessboard_4x4 Chessboard_5 Chessboard_6'],
    ['4 Crosses', '4_Crosses', 'Crosses_1 Crosses_1x2 Crosses_1x3 Crosses_1x4 Crosses_2 Crosses_3 Crosses_4 Pierced_Crosses_1x2 Pierced_Crosses_1x3 Pierced_Crosses_1x4 Pierced_Crosses_2'],
    ['5 Diamond', '5_Diamond', 'Diamond_1 Diamond_10 Diamond_2 Diamond_3 Diamond_4 Diamond_5 Diamond_6 Diamond_7 Diamond_8 Diamond_9'],
    ['6 Herringbone', '6_Herringbone', 'Herringbone_1x2 Herringbone_1x3 Herringbone_1x4 Herringbone_2x1 Herringbone_2x2 Herringbone_3x1 Herringbone_3x2 Herringbone_3x3 Herringbone_4x1 Herringbone_4x2 Herringbone_4x3 Herringbone_4x4'],
    ['7 Zigzag', '7_Zigzag', 'Zigzag_1 Zigzag_2 Zigzag_3'],
    ['8 Log Cabin', '8_Logcabin', 'Logcabin_4x4 Logcabin_8x8'],
    ['9 Pied de Poule', '9_PieddePoule', 'Pieddepoule_3x3 Pieddepoule_4x4 Pieddepoule_8x8'],
    ['10 Circle', '10_Circle', 'Circle_1 Circle_2 Circle_4 Circle_3 Circle_5'],
    ['11 Geometry', '11_Geometry', 'Geometry_1 Geometry_2']
  ].map(([folder, assetFolder, names]) => ({
    folder,
    name: folder.replace(/^\d+\s*/, ''),
    patterns: names.split(' ').map(name => ({
      id: `${folder}/${name}`,
      name: name.replace(/_/g, ' '),
      data: `../Assets/Patterns/${encodeURIComponent(assetFolder)}/${encodeURIComponent(name)}.js`,
      previewCanvas: null
    }))
  }));
  const defaultPatternsById = new Map(DEFAULT_PATTERN_CATEGORIES.flatMap(category =>
    category.patterns.map(pattern => [pattern.id, pattern])
  ));
  const defaultPatternMatrices = new Map();
  const $ = id => document.getElementById(id);
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.inputMode = 'numeric';
    let previousValue;
    input.addEventListener('focus', () => {
      previousValue = input.value;
      input.value = '';
      input.style.textAlign = 'center';
    });
    input.addEventListener('blur', () => {
      if (input.value === '') input.value = previousValue;
      previousValue = undefined;
      input.style.removeProperty('text-align');
    });
  });
  const canvas = $('patternCanvas'),
    ctx = canvas.getContext('2d'),
    viewport = $('canvasViewport'),
    selectionOverlay = $('selectionOverlay'),
    selectionBounds = selectionOverlay.querySelector('.selection-bounds'),
    selectionControls = selectionOverlay.querySelector('.selection-controls');
  const getGridColors = () => {
    const canvasColors = getComputedStyle(document.documentElement);
    return {
      cell: canvasColors.getPropertyValue('--canvas-cell-background').trim(),
      alternateCell: canvasColors.getPropertyValue('--canvas-cell-background-alt').trim(),
      line: canvasColors.getPropertyValue('--canvas-grid-line-color').trim(),
      lineWidth: parseFloat(canvasColors.getPropertyValue('--canvas-grid-line-width')) || 1
    };
  };
  let gridColors = getGridColors();
  const state = {
    w: 16,
    h: 52,
    stretch: .3,
    cells: [],
    recentColors: [],
    color: '#000000',
    tool: 'draw',
    sym: 'none',
    rx: 1,
    ry: 1,
    zoom: 100,
    grid: true,
    category: 'B/N',
    patterns: [],
    undo: [],
    redo: [],
    painting: false,
    lastPoint: null,
    selection: null,
    selectionDraft: null,
    customLibraries: []
  };
  let pendingExportPattern = null;
  let editingRecentColors = false;
  let recentPickerDismissTimer;
  const grid = (w, h) => Array.from({
    length: h
  }, () => Array(w).fill(null));
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const ZOOM_SCALE_FACTOR = 0.9;
  const rgb = hex => {
    let s = hex.slice(1);
    if (s.length === 3) s = s.split('').map(x => x + x).join('');
    let n = parseInt(s, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const isLightColor = color => rgb(color)
    .map(channel => channel / 255)
    .map(channel => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4)
    .reduce((luminance, channel, index) => luminance + channel * [.2126, .7152, .0722][index], 0) > .179;
  const hex = (r, g, b) => '#' + [r, g, b].map(x => clamp(Math.round(Number(x) || 0), 0, 255).toString(16).padStart(2, '0')).join('');
  const valid = c => /^#[0-9a-f]{6}$/i.test(c) ? c.toLowerCase() : '#000000';
  const usedColors = cells => [...new Set((Array.isArray(cells) ? cells.flat() : []).filter(c => typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c)).map(valid))];
  const snapshot = () => ({
    w: state.w,
    h: state.h,
    stretch: state.stretch,
    cells: state.cells.map(r => [...r]),
    recentColors: [...state.recentColors],
    color: state.color,
    sym: state.sym,
    rx: state.rx,
    ry: state.ry,
    grid: state.grid
  });

  function setStatus(text) {
    $('statusText').textContent = text;
  }

  function showDialog(dialog) {
    dialog.showModal();
    dialog.focus({ preventScroll: true });
  }

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        pattern: snapshot(),
        recentVersion: 1,
        patterns: state.patterns,
        name: $('statusText').textContent,
        zoom: state.zoom,
        zoomMode: 'fit',
        category: state.category,
        customLibraries: state.customLibraries
      }));
    } catch (e) {
      console.error('Could not save pattern to browser storage.', e);
      setStatus('Storage full — pattern not saved');
    }
  }

  function apply(s) {
    state.w = clamp(+s.w || 16, 4, 64);
    state.h = clamp(+s.h || 16, 4, 200);
    state.stretch = clamp(+s.stretch || ((+s.stretchX + +s.stretchY) / 2) || 1, .1, 1);
    state.cells = grid(state.w, state.h);
    if (Array.isArray(s.cells))
      for (let y = 0; y < state.h; y++)
        for (let x = 0; x < state.w; x++) {
          let c = s.cells[y]?.[x];
          state.cells[y][x] = typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c) ? c : null;
        }
    state.recentColors = Array.isArray(s.recentColors) ? [...new Set(s.recentColors.map(valid))] : [];
    state.color = valid(s.color || state.recentColors[0] || '#000000');
    state.sym = ['none', 'horizontal', 'vertical', 'four'].includes(s.sym) ? s.sym : 'none';
    state.rx = clamp(+s.rx || 1, 1, 4);
    state.ry = clamp(+s.ry || 1, 1, 4);
    state.grid = s.grid !== false;
  }

  function restore() {
    try {
      let saved = localStorage.getItem(KEY);
      if (saved) {
        let data = JSON.parse(saved),
          pattern = data.pattern || {};
        const wasDefaultBlank = pattern.w === 24 && pattern.h === 24 && data.zoom === 210 && data.name === 'Untitled pattern' && Array.isArray(pattern.cells) && pattern.cells.every(row => Array.isArray(row) && row.every(cell => cell === null));
        if (wasDefaultBlank) {
          pattern = {
            ...pattern,
            w: 16,
            h: 52,
            cells: Array.from({ length: 52 }, () => Array(16).fill(null))
          };
          data.zoom = 100;
        }
        if (data.recentVersion !== 1) pattern = { ...pattern, recentColors: usedColors(pattern.cells) };
        apply(pattern);
        state.patterns = Array.isArray(data.patterns) ? data.patterns : Array.isArray(data.designs) ? data.designs : [];
        state.zoom = data.zoomMode === 'fit' ? clamp(+data.zoom || 100, 50, 400) : 100;
        if (Array.isArray(data.customLibraries)) {
          state.customLibraries = data.customLibraries
            .filter(library => library && typeof library.id === 'string' && typeof library.name === 'string' && Array.isArray(library.colors))
            .map(library => ({
              id: library.id,
              name: library.name,
              colors: library.colors.filter(item => Array.isArray(item) && typeof item[0] === 'string' && typeof item[1] === 'string')
            }));
        } else if (Array.isArray(data.custom) && data.custom.length) {
          state.customLibraries = [{ id: 'custom-1', name: 'Custom', colors: data.custom }];
        }
        const legacyCustom = data.category === 'Custom' ? state.customLibraries[0]?.id : null;
        const savedCustomId = typeof data.category === 'string' && data.category.startsWith('custom:')
          ? data.category.slice('custom:'.length)
          : legacyCustom;
        const savedCategory = data.category === 'Earthen' ? 'Vivid' : data.category;
        state.category = Object.hasOwn(GROUPS, savedCategory) ? savedCategory
          : state.customLibraries.some(library => library.id === savedCustomId) ? `custom:${savedCustomId}`
          : 'Naturals';
        $('statusText').textContent = data.name || 'Untitled pattern';
        if (data.recentVersion !== 1 || data.zoomMode !== 'fit' || wasDefaultBlank) persist();
      } else {
        state.cells = grid(state.w, state.h);
      }
    } catch (e) {
      console.error('Could not restore saved pattern.', e);
      state.cells = grid(state.w, state.h);
    }
  }

  function history() {
    state.undo.push(snapshot());
    if (state.undo.length > 60) state.undo.shift();
    state.redo = [];
    historyButtons();
  }

  function historyButtons() {
    $('undoBtn').disabled = !state.undo.length;
    $('redoBtn').disabled = !state.redo.length;
  }

  function selectTool(tool) {
    state.tool = tool;
    const buttons = [...document.querySelectorAll('.tool-button')];
    buttons.forEach(button => button.classList.toggle('active', button.dataset.tool === tool));
    const activeIndex = buttons.findIndex(button => button.dataset.tool === tool);
    document.querySelector('.tool-group').style.setProperty('--active-tool-index', activeIndex);
    canvas.style.cursor = 'crosshair';
    renderSelectionOverlay();
  }

  function restoreHistory(src, dst) {
    if (!src.length) return;
    dst.push(snapshot());
    apply(src.pop());
    state.selection = null;
    state.selectionDraft = null;
    sync();
    render();
    historyButtons();
    persist();
  }

  function setColor(c, updateRecent = true) {
    state.color = valid(c);
    $('colorPicker').value = state.color;
    $('hexInput').value = state.color.slice(1);
    let vals = rgb(state.color);
    ['redSlider', 'greenSlider', 'blueSlider'].forEach((id, i) => {
      $(id).value = vals[i];
      $(id).nextElementSibling.value = vals[i];
      $(id).nextElementSibling.textContent = vals[i];
    });
    if (updateRecent) renderRecent();
    else updateRecentColorSelection();
    updateCustomLibrarySelection();
    updateCustomLibraryAddButton();
  }

  function renderRecent() {
    let root = $('recentColors');
    const editButton = $('editRecentColors');
    editButton.hidden = state.recentColors.length === 0;
    if (editButton.hidden && editingRecentColors) {
      editingRecentColors = false;
      editButton.textContent = 'Edit';
      editButton.setAttribute('aria-pressed', 'false');
    }
    root.replaceChildren();
    state.recentColors.forEach(c => {
      let item = document.createElement('div');
      item.className = 'recent-item';
      item.dataset.color = c;
      let select = document.createElement('button');
      select.className = 'recent-color' + (c === state.color ? ' selected' : '');
      select.style.background = c;
      select.title = editingRecentColors ? `Change ${c} throughout the grid` : `${c} — select`;
      select.setAttribute('aria-label', editingRecentColors ? `Change all ${c} cells in the grid` : `Select ${c}`);
      if (editingRecentColors) {
        const editIcon = document.createElement('img'),
          colorInput = document.createElement('input');
        editIcon.className = 'recent-color-edit-icon';
        editIcon.classList.toggle('dark', isLightColor(c));
        editIcon.src = '../Assets/Icons/Pencil.svg';
        editIcon.alt = '';
        editIcon.setAttribute('aria-hidden', 'true');
        colorInput.type = 'color';
        colorInput.className = 'recent-color-input';
        colorInput.value = c;
        colorInput.setAttribute('aria-label', `Choose replacement for ${c}`);
        let currentColor = c,
          historyRecorded = false;
        const updateColor = () => {
          const previousColor = currentColor,
            replacementColor = valid(colorInput.value),
            hasMatchingCells = state.cells.some(row => row.includes(previousColor));
          currentColor = replaceRecentColor(previousColor, replacementColor, item, select, colorInput, !historyRecorded);
          if (replacementColor !== previousColor && hasMatchingCells) historyRecorded = true;
        };
        colorInput.oninput = updateColor;
        colorInput.onchange = updateColor;
        colorInput.onblur = () => {
          clearTimeout(recentPickerDismissTimer);
          recentPickerDismissTimer = setTimeout(() => {
            const focusedElement = document.activeElement;
            if (!editingRecentColors || focusedElement === $('editRecentColors') ||
                focusedElement?.closest('#recentColors .recent-item')) return;
            updateColor();
            setRecentColorEditing(false);
          }, 0);
        };
        select.append(editIcon);
        item.append(select, colorInput);
        root.append(item);
        return;
      }
      select.onclick = () => {
        setColor(c);
        persist();
      };
      item.append(select);
      root.append(item);
    });
  }

  function setRecentColorEditing(editing) {
    editingRecentColors = editing;
    const button = $('editRecentColors');
    button.textContent = editing ? 'Done' : 'Edit';
    button.setAttribute('aria-pressed', String(editing));
    renderRecent();
  }

  function updateRecentColorSelection() {
    document.querySelectorAll('#recentColors .recent-item').forEach(item => {
      item.querySelector('.recent-color').classList.toggle('selected', item.dataset.color === state.color);
    });
  }

  function replaceRecentColor(previousColor, replacementColor, item, select, colorInput, recordHistory = true) {
    const color = valid(replacementColor);
    if (color === previousColor) return previousColor;
    const changed = state.cells.some(row => row.includes(previousColor));
    if (changed && recordHistory) {
      history();
    }
    if (changed) state.cells = state.cells.map(row => row.map(cell => cell === previousColor ? color : cell));
    state.recentColors = [...new Set(state.recentColors.map(recent => recent === previousColor ? color : recent))];
    if (state.color === previousColor) setColor(color, false);
    const duplicate = [...$('recentColors').querySelectorAll('.recent-item')]
      .find(recentItem => recentItem !== item && recentItem.dataset.color === color);
    duplicate?.remove();
    item.dataset.color = color;
    select.dataset.color = color;
    select.style.background = color;
    select.querySelector('.recent-color-edit-icon')?.classList.toggle('dark', isLightColor(color));
    select.title = `Change ${color} throughout the grid`;
    select.setAttribute('aria-label', `Change all ${color} cells in the grid`);
    colorInput.value = color;
    colorInput.setAttribute('aria-label', `Choose replacement for ${color}`);
    updateRecentColorSelection();
    render();
    persist();
    return color;
  }

  function addRecentColor(color) {
    if (state.recentColors[0] === color) return;
    state.recentColors = state.recentColors.filter(recent => recent !== color);
    state.recentColors.unshift(color);
    renderRecent();
  }

  function renderSwatches() {
    let tabs = $('swatchTabs');
    tabs.replaceChildren();
    [
      'B/N',
      ...Object.keys(GROUPS).filter(name => name !== 'B/N'),
      ...state.customLibraries.map(library => library.id)
    ].forEach(name => {
      let b = document.createElement('button');
      const library = state.customLibraries.find(item => item.id === name);
      const category = library ? `custom:${library.id}` : name;
      b.dataset.category = category;
      b.className = 'swatch-tab' + (state.category === category ? ' active' : '');
      b.textContent = library ? library.name : name;
      b.onclick = () => {
        state.category = category;
        tabs.querySelectorAll('.swatch-tab').forEach(tab => {
          tab.classList.toggle('active', tab.dataset.category === category);
        });
        renderSwatchGrid();
        persist();
      };
      if (library) {
        b.title = 'Double-click to rename library';
        const beginRename = () => {
          if (b.querySelector('input')) return;
          b.style.width = `${b.getBoundingClientRect().width}px`;
          b.classList.add('is-renaming');
          const input = document.createElement('input');
          input.type = 'text';
          input.maxLength = 32;
          input.value = library.name;
          input.setAttribute('aria-label', `Rename ${library.name}`);
          b.replaceChildren(input);
          input.focus();
          input.select();

          let finished = false;
          const finishRename = save => {
            if (finished) return;
            finished = true;
            const newName = input.value.trim();
            if (save && newName) library.name = newName;
            renderSwatches();
            persist();
          };
          input.onblur = () => finishRename(true);
          input.onkeydown = event => {
            event.stopPropagation();
            if (event.key === 'Enter') finishRename(true);
            if (event.key === 'Escape') finishRename(false);
          };
          input.onclick = event => event.stopPropagation();
        };
        b.ondblclick = beginRename;

        let lastTap = null;
        b.addEventListener('touchend', event => {
          const touch = event.changedTouches[0];
          const now = Date.now();
          const isDoubleTap = lastTap
            && now - lastTap.time < 450
            && Math.hypot(touch.clientX - lastTap.x, touch.clientY - lastTap.y) < 24;
          if (isDoubleTap) {
            event.preventDefault();
            lastTap = null;
            beginRename();
          } else {
            lastTap = { time: now, x: touch.clientX, y: touch.clientY };
          }
        }, { passive: false });
      }
      tabs.append(b);
    });
    renderSwatchGrid();
  }

  function renderSwatchGrid() {
    const root = $('swatchGrid');
    root.replaceChildren();
    const activeCustomLibrary = state.customLibraries.find(library => `custom:${library.id}` === state.category);
    let items = activeCustomLibrary ? activeCustomLibrary.colors : GROUPS[state.category];
    const appendSwatch = ([name, c], index) => {
      const wrapper = activeCustomLibrary ? document.createElement('div') : null;
      let b = document.createElement('button');
      b.className = 'color-swatch';
      b.style.background = c;
      b.title = `${name} · ${c}`;
      let label = document.createElement('span');
      label.textContent = name;
      b.append(label);
      b.onclick = () => {
        setColor(c);
        persist();
      };
      if (activeCustomLibrary) {
        wrapper.className = 'custom-library-color' + (c === state.color ? ' selected' : '');
        const remove = document.createElement('button');
        remove.className = 'custom-library-color-remove';
        remove.type = 'button';
        remove.textContent = '×';
        remove.title = `Remove ${name}`;
        remove.setAttribute('aria-label', `Remove ${name} from ${activeCustomLibrary.name}`);
        remove.onclick = event => {
          event.stopPropagation();
          activeCustomLibrary.colors.splice(index, 1);
          renderSwatchGrid();
          persist();
        };
        wrapper.append(b, remove);
        root.append(wrapper);
      } else {
        root.append(b);
      }
    };

    (items || []).forEach(appendSwatch);
    updateCustomLibraryAddButton();
  }

  function updateCustomLibraryAddButton() {
    const button = $('addCustomLibraryColor');
    const library = state.customLibraries.find(item => `custom:${item.id}` === state.category);
    if (!button) return;
    button.hidden = !library;
    button.disabled = !!library && library.colors.some(([, color]) => color === state.color);
  }

  function updateCustomLibrarySelection() {
    const library = state.customLibraries.find(item => `custom:${item.id}` === state.category);
    if (!library) return;
    document.querySelectorAll('#swatchGrid .custom-library-color').forEach((item, index) => {
      item.classList.toggle('selected', library.colors[index]?.[1] === state.color);
    });
  }

  function sync() {
    $('widthInput').value = state.w;
    $('heightInput').value = state.h;
    $('stretchInput').value = Number((state.stretch * 10).toFixed(1));
    $('zoomInput').value = state.zoom;
    $('repeatX').value = state.rx;
    $('repeatY').value = state.ry;
    $('repeatXText').textContent = state.rx;
    $('repeatYText').textContent = state.ry;
    $('gridToggle').checked = state.grid;
    document.querySelectorAll('[data-symmetry]').forEach(b => b.classList.toggle('selected', b.dataset.symmetry === state.sym));
    setColor(state.color);
    renderSwatches();
  }

  function render() {
    gridColors = getGridColors();
    const ruler = 24,
      styles = getComputedStyle(viewport),
      paddingX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight),
      paddingY = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
    const fitCell = Math.max(1, Math.floor(Math.min((viewport.clientWidth - paddingX - ruler) / (state.w * state.rx), (viewport.clientHeight - paddingY - ruler) / (state.h * state.ry * state.stretch)) * .92)),
      cellSize = fitCell * state.zoom * ZOOM_SCALE_FACTOR / 100,
      cellWidth = cellSize,
      cellHeight = cellSize * state.stretch,
      tw = state.w * cellWidth,
      th = state.h * cellHeight,
      W = Math.ceil(ruler + tw * state.rx),
      H = Math.ceil(ruler + th * state.ry),
      dpr = window.devicePixelRatio || 1;
    state.cellWidth = cellWidth;
    state.cellHeight = cellHeight;
    state.ruler = ruler;
    state.tileWidth = tw;
    state.tileHeight = th;
    const fits = W <= viewport.clientWidth - paddingX && H <= viewport.clientHeight - paddingY;
    viewport.style.justifyContent = fits ? 'center' : 'flex-start';
    viewport.style.alignItems = fits ? 'center' : 'flex-start';
    canvas.width = Math.ceil(W * dpr);
    canvas.height = Math.ceil(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#ededed';
    ctx.fillRect(0, 0, W, ruler);
    ctx.fillRect(0, 0, ruler, H);
    for (let ty = 0; ty < state.ry; ty++)
      for (let tx = 0; tx < state.rx; tx++) {
        let ox = ruler + tx * tw,
          oy = ruler + ty * th;
        for (let y = 0; y < state.h; y++)
          for (let x = 0; x < state.w; x++) drawCell(x, y, tx, ty);
        ctx.strokeStyle = '#777777';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(ox, oy, tw, th);
      }
    drawGuides();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#555555';
    ctx.font = `${Math.max(3, Math.min(9, cellWidth * .75, 9 / Math.sqrt(state.rx)))}px Arial,sans-serif`;
    for (let x = 0; x < state.w * state.rx; x++) {
      ctx.fillText(String(x % state.w + 1), ruler + (x + .5) * cellWidth, ruler / 2, cellWidth * .8);
    }
    ctx.font = `${Math.max(3, Math.min(9, cellHeight * .75, 9 / Math.sqrt(state.ry)))}px Arial,sans-serif`;
    for (let y = 0; y < state.h * state.ry; y++) {
      ctx.fillText(String(y % state.h + 1), ruler / 2, ruler + (y + .5) * cellHeight, cellHeight * .8);
    }
    renderSelectionOverlay();
  }

  function renderSelectionOverlay() {
    const selected = state.selectionDraft || state.selection;
    if (!selected || state.tool !== 'select') {
      selectionOverlay.hidden = true;
      return;
    }
    selectionOverlay.hidden = false;
    const cellWidth = state.cellWidth,
      cellHeight = state.cellHeight,
      x = selected.x ?? Math.min(selected.startX, selected.currentX),
      y = selected.y ?? Math.min(selected.startY, selected.currentY),
      width = selected.w ?? Math.abs(selected.currentX - selected.startX) + 1,
      height = selected.h ?? Math.abs(selected.currentY - selected.startY) + 1,
      canvasLeft = canvas.offsetLeft - viewport.scrollLeft,
      canvasTop = canvas.offsetTop - viewport.scrollTop,
      left = canvasLeft + state.ruler + (selected.tileX * state.w + x) * cellWidth,
      top = canvasTop + state.ruler + (selected.tileY * state.h + y) * cellHeight;
    selectionBounds.style.left = `${left}px`;
    selectionBounds.style.top = `${top}px`;
    selectionBounds.style.width = `${width * cellWidth}px`;
    selectionBounds.style.height = `${height * cellHeight}px`;
    selectionControls.hidden = !!state.selectionDraft;
    const rotateButton = selectionControls.querySelector('[data-selection-action="rotate"]'),
      rotateIcon = rotateButton.querySelector('img'),
      canRotate = width === height;
    rotateButton.disabled = !canRotate;
    rotateIcon.hidden = !canRotate;
    if (!state.selectionDraft) {
      const controlWidth = selectionControls.offsetWidth,
        controlHeight = selectionControls.offsetHeight,
        anchorX = canvasLeft + state.ruler + (selected.tileX * state.w + selected.anchorX + .5) * cellWidth,
        anchorY = canvasTop + state.ruler + (selected.tileY * state.h + selected.anchorY + .5) * cellHeight,
        gap = 8,
        alignTop = clamp(anchorY - controlHeight / 2, 0, viewport.clientHeight - controlHeight),
        alignLeft = clamp(anchorX - controlWidth / 2, 0, viewport.clientWidth - controlWidth),
        candidates = [
          { left: left - controlWidth - gap, top: alignTop },
          { left: left + width * cellWidth + gap, top: alignTop },
          { left: alignLeft, top: top - controlHeight - gap },
          { left: alignLeft, top: top + height * cellHeight + gap }
        ].filter(position =>
          position.left >= 0
          && position.top >= 0
          && position.left + controlWidth <= viewport.clientWidth
          && position.top + controlHeight <= viewport.clientHeight
        ),
        nearest = candidates.reduce((best, position) => {
          const dx = Math.max(position.left - anchorX, 0, anchorX - position.left - controlWidth),
            dy = Math.max(position.top - anchorY, 0, anchorY - position.top - controlHeight),
            distance = dx ** 2 + dy ** 2;
          return !best || distance < best.distance ? { ...position, distance } : best;
        }, null),
        controlsLeft = nearest?.left ?? alignLeft,
        controlsTop = nearest?.top ?? alignTop;
      selectionControls.style.left = `${controlsLeft}px`;
      selectionControls.style.top = `${controlsTop}px`;
    }
  }

  function drawCell(x, y, tileX, tileY) {
    const cellWidth = state.cellWidth,
      cellHeight = state.cellHeight,
      ox = state.ruler + tileX * state.tileWidth + x * cellWidth,
      oy = state.ruler + tileY * state.tileHeight + y * cellHeight,
      color = state.cells[y][x];
    ctx.fillStyle = color || ((x + y) % 2 ? gridColors.cell : gridColors.alternateCell);
    ctx.fillRect(ox, oy, cellWidth, cellHeight);
    if (state.grid) {
      ctx.strokeStyle = gridColors.line;
      ctx.lineWidth = gridColors.lineWidth;
      ctx.strokeRect(ox + .15, oy + .15, cellWidth - .3, cellHeight - .3);
    }
  }

  function drawGuides() {
    const vertical = ['horizontal', 'four'].includes(state.sym),
      horizontal = ['vertical', 'four'].includes(state.sym);
    if (!vertical && !horizontal) return;
    ctx.save();
    ctx.strokeStyle = '#809686';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let ty = 0; ty < state.ry; ty++)
      for (let tx = 0; tx < state.rx; tx++) {
        const ox = state.ruler + tx * state.tileWidth,
          oy = state.ruler + ty * state.tileHeight;
        if (vertical) {
          ctx.moveTo(ox + state.tileWidth / 2, oy);
          ctx.lineTo(ox + state.tileWidth / 2, oy + state.tileHeight);
        }
        if (horizontal) {
          ctx.moveTo(ox, oy + state.tileHeight / 2);
          ctx.lineTo(ox + state.tileWidth, oy + state.tileHeight / 2);
        }
      }
    ctx.stroke();
    ctx.restore();
  }

  function drawDirtyCells(changed) {
    if (!changed.size) return;
    for (const key of changed) {
      const [x, y] = key.split(',').map(Number);
      for (let ty = 0; ty < state.ry; ty++)
        for (let tx = 0; tx < state.rx; tx++) drawCell(x, y, tx, ty);
    }
    drawGuides();
  }

  function cellAt(e) {
    let r = canvas.getBoundingClientRect(),
      x = Math.floor((e.clientX - r.left - state.ruler) / state.cellWidth),
      y = Math.floor((e.clientY - r.top - state.ruler) / state.cellHeight);
    if (x < 0 || y < 0 || x >= state.w * state.rx || y >= state.h * state.ry) return null;
    return {
      x,
      y
    };
  }

  function selectionCellAt(e, tileX, tileY) {
    const rect = canvas.getBoundingClientRect(),
      x = Math.floor((e.clientX - rect.left - state.ruler) / state.cellWidth) - tileX * state.w,
      y = Math.floor((e.clientY - rect.top - state.ruler) / state.cellHeight) - tileY * state.h;
    return {
      x: clamp(x, 0, state.w - 1),
      y: clamp(y, 0, state.h - 1)
    };
  }

  function updateSelectionDraft(draft, point) {
    draft.currentX = point.x;
    draft.currentY = point.y;
  }

  function transformSelection(action) {
    const selection = state.selection;
    if (!selection) return;
    const { x, y, w, h } = selection;
    if (((action === 'up' || action === 'down') && h === 1) ||
        ((action === 'left' || action === 'right') && w === 1) ||
        (action === 'rotate' && (w !== h || w === 1))) return;
    const source = Array.from({ length: h }, (_, row) => state.cells[y + row].slice(x, x + w));
    let transformed;
    if (action === 'rotate') {
      transformed = Array.from({ length: w }, () => Array(h));
      for (let row = 0; row < h; row++)
        for (let col = 0; col < w; col++) transformed[col][h - 1 - row] = source[row][col];
    } else {
      const [dx, dy] = action === 'up' ? [0, -1] : action === 'down' ? [0, 1] : action === 'left' ? [-1, 0] : [1, 0],
        moved = Array.from({ length: h }, () => Array(w));
      for (let row = 0; row < h; row++)
        for (let col = 0; col < w; col++) moved[(row + dy + h) % h][(col + dx + w) % w] = source[row][col];
      transformed = moved;
    }
    const placements = [{
      x,
      y,
      flipX: false,
      flipY: false
    }];
    if (['horizontal', 'four'].includes(state.sym)) placements.push({
      x: state.w - x - w,
      y,
      flipX: true,
      flipY: false
    });
    if (['vertical', 'four'].includes(state.sym)) placements.push({
      x,
      y: state.h - y - h,
      flipX: false,
      flipY: true
    });
    if (state.sym === 'four') placements.push({
      x: state.w - x - w,
      y: state.h - y - h,
      flipX: true,
      flipY: true
    });
    history();
    for (const placement of placements)
      for (let row = 0; row < h; row++)
        for (let col = 0; col < w; col++)
          state.cells[placement.y + row][placement.x + col] = null;
    for (const placement of placements)
      for (let row = 0; row < h; row++)
        for (let col = 0; col < w; col++)
          state.cells[placement.y + (placement.flipY ? h - 1 - row : row)][placement.x + (placement.flipX ? w - 1 - col : col)] = transformed[row][col];
    render();
    persist();
  }

  function stroke(x, y, changed) {
    x = ((x % state.w) + state.w) % state.w;
    y = ((y % state.h) + state.h) % state.h;
    let xm = state.w - x - 1,
      ym = state.h - y - 1,
      pts = [
        [x, y]
      ];
    if (['horizontal', 'four'].includes(state.sym)) pts.push([xm, y]);
    if (['vertical', 'four'].includes(state.sym)) pts.push([x, ym]);
    if (state.sym === 'four') pts.push([xm, ym]);
    const color = state.tool === 'erase' ? null : state.color;
    pts.forEach(([a, b]) => {
      if (state.cells[b][a] !== color) {
        state.cells[b][a] = color;
        changed.add(`${a},${b}`);
      }
    });
  }

  function paintSegment(from, to, changed) {
    let x = from.x,
      y = from.y,
      dx = Math.abs(to.x - x),
      sx = x < to.x ? 1 : -1,
      dy = -Math.abs(to.y - y),
      sy = y < to.y ? 1 : -1,
      error = dx + dy;
    while (true) {
      stroke(x, y, changed);
      if (x === to.x && y === to.y) break;
      let twice = 2 * error;
      if (twice >= dy) {
        error += dy;
        x += sx;
      }
      if (twice <= dx) {
        error += dx;
        y += sy;
      }
    }
  }

  function fill(x, y) {
    x = ((x % state.w) + state.w) % state.w;
    y = ((y % state.h) + state.h) % state.h;
    const replacement = state.color,
      mirrorX = ['horizontal', 'four'].includes(state.sym),
      mirrorY = ['vertical', 'four'].includes(state.sym),
      seeds = new Set(),
      stack = [];
    for (const [seedX, seedY] of [
      [x, y],
      ...(mirrorX ? [[state.w - x - 1, y]] : []),
      ...(mirrorY ? [[x, state.h - y - 1]] : []),
      ...(mirrorX && mirrorY ? [[state.w - x - 1, state.h - y - 1]] : [])
    ]) {
      const key = `${seedX},${seedY}`,
        target = state.cells[seedY][seedX];
      if (!seeds.has(key) && target !== replacement) {
        seeds.add(key);
        stack.push([seedX, seedY, target]);
      }
    }
    if (!stack.length) return;
    while (stack.length) {
      let [a, b, target] = stack.pop();
      if (a < 0 || b < 0 || a >= state.w || b >= state.h || state.cells[b][a] !== target) continue;
      state.cells[b][a] = replacement;
      stack.push([a + 1, b, target], [a - 1, b, target], [a, b + 1, target], [a, b - 1, target]);
    }
    addRecentColor(replacement);
  }

  canvas.addEventListener('pointerdown', e => {
    if (e.button === 2) return;
    let p = cellAt(e);
    if (!p) {
      if (state.tool === 'select') {
        state.selection = null;
        state.selectionDraft = null;
        renderSelectionOverlay();
      }
      return;
    }
    canvas.setPointerCapture(e.pointerId);
    if (state.tool === 'select') {
      const tileX = Math.floor(p.x / state.w),
        tileY = Math.floor(p.y / state.h),
        local = { x: p.x % state.w, y: p.y % state.h };
      state.selection = null;
      state.selectionDraft = {
        tileX,
        tileY,
        startX: local.x,
        startY: local.y,
        currentX: local.x,
        currentY: local.y
      };
      renderSelectionOverlay();
      return;
    }
    if (state.tool === 'fill') {
      history();
      fill(p.x, p.y);
      render();
      persist();
      return;
    }
    history();
    state.painting = true;
    state.lastPoint = p;
    let changed = new Set();
    stroke(p.x, p.y, changed);
    if (changed.size && state.tool !== 'erase') addRecentColor(state.color);
    drawDirtyCells(changed);
  });
  canvas.addEventListener('pointermove', e => {
    if (state.selectionDraft) {
      const draft = state.selectionDraft,
        point = selectionCellAt(e, draft.tileX, draft.tileY);
      updateSelectionDraft(draft, point);
      renderSelectionOverlay();
      return;
    }
    if (!state.painting) return;
    let events = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : [],
      samples = events.length ? [...events] : [e],
      last = samples[samples.length - 1];
    if (!last || last.clientX !== e.clientX || last.clientY !== e.clientY) samples.push(e);
    let changed = new Set();
    for (let sample of samples) {
      let p = cellAt(sample);
      if (!p) {
        state.lastPoint = null;
        continue;
      }
      if (state.lastPoint) paintSegment(state.lastPoint, p, changed);
      else stroke(p.x, p.y, changed);
      state.lastPoint = p;
    }
    if (changed.size && state.tool !== 'erase') addRecentColor(state.color);
    drawDirtyCells(changed);
  });

  function endPaint(e) {
    if (state.painting) persist();
    state.painting = false;
    state.lastPoint = null;
    if (state.selectionDraft) {
      const draft = state.selectionDraft;
      if (e.type === 'pointerup') {
        updateSelectionDraft(draft, selectionCellAt(e, draft.tileX, draft.tileY));
      }
      state.selection = {
        tileX: draft.tileX,
        tileY: draft.tileY,
        x: Math.min(draft.startX, draft.currentX),
        y: Math.min(draft.startY, draft.currentY),
        w: Math.abs(draft.currentX - draft.startX) + 1,
        h: Math.abs(draft.currentY - draft.startY) + 1,
        anchorX: draft.currentX,
        anchorY: draft.currentY
      };
      state.selectionDraft = null;
      renderSelectionOverlay();
    }
  }
  canvas.addEventListener('pointerup', endPaint);
  canvas.addEventListener('pointercancel', endPaint);
  canvas.addEventListener('contextmenu', e => e.preventDefault());
  canvas.addEventListener('dragover', event => {
    if (!event.dataTransfer.types.includes('application/x-loom-pattern') || !cellAt(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  });
  canvas.addEventListener('drop', event => {
    const pattern = defaultPatternsById.get(event.dataTransfer.getData('application/x-loom-pattern'));
    if (!pattern || !cellAt(event)) return;
    event.preventDefault();
    placeDefaultPattern(pattern, event);
  });
  viewport.addEventListener('pointerdown', e => {
    if (e.target === canvas || selectionOverlay.contains(e.target) || state.tool !== 'select') return;
    state.selection = null;
    state.selectionDraft = null;
    renderSelectionOverlay();
  });
  viewport.addEventListener('scroll', renderSelectionOverlay);
  selectionControls.addEventListener('click', e => {
    const button = e.target.closest('[data-selection-action]');
    if (button) transformSelection(button.dataset.selectionAction);
  });

  function resizeGrid(w, h) {
    w = clamp(Math.round(+w || state.w), 4, 64);
    h = clamp(Math.round(+h || state.h), 4, 200);
    if (w === state.w && h === state.h) {
      sync();
      return;
    }
    history();
    let next = grid(w, h);
    for (let y = 0; y < Math.min(h, state.h); y++)
      for (let x = 0; x < Math.min(w, state.w); x++) next[y][x] = state.cells[y][x];
    state.cells = next;
    state.w = w;
    state.h = h;
    sync();
    render();
    persist();
  }

  function panel(name) {
    document.querySelectorAll('.sidebar-tab').forEach(b => {
      let active = b.dataset.panel === name;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', String(active));
    });
    ['draw', 'patterns'].forEach(n => $(n + 'Panel').hidden = n !== name);
  }

  function renderDefaultPatterns() {
    const root = $('defaultPatterns');
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    root.replaceChildren();
    DEFAULT_PATTERN_CATEGORIES.forEach(category => {
      const section = document.createElement('details'),
        summary = document.createElement('summary'),
        count = document.createElement('span'),
        grid = document.createElement('div');
      section.className = 'pattern-category';
      section.open = true;
      summary.textContent = category.name;
      count.className = 'pattern-category-count';
      count.textContent = `${category.patterns.length} patterns`;
      summary.append(count);
      grid.className = 'default-pattern-grid';
      category.patterns.forEach(pattern => {
        const button = document.createElement('button'),
          preview = document.createElement('canvas');
        button.type = 'button';
        button.className = 'default-pattern';
        button.draggable = !coarsePointer;
        button.title = pattern.name;
        button.setAttribute('aria-label', pattern.name);
        preview.className = 'default-pattern-preview';
        preview.width = 64;
        preview.height = 64;
        preview.setAttribute('role', 'img');
        preview.setAttribute('aria-label', `${pattern.name} pattern preview`);
        pattern.previewCanvas = preview;
        button.append(preview);
        button.addEventListener('dragstart', event => {
          event.dataTransfer.effectAllowed = 'copy';
          event.dataTransfer.setData('application/x-loom-pattern', pattern.id);
        });
        button.addEventListener('pointerdown', event => {
          if (event.pointerType !== 'touch' && !coarsePointer) return;
          event.preventDefault();
          const pointerId = event.pointerId,
            wasDraggable = button.draggable;
          button.draggable = false;
          const ghost = document.createElement('img');
          ghost.className = 'touch-pattern-drag';
          ghost.src = preview.toDataURL();
          ghost.alt = '';
          ghost.setAttribute('aria-hidden', 'true');
          document.body.append(ghost);
          const moveGhost = pointerEvent => {
            if (pointerEvent.pointerId !== pointerId) return;
            ghost.style.left = `${pointerEvent.clientX}px`;
            ghost.style.top = `${pointerEvent.clientY}px`;
          };
          const endDrag = pointerEvent => {
            if (pointerEvent.pointerId !== pointerId) return;
            moveGhost(pointerEvent);
            const canvasRect = canvas.getBoundingClientRect();
            if (pointerEvent.type === 'pointerup' &&
                pointerEvent.clientX >= canvasRect.left && pointerEvent.clientX <= canvasRect.right &&
                pointerEvent.clientY >= canvasRect.top && pointerEvent.clientY <= canvasRect.bottom &&
                cellAt(pointerEvent)) {
              placeDefaultPattern(pattern, pointerEvent);
            }
            ghost.remove();
            button.draggable = wasDraggable;
            document.removeEventListener('pointermove', moveGhost);
            document.removeEventListener('pointerup', endDrag);
            document.removeEventListener('pointercancel', endDrag);
          };
          moveGhost(event);
          document.addEventListener('pointermove', moveGhost);
          document.addEventListener('pointerup', endDrag);
          document.addEventListener('pointercancel', endDrag);
        });
        grid.append(button);
      });
      section.append(summary, grid);
      section.addEventListener('toggle', () => {
        if (section.open) renderDefaultPatternPreviews(category);
      });
      root.append(section);
      if (section.open) renderDefaultPatternPreviews(category);
    });
  }

  function renderDefaultPatternPreviews(category) {
    category.patterns.forEach(pattern => {
      const canvas = pattern.previewCanvas;
      if (!canvas || canvas.dataset.loaded || canvas.dataset.loading) return;
      canvas.dataset.loading = 'true';
      loadDefaultPattern(pattern).then(matrix => {
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Could not draw the default pattern preview.');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        matrix.forEach((row, y) => row.forEach((cell, x) => {
          context.fillStyle = cell;
          context.fillRect(x * canvas.width / 16, y * canvas.height / 16, canvas.width / 16, canvas.height / 16);
        }));
        canvas.dataset.loaded = 'true';
        delete canvas.dataset.loading;
      }).catch(error => {
        delete canvas.dataset.loading;
        console.error(`Could not render default pattern preview "${pattern.name}".`, error);
        const feedback = $('patternLibraryFeedback');
        feedback.textContent = `Could not load ${pattern.name}. Check the pattern JS file and try again.`;
        feedback.hidden = false;
      });
    });
  }

  async function loadDefaultPattern(pattern) {
    if (defaultPatternMatrices.has(pattern.id)) return defaultPatternMatrices.get(pattern.id);
    const matrixPromise = (async () => {
      const response = await fetch(pattern.data);
      if (!response.ok) throw new Error(`Could not load ${pattern.data}: ${response.status}`);
      const source = (await response.text()).replace(/^\uFEFF/, ''),
        match = source.match(/^\s*const pattern = ([\s\S]*?);\s*export default pattern;\s*$/);
      if (!match) throw new Error(`Invalid pattern data in ${pattern.data}`);
      const data = JSON.parse(match[1]);
      if (!Array.isArray(data.matrix) || data.matrix.length !== 16 ||
          data.matrix.some(row => !Array.isArray(row) || row.length !== 16 ||
            row.some(cell => cell !== '#000000' && cell !== '#ffffff'))) {
        throw new Error(`Invalid pattern matrix in ${pattern.data}`);
      }
      return data.matrix;
    })();
    defaultPatternMatrices.set(pattern.id, matrixPromise);
    try {
      return await matrixPromise;
    } catch (error) {
      defaultPatternMatrices.delete(pattern.id);
      throw error;
    }
  }

  async function placeDefaultPattern(pattern, event) {
    const point = cellAt(event);
    if (!point) return;
    const feedback = $('patternLibraryFeedback');
    feedback.hidden = true;
    try {
      const matrix = await loadDefaultPattern(pattern),
        patternHeight = matrix.length,
        patternWidth = matrix[0].length,
        selection = state.selection,
        minX = selection?.x ?? 0,
        minY = selection?.y ?? 0,
        maxX = selection ? selection.x + selection.w : state.w,
        maxY = selection ? selection.y + selection.h : state.h,
        patternIndex = (index, origin, size) => (index - origin) % size;
      let changed = false;
      for (let y = minY; y < maxY; y++)
        for (let x = minX; x < maxX; x++) {
          const nextColor = matrix[patternIndex(y, minY, patternHeight)][patternIndex(x, minX, patternWidth)];
          if (state.cells[y][x] !== nextColor) changed = true;
        }
      addRecentColor('#000000');
      addRecentColor('#ffffff');
      if (!changed) {
        persist();
        return;
      }
      history();
      for (let y = minY; y < maxY; y++)
        for (let x = minX; x < maxX; x++)
          state.cells[y][x] = matrix[patternIndex(y, minY, patternHeight)][patternIndex(x, minX, patternWidth)];
      render();
      persist();
    } catch (error) {
      console.error(`Could not place default pattern "${pattern.name}".`, error);
      feedback.textContent = `Could not load ${pattern.name}. Check the pattern JS file and try again.`;
      feedback.hidden = false;
    }
  }

  function exportCanvas(includeRulers = false, options = {}, pattern = state) {
    const isCurrentPattern = pattern === state,
      patternWidth = pattern.w,
      patternHeight = pattern.h,
      cells = pattern.cells,
      cellWidth = Math.max(1, Math.round(isCurrentPattern ? state.cellWidth : 32)),
      cellHeight = Math.max(1, Math.round(isCurrentPattern ? state.cellHeight : cellWidth * (pattern.stretch ?? 1))),
      patternGrid = pattern.grid ?? state.grid;
    let c = document.createElement('canvas'),
      showNumbers = options.showNumbers ?? includeRulers,
      showGrid = options.showGrid ?? patternGrid,
      transparentBackground = options.transparentBackground ?? false,
      ruler = showNumbers ? 24 : 0;
    c.width = ruler + patternWidth * cellWidth;
    c.height = ruler + patternHeight * cellHeight;
    let g = c.getContext('2d');
    if (showNumbers) {
      g.fillStyle = '#ededed';
      g.fillRect(0, 0, c.width, ruler);
      g.fillRect(0, 0, ruler, c.height);
    }
    for (let y = 0; y < patternHeight; y++)
      for (let x = 0; x < patternWidth; x++) {
        const color = cells[y][x];
        if (color || !transparentBackground) {
          g.fillStyle = color || ((x + y) % 2 ? gridColors.cell : gridColors.alternateCell);
          g.fillRect(ruler + x * cellWidth, ruler + y * cellHeight, cellWidth, cellHeight);
        }
        if (showGrid) {
          g.strokeStyle = gridColors.line;
          g.lineWidth = gridColors.lineWidth;
          g.strokeRect(ruler + x * cellWidth, ruler + y * cellHeight, cellWidth, cellHeight);
        }
      }
    if (showNumbers) {
      g.strokeStyle = '#777777';
      g.lineWidth = 1.5;
      g.strokeRect(ruler, ruler, patternWidth * cellWidth, patternHeight * cellHeight);
      g.font = '9px Arial,sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillStyle = '#555555';
      for (let x = 0; x < patternWidth; x++) g.fillText(String(x + 1), ruler + (x + .5) * cellWidth, ruler / 2);
      for (let y = 0; y < patternHeight; y++) g.fillText(String(y + 1), ruler / 2, ruler + (y + .5) * cellHeight);
    }
    return c;
  }

  function download(blob, name) {
    let url = URL.createObjectURL(blob),
      a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  let exportStatusTimeout = null;
  let exportStatusName = '';

  function exportName(extension, patternName) {
    const name = patternName ?? (exportStatusTimeout ? exportStatusName : $('statusText').textContent);
    return (name.replace(/[^\w-]+/g, '-').toLowerCase() || 'loom-pattern') + '.' + extension;
  }

  function reportExportStatus(message) {
    if (exportStatusTimeout) clearTimeout(exportStatusTimeout);
    else exportStatusName = $('statusText').textContent;
    setStatus(message);
    exportStatusTimeout = setTimeout(() => {
      setStatus(exportStatusName);
      exportStatusTimeout = null;
      exportStatusName = '';
    }, 1500);
  }

  function getExportOptions() {
    return {
      showNumbers: $('exportShowNumbers').checked,
      showGrid: $('exportShowGrid').checked,
      transparentBackground: $('exportTransparentBackground').checked
    };
  }

  function png(options, pattern = state, patternName) {
    exportCanvas(true, options, pattern).toBlob(b => {
      if (!b) {
        reportExportStatus('Could not export PNG');
        return;
      }
      download(b, exportName('png', patternName));
    }, 'image/png');
  }

  async function compressPDFData(bytes) {
    const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  function pdf(options, pattern = state, patternName) {
    const canvas = exportCanvas(true, options, pattern);
    canvas.toBlob(async image => {
      if (!image) {
        return;
      }

      try {
        let imageBytes = new Uint8Array(await image.arrayBuffer()),
          alphaBytes = null;
        if (options.transparentBackground) {
          const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data,
            rgbPixels = new Uint8Array(canvas.width * canvas.height * 3),
            alphaPixels = new Uint8Array(canvas.width * canvas.height);
          for (let pixel = 0; pixel < alphaPixels.length; pixel++) {
            rgbPixels[pixel * 3] = pixels[pixel * 4];
            rgbPixels[pixel * 3 + 1] = pixels[pixel * 4 + 1];
            rgbPixels[pixel * 3 + 2] = pixels[pixel * 4 + 2];
            alphaPixels[pixel] = pixels[pixel * 4 + 3];
          }
          [imageBytes, alphaBytes] = await Promise.all([compressPDFData(rgbPixels), compressPDFData(alphaPixels)]);
        }
        const
          encoder = new TextEncoder(),
          parts = [],
          offsets = Array(7).fill(0);
        let byteLength = 0;
        const append = part => {
          const bytes = typeof part === 'string' ? encoder.encode(part) : part;
          parts.push(bytes);
          byteLength += bytes.byteLength;
        };
        const object = (number, content) => {
          offsets[number] = byteLength;
          append(`${number} 0 obj\n${content}\nendobj\n`);
        };

        append('%PDF-1.4\n');
        object(1, '<< /Type /Catalog /Pages 2 0 R >>');
        object(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
        object(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${canvas.width} ${canvas.height}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
        offsets[4] = byteLength;
        const imageFilter = alphaBytes ? 'FlateDecode' : 'DCTDecode',
          softMask = alphaBytes ? '/SMask 6 0 R ' : '';
        append(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 ${softMask}/Filter /${imageFilter} /Length ${imageBytes.byteLength} >>\nstream\n`);
        append(imageBytes);
        append('\nendstream\nendobj\n');
        if (alphaBytes) {
          offsets[6] = byteLength;
          append(`6 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /FlateDecode /Length ${alphaBytes.byteLength} >>\nstream\n`);
          append(alphaBytes);
          append('\nendstream\nendobj\n');
        }

        const content = `q\n${canvas.width} 0 0 ${canvas.height} 0 0 cm\n/Im0 Do\nQ\n`;
        object(5, `<< /Length ${encoder.encode(content).byteLength} >>\nstream\n${content}endstream`);

        const xrefOffset = byteLength;
        const objectCount = alphaBytes ? 7 : 6;
        append(`xref\n0 ${objectCount}\n0000000000 65535 f \n${offsets.slice(1, objectCount).map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objectCount} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);
        download(new Blob(parts, { type: 'application/pdf' }), exportName('pdf', patternName));
      } catch (error) {
        console.error('Could not export PDF.', error);
        reportExportStatus('Could not export PDF');
      }
    }, 'image/jpeg', 0.95);
  }

  function javascript(pattern = state, patternName) {
    const warp = pattern.w,
      weft = pattern.h;
    const exportPattern = {
      warp,
      weft,
      threadWidth: Number(((pattern.stretch ?? 1) * 10).toFixed(1)),
      width: warp,
      height: weft,
      cells: pattern.cells,
      grid: pattern.grid ?? state.grid
    };
    const source = `const pattern = ${JSON.stringify(exportPattern, null, 2)};\n\nexport default pattern;\n`;
    download(new Blob([source], { type: 'text/javascript;charset=utf-8' }), exportName('js', patternName));
  }

  function parseJavaScriptProject(source) {
    const match = source.replace(/^\uFEFF/, '').match(/^\s*const pattern = ([\s\S]*?);\s*export default pattern;\s*$/);
    if (!match) throw new Error('The file is not a supported JavaScript project.');

    const project = JSON.parse(match[1]);
    const warp = project?.warp ?? project?.width,
      weft = project?.weft ?? project?.height;
    if (!project || !Number.isInteger(warp) || warp < 4 || warp > 64 ||
        !Number.isInteger(weft) || weft < 4 || weft > 200 ||
        (project.threadWidth !== undefined &&
          (typeof project.threadWidth !== 'number' || !Number.isFinite(project.threadWidth) ||
            project.threadWidth < 1 || project.threadWidth > 10)) ||
        typeof project.grid !== 'boolean' || !Array.isArray(project.cells) ||
        project.cells.length !== weft ||
        project.cells.some(row => !Array.isArray(row) || row.length !== warp ||
          row.some(cell => cell !== null && (typeof cell !== 'string' || !/^#[0-9a-f]{6}$/i.test(cell))))) {
      throw new Error('The JavaScript project contains invalid pattern data.');
    }

    return {
      w: warp,
      h: weft,
      stretch: project.threadWidth === undefined ? undefined : project.threadWidth / 10,
      cells: project.cells,
      grid: project.grid
    };
  }

  function renderPatterns() {
    const root = $('patternList'),
      actions = $('patternsDialogActions'),
      openProject = $('openProjectButton'),
      hasPatterns = state.patterns.length > 0;
    root.replaceChildren();
    actions.classList.toggle('has-patterns', hasPatterns);
    root.classList.toggle('is-empty', !hasPatterns);
    $('patternCount').textContent = `${state.patterns.length} ${state.patterns.length===1?'pattern':'patterns'}`;
    if (!hasPatterns) {
      const empty = document.createElement('div'),
        message = document.createElement('p');
      empty.className = 'empty-patterns';
      message.textContent = 'No saved patterns yet.';
      empty.append(message, openProject);
      root.append(empty);
      return;
    } [...state.patterns].reverse().forEach(d => {
      let card = document.createElement('div');
      card.className = 'pattern-card';
      let img = document.createElement('img');
      img.className = 'pattern-preview';
      img.src = d.preview;
      img.alt = `${d.name} preview`;
      let meta = document.createElement('div');
      meta.className = 'pattern-meta';
      let title = document.createElement('b');
      title.textContent = d.name;
      let details = document.createElement('span');
      details.textContent = `${d.w} × ${d.h} · ${new Date(d.date).toLocaleDateString()}`;
      meta.append(title, details);
      let actions = document.createElement('div');
      actions.className = 'pattern-card-actions';
      let exportButton = document.createElement('button');
      exportButton.type = 'button';
      exportButton.className = 'export-pattern';
      exportButton.setAttribute('aria-label', `Export pattern ${d.name}`);
      exportButton.title = 'Export pattern';
      let exportIcon = document.createElement('img');
      exportIcon.className = 'ui-icon';
      exportIcon.src = '../Assets/Icons/Download.svg';
      exportIcon.alt = '';
      exportIcon.setAttribute('aria-hidden', 'true');
      exportButton.append(exportIcon);
      exportButton.onclick = () => {
        pendingExportPattern = d;
        showDialog($('exportDialog'));
      };
      let open = document.createElement('button');
      open.className = 'open-pattern';
      let openLabel = document.createElement('span');
      openLabel.textContent = 'Open';
      open.append(openLabel);
      open.onclick = () => {
        apply(d.pattern);
        setStatus(d.name);
        state.undo = [];
        state.redo = [];
        sync();
        render();
        historyButtons();
        persist();
        $('patternsDialog').close();
      };
      let del = document.createElement('button');
      del.className = 'delete-pattern';
      del.setAttribute('aria-label', 'Delete pattern');
      del.title = 'Delete pattern';
      let deleteIcon = document.createElement('img');
      deleteIcon.className = 'ui-icon';
      deleteIcon.src = '../Assets/Icons/Trashbin.svg';
      deleteIcon.alt = '';
      deleteIcon.setAttribute('aria-hidden', 'true');
      del.append(deleteIcon);
      del.onclick = () => {
        if (!del.classList.contains('is-confirming')) {
          let confirmation = document.createElement('span');
          confirmation.textContent = 'Delete?';
          del.insertBefore(confirmation, deleteIcon);
          del.classList.add('is-confirming');
          del.setAttribute('aria-label', 'Confirm delete pattern');
          del.title = 'Delete?';
          return;
        }
        state.patterns = state.patterns.filter(item => item.id !== d.id);
        persist();
        renderPatterns();
      };
      actions.append(open, exportButton, del);
      card.append(img, meta, actions);
      root.append(card);
    });
    $('patternsDialogActions').append(openProject);
  }

  function savePattern(name) {
    state.patterns.push({
      id: Date.now() + '-' + Math.random(),
      name: name.trim() || 'Pattern',
      w: state.w,
      h: state.h,
      date: new Date().toISOString(),
      pattern: snapshot(),
      preview: exportCanvas().toDataURL('image/png')
    });
    setStatus(name.trim() || 'Pattern');
    persist();
    state.undo = [];
    historyButtons();
  }

  document.querySelectorAll('.tool-button').forEach(b => b.onclick = () => selectTool(b.dataset.tool));
  document.querySelectorAll('.sidebar-tab').forEach(b => b.onclick = () => panel(b.dataset.panel));
  document.querySelectorAll('[data-symmetry]').forEach(b => b.onclick = () => {
    state.sym = b.dataset.symmetry;
    document.querySelectorAll('[data-symmetry]').forEach(x => x.classList.toggle('selected', x === b));
    render();
    persist();
  });
  $('widthInput').onchange = () => resizeGrid(Math.round((+$('widthInput').value || state.w) / 2) * 2, state.h);
  $('heightInput').onchange = () => resizeGrid(state.w, $('heightInput').value);
  $('stretchInput').onchange = e => {
    const value = Number(e.target.value);
    if (!Number.isFinite(value)) {
      sync();
      return;
    }
    state.stretch = clamp(Math.round(value * 2) / 2, 1, 10) / 10;
    sync();
    render();
    persist();
  };
  $('zoomInput').onchange = () => {
    state.zoom = clamp(+$('zoomInput').value || 100, 50, 400);
    sync();
    render();
    persist();
  };

  function zoom(n) {
    state.zoom = clamp(state.zoom + n, 50, 400);
    sync();
    render();
    persist();
  }
  $('zoomIn').onclick = () => zoom(10);
  $('zoomOut').onclick = () => zoom(-10);
  $('repeatX').oninput = e => {
    state.rx = +e.target.value;
    $('repeatXText').textContent = state.rx;
    render();
    persist();
  };
  $('repeatY').oninput = e => {
    state.ry = +e.target.value;
    $('repeatYText').textContent = state.ry;
    render();
    persist();
  };
  $('gridToggle').onchange = e => {
    state.grid = e.target.checked;
    render();
    persist();
  };
  $('undoBtn').onclick = () => restoreHistory(state.undo, state.redo);
  $('redoBtn').onclick = () => restoreHistory(state.redo, state.undo);
  document.addEventListener('pointerdown', event => {
    if (!editingRecentColors || !(event.target instanceof Element) ||
        event.target.closest('#editRecentColors, #recentColors .recent-item')) return;
    setRecentColorEditing(false);
  }, true);
  $('editRecentColors').onclick = event => {
    setRecentColorEditing(!editingRecentColors);
  };
  $('addCustomLibraryColor').onclick = () => {
    const library = state.customLibraries.find(item => `custom:${item.id}` === state.category);
    if (!library || library.colors.some(([, color]) => color === state.color)) return;
    library.colors.push([`Color ${library.colors.length + 1}`, state.color]);
    renderSwatches();
    persist();
  };
  $('addCustomSwatch').onclick = () => {
    let id = 1;
    while (state.customLibraries.some(library => library.id === `custom-${id}`)) id++;
    const library = { id: `custom-${id}`, name: `Custom ${id}`, colors: [] };
    state.customLibraries.push(library);
    state.category = `custom:${library.id}`;
    renderSwatches();
    persist();
  };

  $('colorPicker').oninput = e => {
    setColor(e.target.value);
    persist();
  };
  function applyHexInput(input) {
    let c = input.value.trim();
    c = '#' + c;
    if (/^#[0-9a-f]{6}$/i.test(c)) {
      setColor(c);
      persist();
      return true;
    }
    return false;
  }
  $('hexInput').oninput = e => {
    if (/^[0-9a-f]{6}$/i.test(e.target.value.trim())) applyHexInput(e.target);
  };
  $('hexInput').onchange = e => {
    if (!applyHexInput(e.target)) e.target.value = state.color.slice(1);
  };
  ['redSlider', 'greenSlider', 'blueSlider'].forEach((id, index) => $(id).oninput = () => {
    let slider = $(id);
    slider.nextElementSibling.value = slider.value;
    slider.nextElementSibling.textContent = slider.value;
    setColor(hex(...['redSlider', 'greenSlider', 'blueSlider'].map(x => $(x).value)));
    persist();
  });
  $('saveVersion').onclick = () => {
    $('patternNameInput').value = $('statusText').textContent === 'Untitled pattern' ? '' : $('statusText').textContent;
    showDialog($('nameDialog'));
  };
  $('nameForm').onsubmit = e => {
    e.preventDefault();
    savePattern($('patternNameInput').value);
    $('nameDialog').close();
  };
  $('myPatterns').onclick = () => {
    $('openProjectFeedback').hidden = true;
    renderPatterns();
    showDialog($('patternsDialog'));
  };
  $('openProjectButton').onclick = () => $('openProjectInput').click();
  $('openProjectInput').onchange = async event => {
    const input = event.target,
      file = input.files[0],
      feedback = $('openProjectFeedback');
    input.value = '';
    if (!file) return;

    try {
      const pattern = parseJavaScriptProject(await file.text()),
        projectName = file.name.replace(/\.(?:m?js)$/i, '').trim() || 'Untitled pattern';
      apply(pattern);
      state.undo = [];
      state.redo = [];
      setStatus(projectName);
      sync();
      render();
      historyButtons();
      persist();
      feedback.hidden = true;
      $('patternsDialog').close();
    } catch (error) {
      console.error('Could not open JavaScript project.', error);
      feedback.textContent = 'Could not open this file. Choose a valid JavaScript project exported from this app.';
      feedback.hidden = false;
    }
  };
  $('gridSettingsButton').onclick = () => {
    const dialog = $('gridSettingsDialog');
    const toolbarBottom = document.querySelector('.toolbar').getBoundingClientRect().bottom;
    dialog.style.top = `${toolbarBottom + 20}px`;
    showDialog(dialog);
    $('gridSettingsButton').setAttribute('aria-expanded', 'true');
  };
  $('gridSettingsDialog').addEventListener('click', e => {
    const dialog = e.currentTarget;
    const bounds = dialog.getBoundingClientRect();
    if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) {
      dialog.close();
    }
  });
  $('gridSettingsDialog').addEventListener('close', () => $('gridSettingsButton').setAttribute('aria-expanded', 'false'));
  document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => b.closest('dialog').close());
  $('export-button').onclick = () => {
    pendingExportPattern = null;
    showDialog($('exportDialog'));
  };
  $('exportDialog').addEventListener('click', event => {
    const button = event.target.closest('[data-export-format]');
    if (!button) return;

    const options = getExportOptions();
    const pattern = pendingExportPattern?.pattern ?? state,
      patternName = pendingExportPattern?.name;
    pendingExportPattern = null;
    $('exportDialog').close();
    if (button.dataset.exportFormat === 'png') png(options, pattern, patternName);
    else if (button.dataset.exportFormat === 'pdf') pdf(options, pattern, patternName);
    else if (button.dataset.exportFormat === 'javascript') javascript(pattern, patternName);
  });
  $('clearBtn').onclick = () => {
    history();
    state.cells = grid(state.w, state.h);
    setStatus('Untitled pattern');
    render();
    persist();
  };
  document.querySelectorAll('.number-stepper-buttons button').forEach(button => {
    button.onclick = () => {
      const input = button.closest('.number-stepper').querySelector('input');
      input[button.dataset.step === 'up' ? 'stepUp' : 'stepDown']();
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement && ['text', 'number'].includes(e.target.type)) {
      e.target.blur();
    }
    let typing = e.target instanceof HTMLElement && (e.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName));
    const commandKey = e.ctrlKey || e.metaKey;
    if (commandKey && !e.altKey && e.key.toLowerCase() === 's') {
      e.preventDefault();
      if (!document.querySelector('dialog[open]')) $('saveVersion').click();
      return;
    }
    if (commandKey && !e.altKey && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      restoreHistory(e.shiftKey ? state.redo : state.undo, e.shiftKey ? state.undo : state.redo);
      return;
    }
    if (commandKey && !e.altKey && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      restoreHistory(state.redo, state.undo);
      return;
    }
    if (typing || document.querySelector('dialog[open]') || commandKey || e.altKey || e.repeat) return;
    let tool = {
      d: 'draw',
      e: 'erase',
      f: 'fill',
      s: 'select'
    } [e.key.toLowerCase()];
    if (tool) {
      selectTool(tool);
    }
  });
  window.addEventListener('resize', render);
  restore();
  renderDefaultPatterns();
  selectTool(state.tool);
  sync();
  historyButtons();
  render();
})();