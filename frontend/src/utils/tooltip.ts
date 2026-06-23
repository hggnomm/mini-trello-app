import { TOOLTIP_POSITION } from "@/constants/tooltip";

export const getTooltipPositionClasses = (tooltipPosition: string) => {
  return {
    "bottom-full mb-3": [
      TOOLTIP_POSITION.TOP,
      TOOLTIP_POSITION.TOP_RIGHT,
      TOOLTIP_POSITION.TOP_LEFT,
    ].includes(tooltipPosition),

    "top-full mt-3": [
      TOOLTIP_POSITION.BOTTOM,
      TOOLTIP_POSITION.BOTTOM_RIGHT,
      TOOLTIP_POSITION.BOTTOM_LEFT,
    ].includes(tooltipPosition),

    "left-1/2 -translate-x-1/2": [
      TOOLTIP_POSITION.TOP,
      TOOLTIP_POSITION.BOTTOM,
    ].includes(tooltipPosition),

    "right-0": [
      TOOLTIP_POSITION.TOP_RIGHT,
      TOOLTIP_POSITION.BOTTOM_RIGHT,
    ].includes(tooltipPosition),

    "left-0": [
      TOOLTIP_POSITION.TOP_LEFT,
      TOOLTIP_POSITION.BOTTOM_LEFT,
    ].includes(tooltipPosition),
  };
};
