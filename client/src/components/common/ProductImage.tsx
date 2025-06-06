import React, { ImgHTMLAttributes, useState } from 'react';

const ProductImage: React.FC<ImgHTMLAttributes<HTMLImageElement>> = ({ src, alt, className, ...props }) => {
    const [hasError, setHasError] = useState(false);

    if (hasError || !src) {
        return (
            <div
                className={"flex items-center justify-center bg-gray-300 font-mono text-gray-800 overflow-hidden " + className}
                aria-label={alt}
                {...props}
            >
                {alt}
            </div>
        )
    }
    return (
        <img
            onError={() => setHasError(true)}
            src={src}
            alt={alt}
            className={className}
            {...props}
        />
    );
};

export default ProductImage;
