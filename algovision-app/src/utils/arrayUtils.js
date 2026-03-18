export const generateRandomArray = (size = 15, min = 10, max = 100) => {
  return Array.from({ length: size }, () => ({
    id: Math.random().toString(36).substring(2, 9),
    val: Math.floor(Math.random() * (max - min + 1)) + min
  }));
};
