var color1Dom = getId("color1");

/**
 * 生成图案表格的DOM字符串
 * @param {Array} data
 * @param {string} color
 * @return {string}
 */
function getPatternTable(data, color = "#000") {
  let tableContent = "";
  data.forEach((row) => {
    let rowContent = "<tr>";
    row.forEach((column) => {
      rowContent += `<td style="background: ${column === 1 ? color : 'transparent'}"></td>`;
    });
    tableContent += rowContent + "</tr>";
  });
  let tableStr = `
    <table class="pattern-table">
      <tbody>
        ${tableContent}
      </tbody>
    </table>
  `;
  return tableStr;
}

/**
 * 生成预览图案
 * @param {String} color
 */
function generatePreviewPattern(color = "#000") {
  let domStr = "";
  patterns.forEach((item) => {
    let tableStr = getPatternTable(item.data, color);
    domStr += `
    <li class="pattern-item">
      <p class="name">${item.name}</p>
      ${tableStr}
    </li>
    `;
  });

  getDom(".patterns")[0].innerHTML = domStr;
}

generatePreviewPattern();

/**
 * 绑定点击图案事件
 */
 function bindPickEvent() {
  [...getDom('.patterns .pattern-item')].forEach((item) => {
    item.onclick = function () {
      this.classList.toggle('active');
    }
  });
}

bindPickEvent();

/**
 * 选中的图案
 */
let pickedPatterns = [];

/**
 * 确定挑选图案
 */
function confirmPick() {
  pickedPatterns = [];
  [...getDom('.patterns .pattern-item')].forEach((item, index) => {
    if (item.classList.contains('active')) {
      pickedPatterns.push(patterns[index]);
    }
  });
  console.log(pickedPatterns, 'pickedPatterns');
  
  renderPickedPatterns();
}

getDom('.confirmPick')[0].onclick = confirmPick;

/**
 * 重置选中的数据
 */
function resetPick() {
  pickedPatterns = [];
  [...getDom('.patterns .pattern-item')].forEach((item, index) => {
    item.classList.remove('active');
  });
}

getDom('.clearPick')[0].onclick = resetPick;

/**
 * 渲染选中的图案
 */
function renderPickedPatterns() {
  let domStr = '';
  for (let i = 0, len = pickedPatterns.length; i < len; i++) {
    const item = pickedPatterns[i];
    domStr += `
      <li class="picked-pattern-item">
        <p class="name">${item.name}</p>
        ${getPatternTable(item.data, "#000")}
        <ol class="colors">
          <li class="color-item">
            <input type="color" value="#000000" />
            <button class="delete-color">删除</button>
          </li>
        </ol>
        <button class="add-color">添加颜色</button>
      </li>
    `;
  }
  getDom('.picked-patterns')[0].innerHTML = domStr;

  bindDeleteColor();
  bindAddColor();
}

/**
 * 删除颜色
 */
function bindDeleteColor() {
  [...getDom('.delete-color')].forEach((item) => {
    item.onclick = () => {
      item.parentElement.remove();
    }
  });
}

/**
 * 添加颜色
 */
 function bindAddColor() {
  [...getDom('.add-color')].forEach((item) => {
    item.onclick = () => {
      item.parentElement.getElementsByClassName('colors')[0].innerHTML += `<li class="color-item">
        <input type="color" value="#000000" />
        <button class="delete-color">删除</button>
      </li>`;
    }
  });
}

/**
 * 生成空画板
 * @param {number} row 行数
 * @param {number} column 列数
 */
function generatePanel(row, column) {
  let domStr = "";
  for (let i = 0; i < row; i++) {
    let rowContent = "<tr>";
    for (let j = 0; j < column; j++) {
      rowContent += `<td></td>`;
    }
    domStr += rowContent + "</tr>";
  }

  getDom(".panel-table tbody")[0].innerHTML = domStr;
}

/**
 * 行数
 */
const rowCount = 2;
/**
 * 列数
 */
const columnCount = 5;
generatePanel(rowCount, columnCount);

/**
 * 填充单个图案
 * @param {{data: Array; color: string;}} pattern
 * @param {{rowIndex: number; columnIndex: number;}} position
 */
function fillPatternToPanel(pattern, position) {
  const { rowIndex, columnIndex } = position;
  const td = getDom(`.panel-table > tbody > tr:nth-of-type(${rowIndex + 1}) > td:nth-of-type(${columnIndex + 1})`)[0];
  td.innerHTML = getPatternTable(pattern.data, pattern.color);
}

/**
 * 用随机图案和随机颜色填充画布
 */
function randomFillPanel() {
  for (let i = 0; i < rowCount; i++) {
    for (let j = 0; j < columnCount; j++) {
      // console.log(
      //   {
      //     data: patterns[~~(Math.random() * patterns.length)].data,
      //     color: "#" + Math.random().toString(16).slice(-6),
      //   },
      //   { rowIndex: i, columnIndex: j }
      // );
      fillPatternToPanel(
        {
          data: patterns[~~(Math.random() * patterns.length)].data,
          color: "#" + Math.random().toString(16).slice(-6),
        },
        { rowIndex: i, columnIndex: j }
      );
    }
  }
}

randomFillPanel();
