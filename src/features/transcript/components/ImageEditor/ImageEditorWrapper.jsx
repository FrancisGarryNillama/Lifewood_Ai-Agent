import React from 'react';
import { useImageEditor } from '../../hooks/useImageEditor';
import EditorDialog from './EditorDialog';

export default function ImageEditorWrapper({ image, isOpen, onClose, onSave }) {
  const editor = useImageEditor();

  const handleImageLoad = () => {
    const defaultCrop = {
      unit: '%',
      width: 90,
      height: 90,
      x: 5,
      y: 5,
    };
    editor.setCrop(defaultCrop);
    editor.setPercentCrop(defaultCrop);
  };

  const handleSave = () => {
    if (!editor.isEditing) {
      onSave(image);
      onClose();
      return;
    }

    // Create canvas and apply transforms
    if (!editor.imgRef.current) {
      onClose();
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const imgElement = editor.imgRef.current;

    canvas.width = imgElement.width * editor.previewScale;
    canvas.height = imgElement.height * editor.previewScale;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((editor.rotate * Math.PI) / 180);

    const skewX = (editor.horizontalPerspective * Math.PI) / 180;
    const skewY = (editor.verticalPerspective * Math.PI) / 180;
    ctx.transform(1, Math.tan(skewY), Math.tan(skewX), 1, 0, 0);

    ctx.drawImage(
      imgElement,
      -imgElement.width / 2,
      -imgElement.height / 2,
      imgElement.width,
      imgElement.height
    );
    ctx.restore();

    const newSrc = canvas.toDataURL('image/png');
    const editedImage = { ...image, src: newSrc };

    onSave(editedImage);
    editor.reset();
    onClose();
  };

  return (
    <EditorDialog
      isOpen={isOpen}
      onClose={onClose}
      image={image}
      crop={editor.crop}
      onCropChange={(pixelCrop, percentCrop) => {
        editor.setCrop(pixelCrop);
        editor.setPercentCrop(percentCrop);
      }}
      onCropComplete={editor.setCompletedCrop}
      onImageLoad={handleImageLoad}
      imgRef={editor.imgRef}
      previewRef={editor.previewRef}
      imageTransformStyle={editor.imageTransformStyle}
      percentCrop={editor.percentCrop}
      previewScale={editor.previewScale}
      verticalPerspective={editor.verticalPerspective}
      horizontalPerspective={editor.horizontalPerspective}
      rotate={editor.rotate}
      setVerticalPerspective={editor.setVerticalPerspective}
      setHorizontalPerspective={editor.setHorizontalPerspective}
      setRotate={editor.setRotate}
      setPreviewScale={editor.setPreviewScale}
      onSave={handleSave}
      isEditing={editor.isEditing}
      setIsEditing={editor.setIsEditing}
    />
  );
}