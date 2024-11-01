import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';

import { useModalAnimation } from 'hooks/useModalAnimation';

interface ModalWrapperProps {
  children: React.ReactNode;
  onClose: () => void;
}

const ModalWrapper = ({ children, onClose }: ModalWrapperProps) => {
  const { isVisible, handleClose } = useModalAnimation(onClose);

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          animate={{ opacity: 1 }}
          className='fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50'
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={handleContainerClick}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{ scale: 1, opacity: 1 }}
            className='absolute bottom-0 rounded-[10px] bg-white p-[1rem] shadow-lg md:static'
            exit={{ scale: 0.8, opacity: 0 }}
            initial={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className='flex flex-col'>
              <div className='mb-4 flex justify-end'>
                <motion.button
                  className='text-[2rem] text-gray-500 hover:text-gray-700'
                  onClick={handleClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IoMdClose />
                </motion.button>
              </div>
              <div>{children}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalWrapper;
