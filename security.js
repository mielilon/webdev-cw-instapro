export const replaceMethod = (el) => {
  return el.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
};