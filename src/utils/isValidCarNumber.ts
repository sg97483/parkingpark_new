export const isValidCarNumber = (carNum: string): boolean => {
  let returnValue = false;

  try {
    const regex = /^(\d{2})([가-힣]{1})(\d{4})\/?$/;

    const pattern = new RegExp(regex);
    const matches = carNum.match(pattern);

    if (matches && matches.length === 4) {
      returnValue = true;
    } else {
      // 2nd pattern processing
      const secondRegex = /^(\d{3})([가-힣]{1})(\d{4})\/?$/;

      const secondPattern = new RegExp(secondRegex);
      const secondMatches = carNum.match(secondPattern);

      if (secondMatches && secondMatches.length === 4) {
        returnValue = true;
      }
    }

    return returnValue;
  } catch (e) {
    return false;
  }
};
