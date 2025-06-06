import React from 'react';


export function ImagePlaceHolder({ width, height, alt = "" }: { width?: string | number; height?: string | number, alt?: string }) {
    return (
        <div
            style={{
                width: typeof width === "number" ? `${width}px` : width,
                height: typeof height === "number" ? `${height}px` : height,
                backgroundColor: "#cccccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "monospace",
                color: "#333333",
                overflow: "hidden",
            }}
            aria-label={alt}
        >
            {alt}
        </div>
    );
}