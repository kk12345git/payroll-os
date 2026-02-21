import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    variant?: 'rect' | 'circle' | 'text';
}

export function Skeleton({ className, variant = 'rect', ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse bg-muted/60 relative overflow-hidden",
                variant === 'circle' && "rounded-full",
                variant === 'rect' && "rounded-xl",
                variant === 'text' && "rounded h-4 w-full",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="card-extreme space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton variant="circle" className="w-12 h-12" />
                <div className="space-y-2 flex-1">
                    <Skeleton variant="text" className="w-1/3" />
                    <Skeleton variant="text" className="w-1/2" />
                </div>
            </div>
            <Skeleton className="h-24" />
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 border-b border-border/50">
                    <Skeleton variant="circle" className="w-8 h-8" />
                    <Skeleton variant="text" className="flex-1" />
                    <Skeleton variant="text" className="w-24" />
                    <Skeleton variant="text" className="w-32" />
                </div>
            ))}
        </div>
    );
}
