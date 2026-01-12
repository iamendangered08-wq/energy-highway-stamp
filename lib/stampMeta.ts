export type StampMeta = {
  id: number;
  label: string;
  // 간단한 inline SVG 아이콘(원하면 나중에 교체 가능)
  icon: (props?: { size?: number }) => string;
};

const iconWrap = (path: string, size = 22) => `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
     xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  ${path}
</svg>
`;

// 아이콘은 임시(전력/고속도로 무드). 원하면 구역에 맞게 교체해줄게.
export const STAMP_META: StampMeta[] = [
  {
    id: 1,
    label: "Energy Highway",
    icon: ({ size = 22 } = {}) =>
      iconWrap(`<path d="M4 20V4m16 16V4M9 20l2-4h2l2 4M11 10h2M11 14h2"
        stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`, size)
  },
  {
    id: 2,
    label: "HVDC",
    icon: ({ size = 22 } = {}) =>
      iconWrap(`<path d="M7 6v12M17 6v12M10
