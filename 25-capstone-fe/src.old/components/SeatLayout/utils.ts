const DEFAULT_SIZE = 65;
const DEFAULT_PADDING = 5;

interface Position {
  x: number;
  y: number;
}

interface Size {
  u?: number;
  h?: number;
  w?: number;
}

interface Rotation {
  x?: number;
  y?: number;
  a?: number;
}

interface ComputedParams {
  x: number;
  y: number;
  u: number;
  h: number;
  rx: number;
  ry: number;
  a: number;
}

interface Point {
  x: number;
  y: number;
}

interface BoundingBox {
  min: Point;
  max: Point;
}

export function getComputedParams(
  position: Position,
  size: Size,
  rotation: Rotation = {}
): ComputedParams {
  const u = size.u || size.w || 1;
  const h = size.h || 1;

  return {
    x: position.x * (DEFAULT_SIZE + DEFAULT_PADDING),
    y: position.y * (DEFAULT_SIZE + DEFAULT_PADDING),
    u: u * DEFAULT_SIZE + DEFAULT_PADDING * (u - 1),
    h: h * DEFAULT_SIZE + DEFAULT_PADDING * (h - 1),
    rx:
      (position.x - (rotation.x || position.x)) *
      -(DEFAULT_SIZE + DEFAULT_PADDING),
    ry:
      (position.y - (rotation.y || position.y)) *
      -(DEFAULT_SIZE + DEFAULT_PADDING),
    a: rotation.a || 0,
  };
}

export function getSeatStyles(
  position: Position,
  size: Size = {},
  rotation: Rotation = {}
) {
  const { x, y, u, h, a, rx, ry } = getComputedParams(position, size, rotation);

  return {
    top: `${y}px`,
    left: `${x}px`,
    width: `${u}px`,
    height: `${h}px`,
    transformOrigin: `${rx}px ${ry}px`,
    transform: `rotate(${a || 0}deg)`,
  };
}

export function getSeatBoundingBox(
  position: Position,
  size: Size = {},
  rotation: Rotation = {}
): BoundingBox {
  const { x, y, u, h, a, rx, ry } = getComputedParams(position, size, rotation);

  const points: Point[] = [
    { x: 0, y: 0 },
    { x: u, y: 0 },
    { x: u, y: h },
    { x: 0, y: h },
  ];

  function translate(point: Point): Point {
    return {
      x: point.x + x,
      y: point.y + y,
    };
  }

  function rotate(point: Point): Point {
    const x = point.x - rx;
    const y = point.y - ry;
    const angle = (Math.PI * a) / 180;

    return {
      x: rx + x * Math.cos(angle) - y * Math.sin(angle),
      y: ry + y * Math.cos(angle) + x * Math.sin(angle),
    };
  }

  const transformed = points.map(rotate).map(translate);
  const xValues = transformed.map((p) => p.x);
  const yValues = transformed.map((p) => p.y);
  const min = {
    x: Math.min(...xValues),
    y: Math.min(...yValues),
  };
  const max = {
    x: Math.max(...xValues),
    y: Math.max(...yValues),
  };

  return { min, max };
}
