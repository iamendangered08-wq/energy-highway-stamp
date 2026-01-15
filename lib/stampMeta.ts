export const STAMP_META = [
  { id: 1, label: "1", iconPath: "/icons/stamp/1.svg" },
  { id: 2, label: "2", iconPath: "/icons/stamp/2.svg" },
  { id: 3, label: "3", iconPath: "/icons/stamp/3.svg" },
  { id: 4, label: "4", iconPath: "/icons/stamp/4.svg" },
  { id: 5, label: "5", iconPath: "/icons/stamp/5.svg" },
  { id: 6, label: "6", iconPath: "/icons/stamp/6.svg" },
  { id: 7, label: "7", iconPath: "/icons/stamp/7.svg" }
];

export function getStampMeta(id: number) {
  return STAMP_META.find((x) => x.id === id);
}
