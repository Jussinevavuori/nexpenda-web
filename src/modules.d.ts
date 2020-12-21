declare module "react-responsive-masonry" {
  export interface MasonryProps {
    children?: import("react").ReactNode;
    columnsCount?: number;
    gutter?: string;
    className?: string;
    style?: import("react").CSSProperties;
  }
  export interface ResponsiveMasonryProps {
    children?: import("react").ReactNode;
    columnsCountBreakPoints?: Record<number, number>;
    className?: string;
    style?: import("react").CSSProperties;
  }

  export default (props: MasonryProps) => ReactNode;

  export const ResponsiveMasonry = (props: ResponsiveMasonryProps) => ReactNode;
}
