import { CellActions, CellSlice, CellState, initialState } from './CellSlice';

const { reducer } = CellSlice;
const {
  addSticky,
  addText,
  moveCellsBySelected,
  selectDisplayCells,
  clearSelected,
  moveCell,
  resizeCells,
  createGroup,
  selectCellsByRect,
  selectGroup,
  translate,
  scale,
  editingCell,
  finishEditing,
  addLine,
  resizeLine,
  deleteCells,
} = CellActions;

describe('测试 CellSlice', () => {
  describe('测试创建便利贴场景', () => {
    it('当调用 addSticky 时，将创建一个便利贴', () => {
      let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
      chai.expect(store.map['cell1']).not.empty;
    });

    it('当调用 addSticky 时，默认字号为 12 号', () => {
      let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
      chai.expect(store.map['cell1'].style.fontSize).to.eql(12);
    });
  });

  describe('测试创建文本场景', () => {
    it('当调用 addText 时，将创建一个文本', () => {
      let store = reducer(initialState, addText({ id: 'cell1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
      chai.expect(store.map['cell1']).not.empty;
    });

    it('当调用 addText 时，默认字号为 12 号', () => {
      let store = reducer(initialState, addText({ id: 'cell1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
      chai.expect(store.map['cell1'].style.fontSize).to.eql(12);
    });
  });

  describe('创建线条', () => {
    it('当调用 addLine 时，创建一条线', () => {
      let store = reducer(
        initialState,
        addLine({
          id: 'cell1',
          points: [
            { x: 0, y: 0 },
            { x: 50, y: 50 },
          ],
        }),
      );

      chai.expect(store.map['cell1'].type).eq('LINE');
      chai.expect(store.map['cell1'].points).eql([
        { x: 0, y: 0 },
        { x: 50, y: 50 },
      ]);
    });

    it('当调用 addLine 不带 points 属性时, 创建失败', () => {
      let store = reducer(initialState, addLine({ id: 'cell1' }));
      chai.expect(store.map['cell1']).to.undefined;
    });

    it('当调用 addLine 方法中 points 属性数组长度小于2个时, 创建失败', () => {
      let store = reducer(
        initialState,
        addLine({
          id: 'cell1',
          points: [{ x: 0, y: 0 }],
        }),
      );
      chai.expect(store.map['cell1']).to.undefined;
    });

    it('当调用 addLine 方法中 points 属性数组长度为 0 时, 创建失败', () => {
      let store = reducer(initialState, addLine({ id: 'cell1', points: [] }));
      chai.expect(store.map['cell1']).to.undefined;
    });
  });

  it('当调用 deleteCells 时,删除元素', () => {
    let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
    store = reducer(store, selectDisplayCells(['cell1']));
    store = reducer(store, deleteCells({ cellIds: ['cell1'] }));
    chai.expect(store.selectedCellIds).eqls([]);
    chai.expect(store.map['cell1']).to.undefined;
  });

  it('当调用 selectDisplayCells 时，将选中一个便利贴', () => {
    let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
    store = reducer(store, selectDisplayCells(['cell1']));
    chai.expect(store.selectedCellIds).eqls(['cell1']);
  });

  it('当调用 clearSelected 时，清空之前选择的元素', () => {
    let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));

    store = reducer(store, selectDisplayCells(['cell1']));
    store = reducer(store, clearSelected());
    chai.expect(store.selectedCellIds).length(0);
  });

  it('当调用 clearSelected 时，取消正在编辑的元素', () => {
    let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
    store = reducer(store, editingCell('cell1'));
    store = reducer(store, clearSelected());

    chai.expect(store.operate.editId).to.eq(undefined);
  });

  it('当调用 finishEditing 时，保存元素的文本', () => {
    let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
    store = reducer(store, editingCell('cell1'));
    store = reducer(store, finishEditing({ cellId: 'cell1', text: 'ThinkFreely' }));

    chai.expect(store.map.cell1.text).to.eq('ThinkFreely');
  });

  it('当调用 finishEditing 时，退出编辑态', () => {
    let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
    store = reducer(store, editingCell('cell1'));
    store = reducer(store, finishEditing({ cellId: 'cell1', text: 'ThinkFreely' }));

    chai.expect(store.operate.editId).to.undefined;
  });

  it('当元素不存在调用 finishEditing 时，不会异常', () => {
    let store = reducer(initialState, finishEditing({ cellId: 'cell1', text: 'ThinkFreely' }));

    chai.expect(store.operate.editId).to.undefined;
  });

  it('当调用 moveCell 移动便利贴时，将修改 geometry 值', () => {
    let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 200, y: 200, width: 100, height: 100 } }));
    store = reducer(store, moveCell({ id: 'cell1', point: { x: 100, y: 100 } }));

    chai.expect(store.map['cell1'].geometry).contain({ x: 100, y: 100 });
  });

  it('当调用 moveCell 移动线条贴时，将修改 points 值', () => {
    let store = reducer(
      initialState,
      addLine({
        id: 'cell1',
        points: [
          { x: 100, y: 100 },
          { x: 200, y: 200 },
        ],
      }),
    );
    store = reducer(store, moveCell({ id: 'cell1', point: { x: 50, y: 50 } }));

    chai.expect(store.map['cell1'].points).eql([
      { x: 50, y: 50 },
      { x: 150, y: 150 },
    ]);
  });

  describe('测试 resizeLine 方法', () => {
    it('调整线条大小', () => {
      let store = reducer(
        initialState,
        addLine({
          id: 'cell1',
          points: [
            { x: 100, y: 100 },
            { x: 200, y: 200 },
          ],
        }),
      );
      store = reducer(
        store,
        resizeLine({
          id: 'cell1',
          points: [
            { x: 50, y: 50 },
            { x: 100, y: 100 },
          ],
        }),
      );

      chai.expect(store.map['cell1'].points).eql([
        { x: 50, y: 50 },
        { x: 100, y: 100 },
      ]);
    });

    it('当元素不存在时，修改失败，不会出现异常', () => {
      const store = reducer(
        initialState,
        resizeLine({
          id: 'cell1',
          points: [
            { x: 50, y: 50 },
            { x: 100, y: 100 },
          ],
        }),
      );

      chai.expect(store.map['cell1']).to.undefined;
    });

    it('当 points 的数组长度小于 2，修改失败，不会出现异常', () => {
      let store = reducer(
        initialState,
        addLine({
          id: 'cell1',
          points: [
            { x: 100, y: 100 },
            { x: 200, y: 200 },
          ],
        }),
      );
      store = reducer(
        store,
        resizeLine({
          id: 'cell1',
          points: [{ x: 50, y: 50 }],
        }),
      );

      chai.expect(store.map['cell1'].points).eql([
        { x: 100, y: 100 },
        { x: 200, y: 200 },
      ]);
    });
  });

  describe('测试 moveCellsBySelected', () => {
    it('选中一个元素，移动被选中的元素', () => {
      let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
      store = reducer(store, selectDisplayCells(['cell1']));
      store = reducer(store, moveCellsBySelected({ x: 100, y: 100 }));

      chai.expect(store.map['cell1'].geometry).contain({ x: 100, y: 100 });
    });

    it('选中二个元素，第二个元素也进行相对位置的移动', () => {
      let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 0, y: 0, width: 100, height: 100 } }));
      store = reducer(store, addSticky({ id: 'cell2', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
      store = reducer(store, selectDisplayCells(['cell1', 'cell2']));
      store = reducer(store, moveCellsBySelected({ x: 100, y: 100 }));

      chai.expect(store.map['cell1'].geometry).contain({ x: 100, y: 100 });
      chai.expect(store.map['cell2'].geometry).contain({ x: 150, y: 150 });
    });

    it('没有选中元素时，移动不会异常', () => {
      const store = reducer(initialState, moveCellsBySelected({ x: 100, y: 100 }));

      chai.expect(store.map).contain({});
    });
  });

  describe('测试框选元素', () => {
    it('框选组合元素', () => {
      let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
      store = reducer(store, addSticky({ id: 'cell2', geometry: { x: 100, y: 100, width: 100, height: 100 } }));
      store = reducer(store, createGroup({ id: 'group1', children: ['cell1', 'cell2'] }));
      store = reducer(store, selectCellsByRect({ x: 0, y: 0, width: 60, height: 60 }));

      chai.expect(store.selectedCellIds).eql(['group1', 'cell1', 'cell2']);
    });
  });

  describe('测试修改两个便利贴元素的大小', () => {
    it('E -> W 方向移动 200', () => {
      let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 100, y: 0, width: 50, height: 50 } }));
      store = reducer(store, addSticky({ id: 'cell2', geometry: { x: 150, y: 0, width: 50, height: 50 } }));
      store = reducer(store, selectDisplayCells(['cell1', 'cell2']));
      store = reducer(store, resizeCells({ orgCells: Object.values(store.map), vector: -200, direction: 'E' }));

      chai.expect(store.map['cell1'].geometry).contain({ x: 50, width: 50 });
      chai.expect(store.map['cell2'].geometry).contain({ x: 0, width: 50 });
    });

    it('E -> E 方向移动 100', () => {
      let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 100, y: 0, width: 50, height: 50 } }));
      store = reducer(store, addSticky({ id: 'cell2', geometry: { x: 150, y: 0, width: 50, height: 50 } }));
      store = reducer(store, selectDisplayCells(['cell1', 'cell2']));
      store = reducer(store, resizeCells({ orgCells: Object.values(store.map), vector: 100, direction: 'E' }));

      chai.expect(store.map['cell1'].geometry).contain({ x: 100, width: 100 });
      chai.expect(store.map['cell2'].geometry).contain({ x: 200, width: 100 });
    });

    it('W -> E 方向移动 200', () => {
      let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 100, y: 0, width: 50, height: 50 } }));
      store = reducer(store, addSticky({ id: 'cell2', geometry: { x: 150, y: 0, width: 50, height: 50 } }));
      store = reducer(store, selectDisplayCells(['cell1', 'cell2']));
      store = reducer(store, resizeCells({ orgCells: Object.values(store.map), vector: -200, direction: 'W' }));

      chai.expect(store.map['cell1'].geometry).contain({ x: 250, width: 50 });
      chai.expect(store.map['cell2'].geometry).contain({ x: 200, width: 50 });
    });

    it('W -> W 方向水平翻转 100', () => {
      let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 100, y: 0, width: 50, height: 50 } }));
      store = reducer(store, addSticky({ id: 'cell2', geometry: { x: 150, y: 0, width: 50, height: 50 } }));
      store = reducer(store, selectDisplayCells(['cell1', 'cell2']));
      store = reducer(store, resizeCells({ orgCells: Object.values(store.map), vector: 100, direction: 'W' }));

      chai.expect(store.map['cell1'].geometry).contain({ x: 0, width: 100 });
      chai.expect(store.map['cell2'].geometry).contain({ x: 100, width: 100 });
    });

    it('S -> S 方向移动 100', () => {
      let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 0, y: 100, width: 50, height: 50 } }));
      store = reducer(store, addSticky({ id: 'cell2', geometry: { x: 0, y: 150, width: 50, height: 50 } }));
      store = reducer(store, selectDisplayCells(['cell1', 'cell2']));
      store = reducer(store, resizeCells({ orgCells: Object.values(store.map), vector: 100, direction: 'S' }));

      chai.expect(store.map['cell1'].geometry).contain({ y: 100, height: 100 });
      chai.expect(store.map['cell2'].geometry).contain({ y: 200, height: 100 });
    });

    it('S -> N 方向移动 200', () => {
      let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 0, y: 100, width: 50, height: 50 } }));
      store = reducer(store, addSticky({ id: 'cell2', geometry: { x: 0, y: 150, width: 50, height: 50 } }));
      store = reducer(store, selectDisplayCells(['cell1', 'cell2']));
      store = reducer(store, resizeCells({ orgCells: Object.values(store.map), vector: -200, direction: 'S' }));

      chai.expect(store.map['cell1'].geometry).contain({ y: 50, height: 50 });
      chai.expect(store.map['cell2'].geometry).contain({ y: 0, height: 50 });
    });

    it('N -> N 方向移动 100', () => {
      let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 0, y: 100, width: 50, height: 50 } }));
      store = reducer(store, addSticky({ id: 'cell2', geometry: { x: 0, y: 150, width: 50, height: 50 } }));
      store = reducer(store, selectDisplayCells(['cell1', 'cell2']));
      store = reducer(store, resizeCells({ orgCells: Object.values(store.map), vector: 100, direction: 'N' }));

      chai.expect(store.map['cell1'].geometry).contain({ y: 0, height: 100 });
      chai.expect(store.map['cell2'].geometry).contain({ y: 100, height: 100 });
    });

    it('N -> S 方向移动 200', () => {
      let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 0, y: 100, width: 50, height: 50 } }));
      store = reducer(store, addSticky({ id: 'cell2', geometry: { x: 0, y: 150, width: 50, height: 50 } }));
      store = reducer(store, selectDisplayCells(['cell1', 'cell2']));
      store = reducer(store, resizeCells({ orgCells: Object.values(store.map), vector: -200, direction: 'N' }));

      chai.expect(store.map['cell1'].geometry).contain({ y: 250, height: 50 });
      chai.expect(store.map['cell2'].geometry).contain({ y: 200, height: 50 });
    });
  });

  describe('测试修改一个便利贴和一根线条的大小', () => {
    let store: CellState;
    beforeEach(() => {
      store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
      store = reducer(
        store,
        addLine({
          id: 'line1',
          points: [
            { x: 50, y: 150 },
            { x: 100, y: 175 },
            { x: 150, y: 250 },
          ],
        }),
      );
      store = reducer(store, selectDisplayCells(['cell1', 'line1']));
    });

    it('W -> E 方向移动 50px', () => {
      store = reducer(store, resizeCells({ orgCells: Object.values(store.map), vector: -50, direction: 'W' }));

      chai.expect(store.map['cell1'].geometry).contain({ x: 100, width: 50 });
      chai.expect(store.map['line1'].points).eqls([
        { x: 100, y: 150 },
        { x: 125, y: 175 },
        { x: 150, y: 250 },
      ]);
    });

    it('W -> W 方向移动 50px', () => {
      store = reducer(store, resizeCells({ orgCells: Object.values(store.map), vector: 50, direction: 'W' }));

      chai.expect(store.map['cell1'].geometry).contain({ x: 0, width: 150 });
      chai.expect(store.map['line1'].points).eqls([
        { x: 0, y: 150 },
        { x: 75, y: 175 },
        { x: 150, y: 250 },
      ]);
    });

    it('E -> W 方向移动 50px', () => {
      store = reducer(store, resizeCells({ orgCells: Object.values(store.map), vector: -50, direction: 'E' }));

      chai.expect(store.map['cell1'].geometry).contain({ x: 50, width: 50 });
      chai.expect(store.map['line1'].points).eqls([
        { x: 50, y: 150 },
        { x: 75, y: 175 },
        { x: 100, y: 250 },
      ]);
    });

    it('E -> E 方向移动 50px', () => {
      store = reducer(store, resizeCells({ orgCells: Object.values(store.map), vector: 50, direction: 'E' }));

      chai.expect(store.map['cell1'].geometry).contain({ x: 50, width: 150 });
      chai.expect(store.map['line1'].points).eqls([
        { x: 50, y: 150 },
        { x: 125, y: 175 },
        { x: 200, y: 250 },
      ]);
    });

    it('N -> S 方向移动 50px', () => {
      store = reducer(store, resizeCells({ orgCells: Object.values(store.map), vector: -50, direction: 'N' }));

      chai.expect(store.map['cell1'].geometry).contain({ y: 100, height: 75 });
      chai.expect(store.map['line1'].points).eqls([
        { x: 50, y: 175 },
        { x: 100, y: 193.75 }, // (1- (125 / 200)) * 50
        { x: 150, y: 250 },
      ]);
    });

    it('N -> N 方向移动 50px', () => {
      store = reducer(store, resizeCells({ orgCells: Object.values(store.map), vector: 50, direction: 'N' }));

      chai.expect(store.map['cell1'].geometry).contain({ y: 0, height: 125 });
      chai.expect(store.map['line1'].points).eqls([
        { x: 50, y: 125 },
        { x: 100, y: 156.25 },
        { x: 150, y: 250 },
      ]);
    });

    it('S -> N 方向移动 50px', () => {
      store = reducer(store, resizeCells({ orgCells: Object.values(store.map), vector: -50, direction: 'S' }));

      chai.expect(store.map['cell1'].geometry).contain({ y: 50, height: 75 });
      chai.expect(store.map['line1'].points).eqls([
        { x: 50, y: 125 },
        { x: 100, y: 143.75 },
        { x: 150, y: 200 },
      ]);
    });

    it('N -> N 方向移动 50px', () => {
      store = reducer(store, resizeCells({ orgCells: Object.values(store.map), vector: 50, direction: 'S' }));

      chai.expect(store.map['cell1'].geometry).contain({ y: 50, height: 125 });
      chai.expect(store.map['line1'].points).eqls([
        { x: 50, y: 175 },
        { x: 100, y: 206.25 },
        { x: 150, y: 300 },
      ]);
    });
  });

  describe('测试修改组合元素大小', () => {
    it('修改组合元素大小', () => {
      let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 100, y: 0, width: 100, height: 100 } }));
      store = reducer(store, addSticky({ id: 'cell2', geometry: { x: 200, y: 100, width: 100, height: 100 } }));
      store = reducer(store, createGroup({ id: 'group1', children: ['cell1', 'cell2'] }));
      store = reducer(store, resizeCells({ orgCells: Object.values(store.map), vector: 100, direction: 'E' }));

      chai.expect(store.map['cell1'].geometry).contain({ x: 100, width: 150 });
      chai.expect(store.map['cell2'].geometry).contain({ x: 250, width: 150 });
    });
  });

  describe('测试组合', () => {
    it('组合两个元素时，Group 的 children 包含两个元素的 ID', () => {
      let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
      store = reducer(store, addSticky({ id: 'cell2', geometry: { x: 100, y: 100, width: 100, height: 100 } }));
      store = reducer(store, createGroup({ id: 'group1', children: ['cell1', 'cell2'] }));

      chai.expect(store.map['group1'].type).eql('GROUP');
      chai.expect(store.map['group1'].children).eql(['cell1', 'cell2']);
    });

    it('组合两个元素时，children 元素的 Group ID 指向 Group', () => {
      let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
      store = reducer(store, addSticky({ id: 'cell2', geometry: { x: 100, y: 100, width: 100, height: 100 } }));
      store = reducer(store, createGroup({ id: 'group1', children: ['cell1', 'cell2'] }));

      chai.expect(store.map['cell1'].groupId).eql('group1');
      chai.expect(store.map['cell2'].groupId).eql('group1');
    });

    it('组合小于两个元素时，创建组合失败', () => {
      let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
      store = reducer(store, createGroup({ id: 'group1', children: ['cell1'] }));

      chai.expect(store.map['group1']).undefined;
    });

    describe('测试选中组合', () => {
      it('当选中组合时，组合里的子元素也会被选中', () => {
        let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
        store = reducer(store, addSticky({ id: 'cell2', geometry: { x: 100, y: 100, width: 100, height: 100 } }));
        store = reducer(store, createGroup({ id: 'group1', children: ['cell1', 'cell2'] }));
        store = reducer(store, selectGroup('group1'));

        chai.expect(store.selectedCellIds).eql(['group1', 'cell1', 'cell2']);
      });
    });
  });

  describe('测试移动白板', () => {
    it('当调用 translate 方法输入  x=10、y=10时，CellState 中 translate 的属性会变成 {x:10, y: 10}', () => {
      let store = reducer(initialState, translate({ x: 10, y: 10 }));

      chai.expect(store.translate).contain({ x: 10, y: 10 });
    });
  });

  describe('测试缩放白板', () => {
    it('基于原点坐标缩放 2 倍', () => {
      let store = reducer(initialState, scale({ scale: 2, basePoint: { x: 0, y: 0 } }));

      chai.expect(store.scale).eql(2);
    });

    it('基于(200, 200)坐标放大 150%', () => {
      let store = reducer(initialState, scale({ scale: 1.5, basePoint: { x: 200, y: 200 } }));

      chai.expect(store.translate).contain({ x: -100, y: -100 });
    });

    it('白板右下角偏移 100px, 基于(300, 300)坐标放大 150%', () => {
      let store = reducer(initialState, translate({ x: 100, y: 100 }));
      store = reducer(store, scale({ scale: 1.5, basePoint: { x: 300, y: 300 } }));

      chai.expect(store.translate).contain({ x: 0, y: 0 });
    });

    it('白板放大 150% 后, 基于(300, 300)坐标放大成 200%', () => {
      let store = reducer(initialState, scale({ scale: 1.5, basePoint: { x: 0, y: 0 } }));
      store = reducer(store, scale({ scale: 2, basePoint: { x: 300, y: 300 } }));

      chai.expect(store.translate).contain({ x: -100, y: -100 });
    });

    it('白板右下角偏移 100px 且放大 150% 后, 基于(200, 200)坐标放大成 200%', () => {
      let store = reducer(
        { ...initialState, scale: 1.5, translate: { x: -100, y: -100 } },
        scale({ scale: 2, basePoint: { x: 200, y: 200 } }),
      );

      chai.expect(store.translate).contain({ x: -200, y: -200 });
    });

    describe('测试白板缩放的边界场景', () => {
      it('白板最大只能放大 400%', () => {
        let store = reducer(initialState, scale({ scale: 1, basePoint: { x: 0, y: 0 } }));
        store = reducer(store, scale({ scale: 10, basePoint: { x: 0, y: 0 } }));

        chai.expect(store.scale).eq(4);
      });

      it('白板最大只能缩小 5%', () => {
        let store = reducer(initialState, scale({ scale: 1, basePoint: { x: 0, y: 0 } }));
        store = reducer(store, scale({ scale: 0.01, basePoint: { x: 0, y: 0 } }));

        chai.expect(store.scale).eq(0.05);
      });
    });
  });

  describe('测试编辑元素', () => {
    it('当调用 editingCell 函数入参为 "cell1"时，CellState 中 operate.editId 就设置成 cell1', () => {
      let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
      store = reducer(store, editingCell('cell1'));

      chai.expect(store.operate.editId).eql('cell1');
    });

    it('当编辑的元素不存在时，则设置失败', () => {
      let store = reducer(initialState, addSticky({ id: 'cell1', geometry: { x: 50, y: 50, width: 100, height: 100 } }));
      store = reducer(store, editingCell('cell2'));

      chai.expect(store.operate.editId).eql(undefined);
    });
  });
});
