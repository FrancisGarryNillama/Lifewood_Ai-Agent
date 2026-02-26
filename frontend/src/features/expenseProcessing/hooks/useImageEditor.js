import { useRef, useState } from 'react';

export function useImageEditor() {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [percentCrop, setPercentCrop] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [rotate, setRotate] = useState(0);
  const [verticalPerspective, setVerticalPerspective] = useState(0);
  const [horizontalPerspective, setHorizontalPerspective] = useState(0);
  const [previewScale, setPreviewScale] = useState(1);

  const imgRef = useRef(null);
  const previewRef = useRef(null);

  const imageTransformStyle = {
    transform: `rotateX(${verticalPerspective}deg) rotateY(${horizontalPerspective}deg) rotate(${rotate}deg)`,
    transition: 'transform 0.15s ease-out',
  };

  const reset = () => {
    setCrop(undefined);
    setCompletedCrop(null);
    setPercentCrop(null);
    setIsEditing(false);
    setRotate(0);
    setVerticalPerspective(0);
    setHorizontalPerspective(0);
    setPreviewScale(1);
  };

  return {
    crop,
    setCrop,
    completedCrop,
    setCompletedCrop,
    percentCrop,
    setPercentCrop,
    isEditing,
    setIsEditing,
    rotate,
    setRotate,
    verticalPerspective,
    setVerticalPerspective,
    horizontalPerspective,
    setHorizontalPerspective,
    previewScale,
    setPreviewScale,
    imgRef,
    previewRef,
    imageTransformStyle,
    reset,
  };
}


