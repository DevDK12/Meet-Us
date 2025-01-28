


export const calculateFinalPos = (x: number, y: number, containerWidth: number, containerHeight: number) => {

  //_ distance from all corners
  const distances = {
    topLeft: Math.sqrt(x ** 2 + y ** 2),
    topRight: Math.sqrt((containerWidth - x) ** 2 + y ** 2),
    bottomLeft: Math.sqrt(x ** 2 + (containerHeight - y) ** 2),
    bottomRight: Math.sqrt((containerWidth - x) ** 2 + (containerHeight - y) ** 2),
  };

  type TDirections = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  const closestCorner = Object.keys(distances).reduce((a, b) => distances[a] < distances[b] ? a : b) as TDirections;

  let finalX = 0;
  let finalY = 0;

  switch (closestCorner) {
    case 'topLeft':
      finalX = 10;
      finalY = 10;
      break;
    case 'topRight':
      finalX = containerWidth - containerWidth * 0.24 - 10;
      finalY = 10;
      break;
    case 'bottomLeft':
      finalX = 10;
      finalY = containerHeight - containerHeight * 0.26 - 20;
      break;
    case 'bottomRight':
      finalX = containerWidth - containerWidth * 0.24 - 10;
      finalY = containerHeight - containerHeight * 0.26 - 20;
      break;
  }

  return { finalX, finalY };
}