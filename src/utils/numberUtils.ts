const delta = 15;

const billion = 1000000000;
const million = 1000000;
const strings = {
  billion: 'Tỷ',
  million: 'Triệu',
  commas: ',',
  unit: 'đ',
};
export const numbersOnly = (txt: number | string) => {
  return /^-?[0-9,\.]+$/?.test(txt?.toString()) ? true : txt === '' ? true : false;
};
export const getNumberWithCommas = (x, isFloor = true) =>
  x &&
  `${(isFloor ? Math.floor(+x) : x)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, strings.commas)}`;
export const getPriceWithCommas = (x = 0, isFloor = true) =>
  `${(isFloor ? Math.floor(+x) : x)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, strings.commas)}${
    strings.unit
  }`;

export const getNumberFromString = (x: string) => {
  const y = x?.replace(/,/g, '');
  if (y.length === 0) {
    return 0;
  }
  return parseInt(y, 10);
};

export const getStringWithoutCommas = (x: string) => {
  const y = x?.replace(/,/g, '');
  if (y.length === 0) {
    return '';
  }
  return y;
};

export const getNumberWithCommasFromString = (x: string) => {
  if (x?.length >= 21) {
    return x?.slice(0, 20);
  }
  const y = x?.replace(/\,/g, '');
  let res = '';
  let count = 0;
  for (let i = y.length - 1; i >= 0; i--) {
    res = y.charAt(i) + res;
    count++;
    if (count % 3 === 0 && i !== 0) {
      res = `,${res}`;
    }
  }
  return res;
};

export const getSizeForLongText = (text: string | any[]) =>
  delta - ((text.length + 1) * (delta / 2)) / 11;

export function mergerTwoArray(array1: any[], array2: any[]) {
  const temp = array2.filter((element: {id: any}) => {
    const found = array1.find((item: {id: any}) => item.id === element.id);
    return !found;
  });
  return [...array1, ...temp];
}

export const getNumberString = (value: number | string | any) => {
  const x = Math.floor(+value);
  if (x / billion >= 1) {
    if (x % billion === 0) {
      return `${(x / billion).toFixed(0)} ${strings.billion}`;
    }
    return `${(x / billion).toFixed(3)} ${strings.billion}`;
  } else if (x / million >= 1) {
    if (x % million === 0) {
      return `${(x / million).toFixed(0)} ${strings.million}`;
    }
    return `${(x / 1000000).toFixed(3)} ${strings.million}`;
  }
  return `${getNumberWithCommas(x || 0)}${strings.unit}`;
};

export const getToppingDescription = (item: {
  product: {name: string; size: any};
  options: any[];
}) => {
  let fill = '';
  if (item.product && item.product.name && item.product.name.toLowerCase().includes('quà tặng')) {
  } else {
    fill =
      item.product && item.product.name && item.product.name.toLowerCase().includes('nóng')
        ? 'Nóng'
        : 'Lạnh';
  }
  if (item.product && item.product.size) {
    if (fill === '') {
      fill = `Size ${item.product.size}`;
    } else {
      fill = `${fill}, size ${item.product.size}`;
    }
  }
  if (item.options) {
    item.options.forEach((e: {name: any}, i: any) => {
      if (e && e.name) {
        if (fill === '') {
          fill = `${e.name}`;
        } else {
          fill = `${fill}, ${e.name}`;
        }
      }
    });
  }
  return fill;
};
