// Minimal demo dataset generator for the voxel viewer.
// Exposes a global function `generateTestDataset()` used by voxel-app.js
// when no selection is provided from the main viewer.

(function () {
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function makeRect(x0, y0, w, h) {
    return [
      [x0, y0],
      [x0 + w, y0],
      [x0 + w, y0 + h],
      [x0, y0 + h]
    ];
  }

  // Build a small synthetic dataset: bounds 0..99 x/y, 5 planes in depth.
  function generateTestDataset() {
    const left = 0, top = 0, right = 99, bottom = 99, depth = 4; // planes: 0..4

    // A few cell polygons per plane with simple colors
    const cells = [];
    const cellColors = ['#FF5555', '#55FF55', '#5555FF', '#FFAA00', '#AA00FF'];
    let cellId = 1;
    for (let plane = 0; plane <= depth; plane++) {
      const cx = 10 + plane * 3;
      const cy = 10 + plane * 2;
      cells.push({
        plane,
        cellId: cellId,
        cellColor: cellColors[plane % cellColors.length],
        clippedBoundary: makeRect(cx, cy, 30, 30)
      });
      cells.push({
        plane,
        cellId: cellId + 1,
        cellColor: cellColors[(plane + 1) % cellColors.length],
        clippedBoundary: makeRect(cx + 35, cy + 10, 25, 25)
      });
      cellId += 2;
    }

    // A few genes and random-ish spots with parent cell associations
    const genes = ['Gad1', 'Pvalb', 'Rorb', 'Slc1a2', 'Reln'];
    const spots = [];
    let spotId = 1;
    for (let plane = 0; plane <= depth; plane++) {
      for (let i = 0; i < 200; i++) {
        const gene = genes[i % genes.length];
        const x = randInt(left, right);
        const y = randInt(top, bottom);
        // Assign parent cell roughly based on region
        const parent = (x < 50 && y < 60) ? (1 + plane * 2) : (2 + plane * 2);
        const parentX = x + (x < 50 ? 5 : -5);
        const parentY = y + (y < 60 ? 5 : -5);
        spots.push({
          gene,
          x,
          y,
          z: plane, // original depth scale
          plane_id: plane,
          spot_id: spotId++,
          parent_cell_id: parent,
          parent_cell_X: parentX,
          parent_cell_Y: parentY,
          parent_cell_Z: plane
        });
      }
    }

    return {
      bounds: { left, right, top, bottom, depth },
      spots: { count: spots.length, data: spots },
      cells: { count: cells.length, data: cells }
    };
  }

  // Expose globally
  window.generateTestDataset = generateTestDataset;
})();

