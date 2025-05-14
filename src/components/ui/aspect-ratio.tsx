
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

// Add a simple className prop to allow for better styling
interface AspectRatioProps extends React.ComponentProps<typeof AspectRatioPrimitive.Root> {
  className?: string;
}

const AspectRatio = ({ className, ...props }: AspectRatioProps) => (
  <AspectRatioPrimitive.Root className={className} {...props} />
)

export { AspectRatio }
