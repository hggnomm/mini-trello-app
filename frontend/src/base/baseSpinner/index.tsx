import "../../style/loader.scss";
import { cn } from "../../utils/cn";

type BaseSpinnerProps = {
  className?: string;
};

const BaseSpinner = ({ className }: BaseSpinnerProps) => {
  return <div className={cn("loader", className)} />;
};

export default BaseSpinner;
