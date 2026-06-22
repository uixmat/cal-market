import type * as React from "react";

import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";
import {
  formatCategoryLabel,
  getCategoryBadgeVariant,
} from "@/lib/category-badge";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps extends Omit<BadgeProps, "children" | "variant"> {
  category: string;
}

export function CategoryBadge({
  category,
  className,
  size = "sm",
  ...props
}: CategoryBadgeProps): React.ReactElement {
  return (
    <Badge
      className={cn(className)}
      size={size}
      variant={getCategoryBadgeVariant(category)}
      {...props}
    >
      {formatCategoryLabel(category)}
    </Badge>
  );
}
