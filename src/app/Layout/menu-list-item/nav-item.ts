export interface NavItem {
  displayName: string;
  disabled?: boolean;
  iconName: string;
  isSvgIcon:boolean;
  route?: string;
  children?: NavItem[];
}
