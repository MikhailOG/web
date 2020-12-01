export function elementOrAncestorHasClass(element, className) {
    if (!element || element.length === 0) {
      return false;
    }
    var parent = element;
    do {
      if (parent === document) {
        break;
      }
      if (parent.className.indexOf(className) >= 0) {
        return true;
      }
    } while (parent = parent.parentNode);
    return false;
  }