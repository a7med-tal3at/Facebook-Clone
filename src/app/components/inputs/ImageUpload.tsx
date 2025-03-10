'use client';

import Image from 'next/image';
import { useCallback } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { TbPhotoPlus } from 'react-icons/tb';

declare global {
  var cloudinary: any;
}

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
  const handleUpload = useCallback(
    (result: any) => {
      onChange(result.info.secure_url);
    },
    [onChange]
  );

  return (
    <CldUploadWidget
      onUpload={handleUpload}
      uploadPreset="mn6wsaeb"
      options={{
        maxFiles: 1,
      }}
    >
      {({ open }) => {
        function handleOnClick(e: React.MouseEvent<HTMLDivElement>) {
          e.preventDefault();
          open();
        }
        return (
          <div
            onClick={handleOnClick}
            className="relative flex flex-col items-center justify-center
						gap-4 p-20 mx-auto max-w-[300px] overflow-hidden text-neutral-600 
						rounded-full border-2 border-neutral-300 border-dashed
						cursor-pointer aspect-square hover:opacity-70 transition"
          >
            <TbPhotoPlus size={50} />
            <div className="text-lg font-semibold">Click to upload</div>

            {value && (
              <div className="absolute inset-0 w-full h-full">
                <Image alt="upload" fill style={{ objectFit: 'cover' }} src={value} />
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;
