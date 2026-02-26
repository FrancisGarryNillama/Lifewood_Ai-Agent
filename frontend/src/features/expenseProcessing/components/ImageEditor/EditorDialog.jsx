import React from 'react';
import { Modal, ModalContent, ModalFooter, Button } from '../../../../components/common';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import EditorControls from './EditorControls';

export default function EditorDialog({
  isOpen,
  onClose,
  image,
  crop,
  onCropChange,
  onCropComplete,
  onImageLoad,
  imgRef,
  previewRef,
  imageTransformStyle,
  percentCrop,
  previewScale,
  verticalPerspective,
  horizontalPerspective,
  rotate,
  setVerticalPerspective,
  setHorizontalPerspective,
  setRotate,
  setPreviewScale,
  onSave,
  isEditing,
  setIsEditing,
}) {
  if (!image) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Image" size="full">
      <ModalContent>
        {!isEditing ? (
          <div className="text-center py-8">
            <img
              src={image.src}
              alt="Preview"
              className="max-w-md h-auto mx-auto rounded-lg border"
            />
          </div>
        ) : (
          <div className="flex flex-col h-full max-h-[calc(100vh-200px)]">
            {/* Edit and Preview Section - Takes remaining space */}
            <div className="flex-1 flex flex-col md:flex-row gap-4 items-stretch min-h-0">
              {/* Edit View */}
              <div className="flex-1 flex flex-col min-h-0">
                <h4 className="text-lg font-medium text-center mb-2">Edit</h4>
                <div
                  className="flex-1 min-h-0 mx-auto rounded-md overflow-auto scrollbar-thin"
                  style={{
                    perspective: '1000px',
                    border: '1px solid #ccc',
                    background: '#f8f8f8',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      ...imageTransformStyle,
                      transform: `scale(${previewScale}) ${imageTransformStyle.transform}`,
                      width: '100%',
                      minHeight: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      paddingTop: '0.5rem',
                      paddingLeft: '1rem',
                      paddingRight: '1rem',
                      paddingBottom: '1rem',
                    }}
                  >
                    {/* Wrapper to limit ReactCrop size in fullscreen */}
                    <div style={{ maxWidth: '85%', maxHeight: '85%' }}>
                      <ReactCrop
                        crop={crop}
                        onChange={onCropChange}
                        onComplete={onCropComplete}
                      >
                        <img
                          ref={imgRef}
                          alt="Edit"
                          src={image.src}
                          style={{
                            objectFit: 'contain',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            width: 'auto',
                            height: 'auto',
                          }}
                          onLoad={onImageLoad}
                        />
                      </ReactCrop>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="flex-1 flex flex-col min-h-0">
                <h4 className="text-lg font-medium text-center mb-2">
                  Live Preview
                </h4>
                <div
                  ref={previewRef}
                  className="flex-1 min-h-0 mx-auto rounded-md overflow-hidden"
                  style={{
                    perspective: '1000px',
                    border: '1px solid #ccc',
                    background: '#f8f8f8',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      ...imageTransformStyle,
                      transform: `scale(${previewScale}) ${imageTransformStyle.transform}`,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '1rem',
                    }}
                  >
                    <img
                      alt="Live Preview"
                      src={image.src}
                      style={{
                        objectFit: 'contain',
                        maxWidth: 'min(100%, 1200px)',
                        maxHeight: 'min(100%, 800px)',
                        width: 'auto',
                        height: 'auto',
                        clipPath: percentCrop
                          ? `inset(${percentCrop.y}% ${100 - (percentCrop.x + percentCrop.width)
                          }% ${100 - (percentCrop.y + percentCrop.height)
                          }% ${percentCrop.x}%)`
                          : 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Controls - Compact at bottom */}
            <div className="mt-3 flex-shrink-0">
              <EditorControls
                verticalPerspective={verticalPerspective}
                setVerticalPerspective={setVerticalPerspective}
                horizontalPerspective={horizontalPerspective}
                setHorizontalPerspective={setHorizontalPerspective}
                rotate={rotate}
                setRotate={setRotate}
                previewScale={previewScale}
                setPreviewScale={setPreviewScale}
              />
            </div>
          </div>
        )}
      </ModalContent>

      <ModalFooter>
        {!isEditing ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button onClick={onSave}>Done</Button>
          </>
        ) : (
          <Button onClick={onSave}>Done Editing</Button>
        )}
      </ModalFooter>
    </Modal>
  );
}